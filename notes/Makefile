all: html
html: $(patsubst %.txt,%.html,$(wildcard *.txt))
%.html: %.txt notes_text2html
	./notes_text2html "$<" >"$@" ; hide "$@"
