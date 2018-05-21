#!/bin/sh
< kanji-keyword.txt cut -f2 | perl -pe '$_ = (length($_)-1) . " $_"' | sort -n
