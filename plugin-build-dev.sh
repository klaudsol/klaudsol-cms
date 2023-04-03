#!/bin/bash


# Check for dependencies
if ! [ -x "$(command -v jq)" ]; then
  echo 'Error: jq is not installed. Please install jq then try running this script again.' >&2
  exit 1
fi

#do not commit changes to plugin-menus.json
git update-index --assume-unchanged ./plugin-menus.json 


#Process each plugin available in the directory
for d in plugins/*/ ; do
    PLUGIN="${d}plugin.json"
    echo "Processing ${PLUGIN}..."
    PLUGIN_ARRAY="$PLUGIN_ARRAY $PLUGIN"
done

# Build plugin-menus.json based on the available plugins
node scripts/plugins-reducer.js plugin-menus $PLUGIN_ARRAY > plugin-menus.json