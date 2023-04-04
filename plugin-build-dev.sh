#!/bin/bash


#do not commit changes to plugin-menus.json
git update-index --assume-unchanged ./plugin-menus.json 


#Process each plugin available in the directory
for plugin_directory in plugins/*/ ; do
    PLUGIN_NAME=$(basename $plugin_directory)
    echo "Processing ${PLUGIN_NAME}..."
    PLUGIN="${plugin_directory}plugin.json"
    PLUGIN_ARRAY="$PLUGIN_ARRAY $PLUGIN"

 #Ideally this is a soft link, but it doesn't feel the change if it's just a link.
 #We copy it then.
    rm -Rf pages/plugins/${PLUGIN_NAME}
    cp -r ${plugin_directory}/pages pages/plugins/${PLUGIN_NAME}
done

case $1 in

  info)
    node scripts/plugins-reducer.js info $PLUGIN_ARRAY
    ;;

  *)
    # Build plugin-menus.json based on the available plugins
    node scripts/plugins-reducer.js plugin-menus $PLUGIN_ARRAY > plugin-menus.json
    ;;
esac
