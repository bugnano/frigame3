#! /usr/bin/env python
# -*- coding: ascii -*-

from __future__ import division

import cairo

DIM_RULER = 512

STEP = 64

def main():
	surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, DIM_RULER, DIM_RULER)
	ctx = cairo.Context(surface)
	ctx.set_antialias(cairo.ANTIALIAS_NONE)

	ctx.set_source_rgb(1, 1, 0.85)
	ctx.rectangle(0, 0, DIM_RULER, DIM_RULER)
	ctx.fill()

	ctx.set_line_width(1)

	ctx.set_source_rgb(0.33, 0.33, 0.33)
	for i in range(0, DIM_RULER, STEP):
		ctx.move_to(i, 0)
		ctx.line_to(i, DIM_RULER)
		ctx.stroke()
		ctx.move_to(0, i)
		ctx.line_to(DIM_RULER, i)
		ctx.stroke()

	ctx.set_source_rgb(0.5, 0.5, 0.5)
	for i in range(int(STEP // 2), DIM_RULER, STEP):
		ctx.move_to(i, 0)
		ctx.line_to(i, DIM_RULER)
		ctx.stroke()
		ctx.move_to(0, i)
		ctx.line_to(DIM_RULER, i)
		ctx.stroke()

	ctx.set_source_rgb(0.66, 0.66, 0.66)
	ctx.set_dash([2, 2])
	for start in (int(STEP // 4), int((STEP * 3) // 4)):
		for i in range(start, DIM_RULER, STEP):
			ctx.move_to(i, 0)
			ctx.line_to(i, DIM_RULER)
			ctx.stroke()
			ctx.move_to(0, i)
			ctx.line_to(DIM_RULER, i)
			ctx.stroke()

	surface.write_to_png('ruler.png')


if __name__ == '__main__':
	main()

