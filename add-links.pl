#!/usr/bin/perl -w
use strict;
use warnings;
use Data::Dumper;

our @vids = qw(
J8GMd8AyZAw
RdzdII66Qcc
NW5t-QXLYsw
);

our %hash;
open my $fh, "<", "yoshinkan-index.txt";
while ($_ = <$fh>) {
	chomp;
	my ($vid, $time, $name) = split /\t+/, $_;
	$hash{$name} = [$vid, $time];
}

while ($_ = <STDIN>) {
	if (/<a class=".*?" title="(.*?)"/) {
		my $name = $1;
		my ($vid, $time) = @{$hash{$name}||[]};
		my $url;
		if ($vid) {
			$url = $vids[$vid-1];
			my $time2 = $time;
			$time2 =~ s/$/s/;
			if ($time2 =~ /:.*:/) {
				$time2 =~ s/:/h/;
			}
			$time2 =~ s/:/m/;
			$url = "http://www.youtube.com/watch?v=$url&t=$time2#t=$time2";
		}
		$url ||= '#';
		s/href=".*?"/href="$url"/;
	}
	print;
}

