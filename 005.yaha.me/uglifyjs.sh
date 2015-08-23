#!/bin/bash

cd dist/scripts/

for file in *.js
do
  mv $file /tmp/$file
  uglifyjs /tmp/$file -o $file 
done