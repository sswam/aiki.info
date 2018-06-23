#!/bin/bash
export n=${1:-50}
< kanji.tsv cut -f2 | tail -n +3 |
perl -pe 'if (++$i % $ENV{n}) { chomp; }'
