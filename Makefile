#!/usr/bin/make -f

#all: perms $(shell find . -maxdepth 1 -path '*/.*' -prune -o -name '*.txt' -type f -print | sed 's/\.txt$$/.html/') $(shell find . -maxdepth 1 -path '*/.*' -prune -o \( -name '*.png' -o -name '*.jpg' \) -type f -print | sed 's,\(.*/\),\1tn/,;')

all: html labs+ Aikido.html Kihon_Waza.html notes_html waza-nihongo.txt waza-english.txt vocab.html Daito_Ryu.html Daito_Ryu_sampler.html Aikido_Shudokan.html Iwama_Ryu.html anki.html Shinshin_Toitsu_Aikido.html Stefan_Stenudd.html comments
# html: $(patsubst %.txt,%.html,$(wildcard *.txt))
html: index-base.html

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

Kihon_Waza.html: Kihon_Waza.1.html
	./add-links-and-translations.pl <$< >$@

notes_html:
	cd notes; $(MAKE)

waza-nihongo.txt: waza-romaji.txt romaji-to-nihogo.sub romaji-to-nihogo-2.sub
	sub -w -m=romaji-to-nihogo.sub < waza-romaji.txt | sub -m=romaji-to-nihogo-2.sub > waza-nihongo.txt

waza-english.txt: waza-romaji.txt romaji-to-english.sub
	sub -w -m=romaji-to-english.sub < waza-romaji.txt > waza-english.txt

vocab.html: vocab.txt
	tsv2html 'Aikido Vocabulary' < vocab.txt > vocab.html

Daito_Ryu.html: Daito_Ryu.html.head Daito_Ryu.html.tail Daito_Ryu.txt format-links
	(cat Daito_Ryu.html.head ; ./format-links < Daito_Ryu.txt ; cat Daito_Ryu.html.tail) >$@

Aikido_Shudokan.html: Aikido_Shudokan.html.head Aikido_Shudokan.html.tail Aikido_Shudokan.txt format-links
	(cat Aikido_Shudokan.html.head ; ./format-links < Aikido_Shudokan.txt ; cat Aikido_Shudokan.html.tail) >$@

Iwama_Ryu.html: Iwama_Ryu.html.head Iwama_Ryu.html.tail Iwama_Ryu.txt format-links
	(cat Iwama_Ryu.html.head ; ./format-links < Iwama_Ryu.txt ; cat Iwama_Ryu.html.tail) >$@

Daito_Ryu_sampler.html: Daito_Ryu_sampler.html.head Daito_Ryu_sampler.html.tail Daito_Ryu_sampler.txt format-links
	(cat Daito_Ryu_sampler.html.head ; ./format-links < Daito_Ryu_sampler.txt ; cat Daito_Ryu_sampler.html.tail) >$@

Shinshin_Toitsu_Aikido.html: Shinshin_Toitsu_Aikido.html.head Shinshin_Toitsu_Aikido.html.tail Shinshin_Toitsu_Aikido.txt format-links
	(cat Shinshin_Toitsu_Aikido.html.head ; ./format-links < Shinshin_Toitsu_Aikido.txt ; cat Shinshin_Toitsu_Aikido.html.tail) >$@

Stefan_Stenudd.html: Stefan_Stenudd.html.head Stefan_Stenudd.html.tail Stefan_Stenudd.txt format-links
	(cat Stefan_Stenudd.html.head ; ./format-links < Stefan_Stenudd.txt ; cat Stefan_Stenudd.html.tail) >$@

comments:
	mkdir -p comments
	chown -R sam:www-data comments/
	chmod -R g+rw comments/

.PHONY: all html comments
