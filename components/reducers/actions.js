/*
 * Actions are functions that contain one or more dispatch statements.
 */

import { findContentTypeName } from "@/components/Util";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { SET_ENTITY_TYPES,SET_CURRENT_ENTITY_TYPE } from "@/lib/actions"

export async function loadEntityTypes({
  rootState,
  rootDispatch,
  onStartLoad = () => {},
  onEndLoad = () => {}
  }) {
  try {
    onStartLoad();
    const entityTypesRaw = await slsFetch("/api/entity_types");
    const entityTypes = await entityTypesRaw.json();
  
    //reload entity types list only if there is a change.
    if (rootState.entityTypesHash !== entityTypes.metadata.hash) {
      rootDispatch({
        type: SET_ENTITY_TYPES,
        payload: {
          entityTypes: entityTypes.data,
          entityTypesHash: entityTypes.metadata.hash
      }});       

    }
  } catch (ex) {
    console.error(ex.stack);
  } finally {
    onEndLoad();
  }
}

const hashEqualTo = ({ rootState, typeSlug, hash }) =>
  rootState.entityType[typeSlug]?.metadata?.hash === hash;

export async function loadEntityType({
  rootState,
  rootDispatch,
  typeSlug,
  onStartLoad = () => {},
  onEndLoad = () => {},
}) {
  try {
    onStartLoad();
    const rawEntityType = await slsFetch(`/api/entity_types/${typeSlug}`);
    const entityType = await rawEntityType.json();
    if (
      rootState.entityType[typeSlug] &&
      hashEqualTo({ rootState, typeSlug, hash: entityType.metadata.hash })
    ) {
      //use cache, do nothing
    } else {
      rootDispatch({
        type: "SET_ENTITY_TYPE",
        payload: { slug: typeSlug, entityType },
      });
    }
  } catch (error) {
    //do nothing for now
  } finally {
    onEndLoad();
  }
}
