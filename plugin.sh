#!/bin/bash

MODE=$1

[[ "$MODE" ]] && echo "MODE=${MODE}"

if [[ "$MODE" == "build" || "$MODE" == "cleanup" || "$MODE" == "info" ]]; then
  #Process each plugin available in the directory
  for plugin_directory in plugins/*/ ; do
      echo "Visiting $plugin_directory"

      #Skip non-directories 
      if [ ! -d $plugin_directory ]
      then
        echo "Skipping $plugin_directory"
        continue
      fi


      PLUGIN_NAME=$(basename $plugin_directory)
      echo "Processing ${PLUGIN_NAME}..."
      PLUGIN="${plugin_directory}plugin.json"
      
      # https://stackoverflow.com/a/65861724/95552
      # base64(1) by default wraps lines at column 76. What you're seeing is the whitespace of those newlines.
      # The base64 on Macs do not have a -w0 parameter
      PLUGIN_BASE64=$((cat $PLUGIN | base64 -w0 2>/dev/null) || (cat $PLUGIN | base64))
      PLUGIN_ARRAY="$PLUGIN_ARRAY $PLUGIN_BASE64"

      if [[ "$MODE" == "build" || "$MODE" == "cleanup" ]]; then
        rm -Rf pages/plugins/${PLUGIN_NAME}
        rm -Rf pages/api/plugins/${PLUGIN_NAME}
      fi
      
      if [[ "$MODE" == "build" ]]; then
        cp -r ${plugin_directory}/pages pages/plugins/${PLUGIN_NAME} || true
        cp -r ${plugin_directory}/pages/api pages/api/plugins/${PLUGIN_NAME} || true

        #Remove the API handler here, it is redundant and causes build problems
        rm -Rf pages/plugins/${PLUGIN_NAME}/api || true
      fi
  done
fi

case $MODE in

  info)
    node scripts/plugins-reducer.js info $PLUGIN_ARRAY
    ;;

  build)
    # Build plugin-menus.json based on the available plugins
    #do not commit changes to plugin-menus.json
    git update-index --assume-unchanged ./plugin-menus.json 
    #echo "PLUGIN_ARRAY"
    #echo $PLUGIN_ARRAY
    node scripts/plugins-reducer.js plugin-menus $PLUGIN_ARRAY > plugin-menus.json
    ;;

  cleanup)
    echo "Cleanup complete."
    ;;

  pull)
    REPOS=$KS_PLUGIN_REPOS
    if [[ "$REPOS" ]]
    then
      #REPOS is a comma-separated list of repositories
      IFS2=$IFS2
      IFS=,
      cd plugins
      for REPO in $REPOS; do
        echo "Pulling ${REPO}..."
        git clone $REPO || true
      done;
      cd ..
    else
      echo "No repositories to pull, nothing to do".
    fi
    
    ;;

  *)
    echo "Usage: plugin-build.sh [info | build | cleanup]"
    ;;
esac
