#!/usr/bin/perl -w
use strict;
use warnings;
use Data::Dumper;

# our @vids = qw(
# VoW3IBm2-qw
# _COtgJ6vJIY
# l7VelwQqsZE
# );

our %hash;
open my $fh, "<", "yoshinkan-index.txt";
while ($_ = <$fh>) {
	chomp;
	my ($vid, $time, $name) = split /\t+/, $_;
	$hash{$name} = [$vid, $time];
}

open my $fh_romaji, '<', "waza-romaji.txt" or die "open failed: waza-romaji.txt";
open my $fh_nihongo, '<', "waza-nihongo.txt" or die "open failed: waza-nihongo.txt";
open my $fh_english, '<', "waza-english.txt" or die "open failed: waza-english.txt";

while (my $romaji = <$fh_romaji>) {
	my $nihongo = <$fh_nihongo>;
	my $english = <$fh_english>;
	chomp for $romaji, $nihongo, $english;
	if (!$hash{$romaji}) {
		$hash{$romaji} = [undef,undef];
	}
	push @{$hash{$romaji}}, $nihongo, $english;
}

close $fh_romaji;
close $fh_nihongo;
close $fh_english;

while ($_ = <STDIN>) {
	if (/<a class=".*?" title="(.*?)"/) {
		my $name = $1;
		$name =~ s/&.*//;
		my ($vid, $time, $nihongo, $english) = @{$hash{$name}||[]};
		my $url;
		if ($vid) {
#			$url = $vids[$vid-1];
			my $time2 = $time;
			$time2 =~ s/$/s/;
			if ($time2 =~ /:.*:/) {
				$time2 =~ s/:/h/;
			}
			$time2 =~ s/:/m/;
#			$url = "http://www.youtube.com/watch?v=$url&t=$time2#t=$time2";
#			$url = "http://www.youtube.com/watch?v=$url&t=$time2";
			$url = "https://aiki.info/y$vid?t=$time2";
		}
#		$url ||= '#';
		my $title = join '&#013;&#010;', $name, $nihongo, $english;
		if ($url) {
			s/href=".*?"/href="$url"/ or die "can't replace href for $name";
		}
		s/title=".*?"/title="$title"/ or die "can't replace title for $name";
	}
	print;
}

