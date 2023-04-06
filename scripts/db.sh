#!/bin/bash

CMD_BASE64="node scripts/base64.js"
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
    echo '{"data": []}' > /tmp/migrate-acc.json
    for migration in $(ls db/migrations/*); do
      BASENAME=$(basename $migration)
      echo "Processing ${BASENAME}..."
      echo $(echo "$(cat /tmp/migrate-acc.json | $CMD_BASE64) $(cat $migration | $CMD_BASE64) $BASENAME" | node scripts/migrations-reducer.js) > /tmp/migrate-acc.json 
    done

    cat /tmp/migrate-acc.json | node scripts/migrations-processor.js
    ;;

    *)
    echo "Usage: db.sh [ structure | seeds | migrate ]"
    ;;
esac