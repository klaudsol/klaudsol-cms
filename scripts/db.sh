#!/bin/bash

case $1 in

  structure)
    echo "Structure."
    cat db/structure.sql | node scripts/db.js structure
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