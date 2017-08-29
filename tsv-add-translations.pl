#!/usr/bin/perl -w
use strict;
use warnings;
use Data::Dumper;

our %hash;

open my $fh_romaji, '<', "waza-romaji.txt" or die "open failed: waza-romaji.txt";
open my $fh_nihongo, '<', "waza-nihongo.txt" or die "open failed: waza-nihongo.txt";
open my $fh_english, '<', "waza-english.txt" or die "open failed: waza-english.txt";

while (my $romaji = <$fh_romaji>) {
	my $nihongo = <$fh_nihongo>;
	my $english = <$fh_english>;
	chomp for $romaji, $nihongo, $english;
	$hash{$romaji} = [$nihongo, $english];
}

close $fh_romaji;
close $fh_nihongo;
close $fh_english;

while ($_ = <STDIN>) {
	chomp;
	my ($level, $romaji, $links) = split /\t/, $_;
	my ($nihongo, $english) = @{$hash{$romaji}||[]};
	print join("\t", $level, $romaji, $nihongo||"-", $english||"-", $links||""), "\n";
}

