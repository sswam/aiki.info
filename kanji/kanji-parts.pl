#!/usr/bin/perl
while (<>) {
	chomp;
	($part, $keyword) = split /\t/, $_;
	print "<c><p>$part</p><e>$keyword</e></c>\n";
}
