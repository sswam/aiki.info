SHELL=bash
all: kanji-learn.html kanji-parts.html k.tsv edict.tsv
.SECONDARY:
kanji-keyword.txt: kanji.tsv
	./kanji-keyword.pl <$< >$@
kanji-learn-body.html: kanji-keyword.txt
	./kanji-learn.pl <$< >$@
kanji-learn.html: kanji-learn-head.html kanji-learn-body.html
	cat $^ >$@
kanji-parts.html: kanji-learn-head.html kanji-parts.txt
	(cat kanji-learn-head.html ; ./kanji-parts.pl < kanji-parts.txt) >$@
k.tsv: kanji.tsv
	(echo $$'kanji\ti_old\ti\tlesson\tkw_old\tkeyword\tjoyo\tON\tkun'; <$< tail -n +3 | sed 's/^\t//') | kut 3 1 6 8 9 7 4 2 5 >$@
edict.tsv: edict2u
	<$< ./edict_to_tsv >$@
