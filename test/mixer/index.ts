import { resourceManager as rm } from "frigame3/lib/resourceManager.js";
import {
  canPlay,
  Sound,
  MultiChannel,
  SingleChannel,
} from "frigame3/lib/plugins/mixer.js";
import { Playground } from "frigame3/lib/Playground.js";
import { dummyRenderer } from "frigame3/lib/dummyRenderer.js";
import { Tweener } from "frigame3/lib/plugins/fx/Tweener.js";

(async () => {
  const sfx = new MultiChannel();
  const music = new SingleChannel();

  const stereomp3 = rm.addResource(new Sound("news_intro.mp3"));
  const monomp3 = rm.addResource(new Sound("prova.mp3"));
  const news = rm.addResource(new Sound(["news_intro.ogg", "news_intro.mp3"]));
  const prova = rm.addResource(new Sound(["prova.ogg", "prova.mp3"]));
  const dieci = rm.addResource(new Sound("dieci.opus"));

  let s_news: Sound | null = null;
  let s_prova: Sound | null = null;

  document.getElementById("start")?.addEventListener("click", async () => {
    await rm.preload();

    const playground = new Playground(dummyRenderer);
    const fx = new Tweener(playground);

    document.getElementById("loadmono")?.addEventListener("click", async () => {
      music.stop();
      s_news = null;
      s_prova = rm.addResource(
        new Sound(["prova.ogg", "prova.mp3"], { streaming: true })
      );

      await rm.preload();

      console.log("Loaded mono");
      console.log("audio: " + s_prova?._audio);
      console.log("src: " + s_prova?._audio?.src);
      console.log("error: " + s_prova?._audio?.error);
      console.log("networkState: " + s_prova?._audio?.networkState);
      console.log("readyState: " + s_prova?._audio?.readyState);
    });
    document
      .getElementById("loadstereo")
      ?.addEventListener("click", async () => {
        music.stop();
        s_news = rm.addResource(
          new Sound(["news_intro.ogg", "news_intro.mp3"], {
            streaming: true,
          })
        );
        s_prova = null;

        await rm.preload();

        console.log("Loaded stereo");
        console.log("audio: " + s_news?._audio);
        console.log("src: " + s_news?._audio?.src);
        console.log("error: " + s_news?._audio?.error);
        console.log("networkState: " + s_news?._audio?.networkState);
        console.log("readyState: " + s_news?._audio?.readyState);
      });
    console.log("canPlay:");
    for (const [k, v] of Object.entries(canPlay)) {
      console.log("" + k + ": " + v);
    }
    console.log("audioBuffer: " + news._audioBuffer);

    document.getElementById("monomp3")?.addEventListener("click", () => {
      sfx.play(monomp3);
    });
    document.getElementById("stereomp3")?.addEventListener("click", () => {
      sfx.play(stereomp3);
    });
    document.getElementById("monosfx")?.addEventListener("click", () => {
      sfx.play(prova);
    });
    document.getElementById("stereosfx")?.addEventListener("click", () => {
      sfx.play(news);
    });
    document.getElementById("monowebaudio")?.addEventListener("click", () => {
      music.play(prova, {
        callback: () => {
          console.log("Mono web audio playback completed");
        },
      });
    });
    document.getElementById("stereowebaudio")?.addEventListener("click", () => {
      music.play(news, {
        loop: true,
      });
    });
    document.getElementById("pause")?.addEventListener("click", () => {
      music.pause();
    });
    document.getElementById("resume")?.addEventListener("click", () => {
      music.resume();
    });
    document.getElementById("double")?.addEventListener("click", () => {
      music.playbackRate = 2;
    });
    document.getElementById("normal")?.addEventListener("click", () => {
      music.playbackRate = 1;
    });
    document.getElementById("half")?.addEventListener("click", () => {
      music.playbackRate = 0.5;
    });
    document.getElementById("dieci")?.addEventListener("click", () => {
      music.play(dieci, { loop: true, playbackRate: 1 });
    });
    document.getElementById("monohtml5")?.addEventListener("click", () => {
      if (s_prova) {
        music.play(s_prova, {
          loop: true,
        });
        if (s_prova._audio) {
          console.log("src: " + s_prova._audio.src);
          console.log("error: " + s_prova._audio.error);
          console.log("networkState: " + s_prova._audio.networkState);
          console.log("readyState: " + s_prova._audio.readyState);
        }
      }
    });
    document.getElementById("stereohtml5")?.addEventListener("click", () => {
      if (s_news) {
        music.play(s_news, {
          loop: true,
        });
        if (s_news._audio) {
          console.log("src: " + s_news._audio.src);
          console.log("error: " + s_news._audio.error);
          console.log("networkState: " + s_news._audio.networkState);
          console.log("readyState: " + s_news._audio.readyState);
        }
      }
    });
    document.getElementById("panleft")?.addEventListener("click", () => {
      fx.tween(
        sfx,
        {
          panning: -1,
        },
        {
          duration: 1000,
        }
      );
      fx.tween(
        music,
        {
          panning: -1,
        },
        {
          duration: 1000,
        }
      );
    });
    document.getElementById("pancenter")?.addEventListener("click", () => {
      fx.tween(
        sfx,
        {
          panning: 0,
        },
        {
          duration: 1000,
        }
      );
      fx.tween(
        music,
        {
          panning: 0,
        },
        {
          duration: 1000,
        }
      );
    });
    document.getElementById("panright")?.addEventListener("click", () => {
      fx.tween(
        sfx,
        {
          panning: 1,
        },
        {
          duration: 1000,
        }
      );
      fx.tween(
        music,
        {
          panning: 1,
        },
        {
          duration: 1000,
        }
      );
    });
    document.getElementById("stop")?.addEventListener("click", () => {
      music.stop();
    });
  });
})();
