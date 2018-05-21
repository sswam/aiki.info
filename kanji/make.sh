#!/bin/sh
perl ./kanji-keyword.pl < kanji.tsv > kanji-keyword.txt 
perl ./kanji-learn.pl < kanji-keyword.txt > kanji-learn-body.html
cat kanji-learn-head.html kanji-learn-body.html > kanji-learn.html
(cat kanji-learn-head.html ; head -n 100 kanji-learn-body.html ) > kanji-learn-100.html
(cat kanji-learn-head.html ; perl ./kanji-parts.pl < kanji-parts.txt) > kanji-parts.html
