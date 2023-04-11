#!/bin/bash

CMD_BASE64="node scripts/base64.js"
case $1 in

  structure)
    echo "Structure."
    cat db/structure.sql | node scripts/db.js structure
    ;;

  seed)
    echo "Seed."
    #Seeds must be only run in the initial setup.
    #Seeds contains necessary built-in data.
    #Can be manually overriden by settitng KS_SKIP_DB_SEED=1
    SKIP_DB_SEED_FROM_ENV=$KS_SKIP_DB_SEED
    SKIP_DB_SEED_FROM_DB=$(node scripts/system.js get skip_db_seed)

    #No skips. Proceed.
    if [[ -z $SKIP_DB_SEED_FROM_ENV ]] && [[ -z $SKIP_DB_SEED_FROM_DB ]]; then 
      cat db/seed.sql | node scripts/db.js structure
      node scripts/system.js add skip_db_seed 1
    elif [[ -n $SKIP_DB_SEED_FROM_ENV ]]; then 
      echo "Skipping seed. \$KS_SKIP_DB_SEED=${SKIP_DB_SEED_FROM_ENV}"
    elif [[ -n $SKIP_DB_SEED_FROM_DB ]]; then 
      echo "Skipping seed. system.skip_db_seed=${SKIP_DB_SEED_FROM_DB}"
    fi
    ;;

  seed-demo)
    #Seed-demo contains sample data as onboarding guide for newcomers.
    #This may be skipped by more advanced users.
    echo "Seed demo."
    ;;

  migrate)
    echo "Migrate."
    echo '{"data": []}' > /tmp/migrate-acc.json

    #Reduce all migration files in one big file
    for migration in $(ls db/migrations/*); do
      BASENAME=$(basename $migration)
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