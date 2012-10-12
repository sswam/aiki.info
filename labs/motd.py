#!/usr/bin/env python
# coding=utf8

import sys, math

def main():
	banner()
	anim()

def anim():
	line = '~-__-~~-__-~~-__-~~-__-~~-__-~~-__-~~-__-~~-__-~~-__-~~-__-~~-__-~~-__-~~-__-~'
	shifts = 6 ; reps = 6 ; start_delay = 4096 ; title_delay = 700 ; steps_per_shift = 2
	pause(start_delay)
	spaces = reps * shifts
	step = 0 ; steps = reps * shifts * steps_per_shift ; bounce = 80
	for i in range(0, reps):
		for s in range(0, shifts):
			out(' ' + line)
			line = line[-1] + line[0:-1]
			for s in range(0, steps_per_shift):
				spaces = steps - step
				title(' ' * spaces + 'haxlab.net')
				pause(title_delay)
				step += 1
			spaces -= 1
			cr()
	clear()

def spow(b, p):
	if b >= 0:
		return math.pow(b, p)
	else:
		return -math.pow(-b, p)

def out(s):
	sys.stdout.write(s)

def cr():
	out('')

def clear():
	out(' ' * 80) ; cr()

def banner():
	print """

              /~                                              ~\\
              )  |  |  /\  \ / |    /\  |~~\     |\ | |~~ ~T~  (
             <   |--| (--)  X  |   (--) |--<     | \| |-   |    >
              )  |  | |  | / \ |__ |  | |__/  *  |  | |__  |   (
              \_                                              _/

 We  are  élite  coders  and  hackers,  creating  simple  brilliant  technology
 in the public domain.  Hello and welcome to students, apprentices and masters!
 Here is the place to work on dream projects, hone skills, build awesome stuff.
"""

def pause(n):
	for i in range(0, n):
		out(' ')

def title(s):
	out(']0;%s' % s)

main()
