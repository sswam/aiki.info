#!/bin/bash
< kk kut 2 | while read A; do T=$(hms- $A); echo $(hms $[$T-3]); done >kk2
< kk kutout 1 2 > kk3
paste kk2 kk3 > kk4
