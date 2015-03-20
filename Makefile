#!/usr/bin/make -f

#all: perms $(shell find . -maxdepth 1 -path '*/.*' -prune -o -name '*.txt' -type f -print | sed 's/\.txt$$/.html/') $(shell find . -maxdepth 1 -path '*/.*' -prune -o \( -name '*.png' -o -name '*.jpg' \) -type f -print | sed 's,\(.*/\),\1tn/,;')

all: html labs+ Aikido.html
html: $(patsubst %.txt,%.html,$(wildcard *.txt))

labs+:
	cd labs; $(MAKE)

%.html: %.txt $(shell which text2html)
	text2html $< >$@ ; hide $@

perms:
	if [ -e x -a -e x/env ]; then q x/env; fi
	if [ -e x ]; then chmod -R go+rX,g-w x ; chgrp -R www-data x; fi

tn/%.png: %.png Makefile
	<$< pngtopnm | pnmscale -width=256 | pnmtopng >$@

tn/%.jpg: %.jpg Makefile
	<$< jpegtopnm | pnmscale -width=310 | pnmtojpeg -quality=95 >$@

replacements.sed: replacements.txt
	<$< sed 's/^/s|/; s/$$/|g;/; s/\t/|/;' >$@

Aikido.html: Aikido.2.html replacements.sed
	sed -f replacements.sed <$< >$@

.PHONY: all html
