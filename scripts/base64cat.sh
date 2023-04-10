#/bin/bash

#This script is to make our solution stream-based, and be able to handle 
#large amounts of data. We try to avoid bash expansion, as it would limit the 
#amount of data that we can process.

for ((i=1; i<=$#; i++)); do
  cat "${!i}" | node scripts/base64.js
  echo -n " "
done