import { resourceManager } from "../resourceManager.js";
import type { Resource } from "../resourceManager.js";
import { clamp, pick, noop } from "../utils.js";

export interface ChannelOptions {
  muted: boolean;
  volume: number;
  panning: number;
}

export interface SingleChannelPlayOptions {
  loop: boolean;
  callback: () => void;
  playbackRate: number;
}

export interface MultiChannelPlayOptions {
  callback: () => void;
  playbackRate: number;
}

export const canPlay = {
  opus: false,
  ogg: false,
  mp3: false,
  m4a: false,
  wav: false,
};

// Setup Web Audio API
const audioCtx = new AudioContext();

// Setup HTML5 Audio
(() => {
  const a = new Audio();

  if (a.canPlayType('audio/ogg; codecs="opus"') === "probably") {
    canPlay.opus = true;
  }

  if (a.canPlayType('audio/ogg; codecs="vorbis"') === "probably") {
    canPlay.ogg = true;
  }

  // When testing for mp3 support, some implementations always return 'maybe' to canPlayType
  if (
    a.canPlayType('audio/mpeg; codecs="mp3"') === "probably" ||
    a.canPlayType('audio/mpeg; codecs="mp3"') === "maybe"
  ) {
    canPlay.mp3 = true;
  }

  if (
    a.canPlayType('audio/mp4; codecs="mp4a.40.5"') === "probably" ||
    a.canPlayType('audio/mp4; codecs="mp4a.40.2"') === "probably"
  ) {
    canPlay.m4a = true;
  }

  if (a.canPlayType('audio/wav; codecs="1"') === "probably") {
    canPlay.wav = true;
  }
})();

export class Sound implements Resource {
  soundURL = "";
  streaming = false;

  _initialized = false;
  _audio: HTMLAudioElement | null = null;
  _source: MediaElementAudioSourceNode | null = null;
  _audioBuffer: AudioBuffer | null = null;
  _waitAudioBuffer = false;

  constructor(
    soundURLs:
      | string
      | string[]
      | Partial<Record<keyof typeof canPlay, string>>,
    options?: { streaming: boolean }
  ) {
    if (options?.streaming) {
      this.streaming = true;
    }

    // Determine the sound URL
    if (typeof soundURLs === "string") {
      this.soundURL = soundURLs;
    } else if (Array.isArray(soundURLs)) {
      // Check which sound can be played
      for (const sound_url of soundURLs) {
        // Determine the file type by the extension
        const format = sound_url.split(".").at(-1)?.toLowerCase();
        if (canPlay[format as keyof typeof canPlay]) {
          this.soundURL = sound_url;
          break;
        }
      }
    } else {
      // soundURLs is an object literal
      for (const [format, sound_url] of Object.entries(soundURLs)) {
        if (canPlay[format as keyof typeof canPlay]) {
          this.soundURL = sound_url;
        }
      }
    }
  }

  complete() {
    let completed = true;

    if (!this._initialized) {
      this._initialized = true;

      if (audioCtx.state !== "running") {
        audioCtx.resume().catch(noop);
      }

      // Create the sound or the Audio element
      const sound_url = this.soundURL;

      if (sound_url) {
        if (!this.streaming) {
          // Sound supported through Web Audio API
          this._waitAudioBuffer = true;

          fetch(sound_url)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
            .then((audioBuffer) => {
              this._audioBuffer = audioBuffer;
              this._waitAudioBuffer = false;
            })
            .catch(noop);
        } else {
          // Sound supported through HTML5 Audio
          const audio = new Audio(sound_url);
          audio.load();
          this._audio = audio;
        }
      }
    }

    if (this._waitAudioBuffer) {
      completed = false;
    }

    const audio = this._audio;

    if (audio && audio.readyState < audio.HAVE_ENOUGH_DATA) {
      completed = false;
    }

    return completed;
  }

  onLoad() {
    if (this._audio) {
      this._source = new MediaElementAudioSourceNode(audioCtx, {
        mediaElement: this._audio,
      });
    }
  }
}

export function addSound(
  soundURLs: string | string[] | Partial<Record<keyof typeof canPlay, string>>,
  options?: { streaming: boolean }
) {
  const sound = new Sound(soundURLs, options);

  resourceManager.addResource(sound);

  return sound;
}

class Channel {
  _muted = false;
  _volume = 1;
  _panning = 0;

  _panner: StereoPannerNode;
  _gainNode: GainNode;

  get muted() {
    return this._muted;
  }

  set muted(value: boolean) {
    if (value !== this._muted) {
      this._muted = value;

      if (value) {
        this._gainNode.gain.value = 0;
      } else {
        this._gainNode.gain.value = this._volume;
      }
    }
  }

  get volume() {
    return this._volume;
  }

  set volume(value: number) {
    if (value !== this._volume) {
      this._volume = clamp(value, 0, 1);

      if (!this._muted) {
        this._gainNode.gain.value = this._volume;
      }
    }
  }

  get panning() {
    return this._panning;
  }

  set panning(value: number) {
    if (value !== this._panning) {
      this._panning = clamp(value, -1, 1);

      this._panner.pan.value = this._panning;
    }
  }

  constructor(options?: Partial<ChannelOptions>) {
    this._panner = new StereoPannerNode(audioCtx);
    this._panner.connect(audioCtx.destination);

    this._gainNode = new GainNode(audioCtx);
    this._gainNode.connect(this._panner);

    if (options) {
      Object.assign(this, pick(options, ["muted", "volume", "panning"]));
    }
  }
}

export class SingleChannel extends Channel {
  _audio: HTMLAudioElement | null = null;
  _audioBuffer: AudioBuffer | null = null;
  _source: AudioNode | null = null;
  _playbackRate = 1;
  _startTime = 0;
  _pauseTime = 0;
  _old_loop = false;
  _old_onended: (() => void) | null = null;

  // Public functions

  get playbackRate() {
    return this._playbackRate;
  }

  set playbackRate(value: number) {
    const oldPlaybackRate = this._playbackRate;
    const playbackRate = clamp(value, 0.25, 4) || 1;

    if (playbackRate !== oldPlaybackRate) {
      this._playbackRate = playbackRate;

      if (this._audio) {
        this._audio.playbackRate = playbackRate;
      } else {
        const currentTime = this._pauseTime || audioCtx.currentTime;
        const offset = (currentTime - this._startTime) * oldPlaybackRate;

        this._startTime = currentTime - offset / playbackRate;

        if (this._source instanceof AudioBufferSourceNode) {
          this._source.playbackRate.value = playbackRate;
        }
      }
    }
  }

  play(sound: Sound, options?: Partial<SingleChannelPlayOptions>) {
    // Make sure the audio is stopped before changing its options
    this.stop();

    if (options?.playbackRate) {
      this._playbackRate = clamp(options.playbackRate, 0.25, 4) || 1;
    } else {
      this._playbackRate = 1;
    }

    if (sound._audio) {
      const audio = sound._audio;

      this._audio = audio;

      audio.pause();
      audio.currentTime = 0;

      if (options?.loop) {
        audio.loop = true;
        audio.onended = null;
      } else if (options?.callback) {
        const callback = options.callback;

        audio.loop = false;
        audio.onended = () => {
          this._disconnect();

          callback();
        };
      } else {
        audio.loop = false;
        audio.onended = this._disconnect;
      }

      audio.playbackRate = this._playbackRate;

      // TODO: Should sound._source be disconnected first?
      this._source = sound._source;
      sound._source?.connect(this._gainNode);

      audio.play().catch(noop);
    } else if (sound._audioBuffer) {
      const audioBuffer = sound._audioBuffer;

      this._audioBuffer = audioBuffer;

      const source = new AudioBufferSourceNode(audioCtx, {
        buffer: audioBuffer,
      });
      this._source = source;
      source.connect(this._gainNode);

      if (options?.loop) {
        source.loop = true;
        source.onended = null;
      } else if (options?.callback) {
        const callback = options.callback;

        source.loop = false;
        source.onended = () => {
          this._disconnect();

          callback();
        };
      } else {
        source.loop = false;
        source.onended = this._disconnect;
      }

      source.playbackRate.value = this._playbackRate;

      this._startTime = audioCtx.currentTime;
      source.start();
    } else {
      // Make sure the callback gets called even if the sound cannot be played
      if (!options?.loop && options?.callback) {
        const callback = options.callback;

        callback();
      }
    }

    return this;
  }

  stop() {
    if (this._audio) {
      this._audio.pause();
      this._audio.currentTime = 0;
    }

    this._playbackRate = 1;
    this._pauseTime = 0;
    this._old_loop = false;
    this._old_onended = null;

    if (this._source instanceof AudioBufferSourceNode) {
      this._source.onended = null;
      this._source.stop();
    }

    this._disconnect();

    return this;
  }

  pause() {
    if (this._audio) {
      this._audio.pause();
    }

    if (this._source instanceof AudioBufferSourceNode && !this._pauseTime) {
      const source = this._source;

      // Since pause / resume is not supported in the Web Audio API, here the currentTime is saved,
      // in order to create a new source object when the sound is resumed
      this._old_loop = source.loop;
      this._old_onended = source.onended as () => void;
      source.loop = false;
      source.onended = null;

      this._pauseTime = audioCtx.currentTime;
      source.stop();

      this._source = null;
    }

    return this;
  }

  resume() {
    if (this._audio) {
      this._audio.play().catch(noop);
    }

    if (this._pauseTime) {
      // Since pause / resume is not supported in the Web Audio API, a new source object is created
      // containing all the values of the old source object
      const audioBuffer = this._audioBuffer!;

      const source = new AudioBufferSourceNode(audioCtx, {
        buffer: audioBuffer,
      });
      this._source = source;
      source.connect(this._gainNode);

      source.loop = this._old_loop;
      source.onended = this._old_onended;
      this._old_loop = false;
      this._old_onended = null;

      const playbackRate = this._playbackRate;

      source.playbackRate.value = playbackRate;

      const offset =
        ((this._pauseTime - this._startTime) * playbackRate) %
        audioBuffer.duration;

      this._pauseTime = 0;
      this._startTime = audioCtx.currentTime - offset / playbackRate;
      source.start(0, offset);
    }

    return this;
  }

  // Implementation details

  _disconnect = () => {
    if (this._audio) {
      this._audio.loop = false;
    }

    this._audio = null;

    if (this._source instanceof AudioBufferSourceNode) {
      this._source.loop = false;
    }

    this._source = null;
    this._audioBuffer = null;
  };
}

export class MultiChannel extends Channel {
  // Public functions

  play(sound: Sound, options?: Partial<MultiChannelPlayOptions>) {
    const playbackRate = clamp(options?.playbackRate ?? 1, 0.25, 4) || 1;

    if (sound._audio) {
      const audio = sound._audio;

      audio.pause();
      audio.currentTime = 0;

      audio.loop = false;

      if (options?.callback) {
        audio.onended = options.callback;
      } else {
        audio.onended = null;
      }

      audio.playbackRate = playbackRate;

      // TODO: Should sound._source be disconnected first?
      sound._source?.connect(this._gainNode);

      audio.play().catch(noop);
    } else if (sound._audioBuffer) {
      const audioBuffer = sound._audioBuffer;

      const source = new AudioBufferSourceNode(audioCtx, {
        buffer: audioBuffer,
      });
      source.connect(this._gainNode);

      source.loop = false;

      if (options?.callback) {
        source.onended = options.callback;
      } else {
        source.onended = null;
      }

      source.playbackRate.value = playbackRate;

      source.start();
    } else {
      // Make sure the callback gets called even if the sound cannot be played
      if (options?.callback) {
        const callback = options.callback;

        callback();
      }
    }

    return this;
  }
}
