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

    #Reduce all migration files in one big file
    for migration in $(ls db/migrations/*); do
      BASENAME=$(basename $migration)
      echo "Processing ${BASENAME}..."
      echo "{\"filename\": \"$BASENAME\"}" > /tmp/migrate-filename.json
      echo $(scripts/base64cat.sh /tmp/migrate-acc.json $migration /tmp/migrate-filename.json | node scripts/migrations-reducer.js) > /tmp/migrate-acc.json
    done

    #Feed the big file into our migrations processor
    cat /tmp/migrate-acc.json | node scripts/migrations-processor.js
    ;;

    *)
    echo "Usage: db.sh [ structure | seeds | migrate ]"
    ;;
esac