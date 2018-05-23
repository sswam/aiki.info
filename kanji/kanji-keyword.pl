#!/usr/bin/perl
while (<>) {
	++$line;
	next if $line < 3;
	chomp;
	@f = split /\t/, $_, -1;
	$k = $f[1];
	$e = $f[6];
	if ($e eq "(not in)") { $e = $f[5]; }
	print "$k\t$e\n";
}
