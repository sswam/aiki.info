#!/usr/bin/perl
while (<>) {
	chomp;
	($kanji, $keyword) = split /\t/, $_;
	print "<c><k>$kanji</k><e>$keyword</e></c>\n";
}
