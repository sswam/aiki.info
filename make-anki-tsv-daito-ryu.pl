#!/usr/bin/perl
use strict;
use warnings;
use Data::Dumper;

my $indent = -1;

my ($link, $time);

# my @classes = qw(romaji nihongo english attack);

my (@path);

my $section;
my $kajo;

my @ungrouped;

while (defined (my $line=<STDIN>)) {
	chomp $line;
	next if $line =~ /^\s*#/;
	my ($link1, $time1, @fields) = split /\t/, $line, -1;
	if ($link1) {
		$link = $link1;
	}
	if ($time1) {
		$time = $time1;
	}
	for (@fields[0..3]) { $_ ||= ''; }
	$fields[0] =~ s/^(\.*)//;
	my $indent1 = length($1);
	while ($indent > $indent1) {
		--$indent;
		pop @path;
	}
	$indent = $indent1;

	if ($indent == 1) {
		$section = $fields[0];
		if ($section =~ /^(gihō kaisetsu|Shoden|hiden mokuroku|hiden mokuroku 118 kajō|Uragata|Kudengokui)$/) {
			$section = "hiden mokuroku";
#			@fields = ("hiden mokuroku", "秘伝目録", "secret syllabus", "");
			@fields = ();
		}
	}
	if ($indent == 2) {
		$kajo = '';
		if ($section ne "aiki-no-jutsu") {
			$kajo = $fields[0];
		}
	}
	if ($indent == 3 && $fields[0] eq 'hanza-handachi goho-no-jin') {
		@fields = ("hanza-handachi", "半座半立", "half-sitting half-standing", "");
	}

	my ($romaji, $nihongo, $english, $attack) = @fields;

	$path[$indent1] = \@fields;

	my ($source_romaji, $source_nihongo, $source_english) = @{$path[0]};
#	my $source = join('  ', $source_romaji, $source_nihongo, $source_english);
	my $source = $source_romaji || $source_english || $source_nihongo;

	my @p = map {$_->[0]} @path[1..$#path-1];
	my $path_romaji = join (' ', grep defined, map {$_->[0]} @path[1..$#path-1]);
	my $path_nihongo = join (' ', grep defined, map {$_->[1]} @path[1..$#path-1]);
	my $path_english = join (' ', grep defined, map {$_->[2]} @path[1..$#path-1]);

	my $link2 = '';
	if (@fields <= 1 && (!defined $fields[0] || $fields[0] eq '')) {
		next;
	} elsif ($time ne "" && $time ne "-" && $link =~ m{watch\?v=}) {
		my $yt_time = "${time}s";
		$yt_time =~ s/(.*):/$1m/;
		$yt_time =~ s/(.*):/$1h/;
		$link2 = "$link&t=$yt_time#t=$yt_time";
	} elsif ($link =~ m{://}) {
		$link2 = $link;
	} else {
		# TODO ?
	}

	my @out_fields = ($path_nihongo, $nihongo, $romaji, $english, $path_romaji, $path_english, $attack, $link2, $source);

	if ($indent >= 4 || $path_romaji =~ /aiki-no-jutsu/ && $indent >= 3) {
		if ($romaji eq "ura") {
			# skip these for now
		} elsif ($english =~ /^(point|explanation)$/) {
		
		} elsif ($source =~ /^(uragata|kudengokui)$/i) {

		} elsif ($source =~ /^(osaka)$/i) {

		} else {
#		} elsif ($section eq "hiden mokuroku") {  #  && $kajo eq "ikkajo") {
			push @ungrouped, \@out_fields;
#			print join("\t", @out_fields), "\n";
		}
	}
}
while ($indent > -1) {
	--$indent;
}

my %grouping;

for my $row (@ungrouped) {
	my $key = join "\t", @$row[0..5];
	push @{$grouping{$key}}, $row;
}

for my $row (@ungrouped) {
	my $key = join "\t", @$row[0..5];
	my $rows = delete $grouping{$key};
	next if !$rows;

	my ($path_nihongo, $nihongo, $romaji, $english, $path_romaji, $path_english) = @{$rows->[0]};
	my $links = '';
	my $tags = '';

	my $full_romaji = "$path_romaji  $romaji";

	my $attack1;
	for (@$rows) {
		my ($attack, $link2, $source) = @$_[6, 7, 8];
		next if !$link2;
		next if $source =~ /Osaka/;  # for now
		next if $link2 =~ /BXljPTQD5bg|eNfhjUbvj6c/;
		my $html = qq{<div><A href="$link2">$source</A></div> };
		$attack1 ||= $attack;  # don't check same at the moment, go with the first one
		if ($attack ne $attack1) {
			warn "Attack varies for $full_romaji\n";
		}
		$links .= $html;
	}
	next if !$links;
	next if $path_english =~ / weapons capture$/;

	my @out_fields = ($full_romaji, $path_nihongo, $nihongo, $romaji, $english, $path_romaji, $path_english, $attack1, $links, $tags);
	
	print join("\t", @out_fields), "\n";
}

