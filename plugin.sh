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
      PLUGIN_ARRAY="$PLUGIN_ARRAY $PLUGIN"

      if [[ "$MODE" == "build" || "$MODE" == "cleanup" ]]; then
        rm -Rf pages/plugins/${PLUGIN_NAME}
        rm -Rf pages/api/plugins/${PLUGIN_NAME}
      fi
      
      if [[ "$MODE" == "build" ]]; then
        cp -r ${plugin_directory}/pages pages/plugins/${PLUGIN_NAME} || true
        cp -r ${plugin_directory}/pages/api pages/api/plugins/${PLUGIN_NAME} || true
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
