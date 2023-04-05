#!/bin/bash

case $1 in

  structure)
    echo "Structure."
    node scripts/db.mjs structure
    ;;

  seeds)
    echo "Seeds."
    ;;

  migrate)
    echo "Migrate."
    ;;

    *)
    echo "Usage: db.sh [ structure | seeds | migrate ]"
    ;;
esac