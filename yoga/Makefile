#!/usr/bin/make -f

SHELL=bash

#all: perms $(shell find . -maxdepth 1 -path '*/.*' -prune -o -name '*.txt' -type f -print | sed 's/\.txt$$/.html/') $(shell find . -maxdepth 1 -path '*/.*' -prune -o \( -name '*.png' -o -name '*.jpg' \) -type f -print | sed 's,\(.*/\),\1tn/,;')

all: html
html: $(patsubst %.txt,%.html,$(wildcard *.txt))

%.html: %.txt $(shell which text2html)
	text2html $< >$@ ; hide $@

%.html: %.tsv $(shell which tsv2html)
	<$< tsv2html $< >$@ ; hide $@

perms:
	if [ -e x -a -e x/env ]; then q x/env; fi
	if [ -e x ]; then chmod -R go+rX,g-w x ; chgrp -R www-data x; fi

tn/%.png: %.png Makefile
	convert -scale $${TNW:-256} $< $@

tn/%.jpg: %.jpg Makefile
	convert -quality 95 -scale $${TNW:-256} $< $@

tn/%.gif: %.gif Makefile
	convert -quality 95 -scale $${TNW:-256} $< $@

.PHONY: all html
