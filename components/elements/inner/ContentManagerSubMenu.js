import { useReducer, useEffect, useContext } from "react";
import { slsFetch } from "@/components/Util";
import RootContext from "@/components/contexts/RootContext";
import { DEFAULT_SKELETON_ROW_COUNT } from "lib/Constants";
import Link from "next/link";
import { loadEntityTypes } from "@/components/reducers/actions";
/** kladusol CMS components */
import AppIconButton from "@/components/klaudsolcms/buttons/AppIconButton";
/** react icons */
import { FaSearch } from "react-icons/fa";

const ContentManagerSubMenu = ({ title, currentTypeSlug }) => {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);

  const initialState = {
    collectionTypes: [
      { title: "Menu", id: 1 },
      { title: "Users", id: 2 },
      { title: "Article", id: 3 },
    ],
    singleTypes: [
      { title: "Test", id: 4 },
      { title: "Test", id: 5 },
    ],
    isLoading: false,
  };

  const LOADING = "LOADING";
  const reducer = (state, action) => {
    switch (action.type) {
      case LOADING:
        return {
          ...state,
          isLoading: action.payload,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const onStartLoad = () => {
    //only display on first load
    if (!rootState.entityTypesHash) {
      dispatch({ type: LOADING, payload: true });
    }
  };

  const onEndLoad = () => dispatch({ type: LOADING, payload: false });

  /*** Entity Types List ***/
  useEffect(() => {
    (async () => {
      await loadEntityTypes({
        rootState,
        rootDispatch,
        onStartLoad,
        onEndLoad,
      });
    })();
  }, [rootState]);


 
  return (
    <>
      <div className="submenu_container">
        <div className="px-3 py-3">
          <div className="d-flex justify-content-between align-items-center mx-0 px-0 my-0 py-0">
            <a className="submenu_title">
              {" "}
              <b> {title}</b>{" "}
            </a>
            <AppIconButton icon={<FaSearch className="search_icon" />} />
          </div>
          <div className="submenu_bar"></div>
        </div>

        <div className="d-flex justify-content-between align-items-center px-3 pt-2">
          <p className="content_manager_type_title"> COLLECTION TYPES </p>
          <p className="type_number"> {rootState.entityTypes.length} </p>
        </div>

        <div className="d-flex flex-column mx-0 px-0">
          {state.isLoading &&
            Array.from({ length: DEFAULT_SKELETON_ROW_COUNT }, () => (
              <div className="d-flex flex-row align-items-center justify-content-start skeleton-submenu">
                <div className="skeleton-bullet" />
                <div className="skeleton-submenu-text" />
              </div>
            ))}
          {!state.isLoading &&
            rootState.entityTypes.map((type, i) => (
              <Link
                href={`/admin/content-manager/${type.entity_type_slug}`}
                passHref
                key={i}
              >
                <button
                  key={i}
                  className={
                    currentTypeSlug === type.entity_type_slug
                      ? "content_menu_item_active"
                      : "content_menu_item"
                  }
                >
                  <li> {type.entity_type_name} </li>
                </button>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default ContentManagerSubMenu;
