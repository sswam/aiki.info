#!/bin/sh
< kanji.tsv cut -f2 | tail -n +3 |
perl -pe 'if (++$i % 60) { chomp; }'
