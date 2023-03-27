import { useInitializeReducer } from "@/components/hooks";
import { TOGGLE_ICONS_LIST, SET_CURRENT_ICON } from "@/lib/actions";

const initialState = {
  showIconsList: false,
  currentIcon: "BiPen",
};

const reducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_ICONS_LIST:
      return {
        ...state,
        showIconsList: !state.showIconsList,
      };
    case SET_CURRENT_ICON: // Currently unused
      return {
        ...state,
        currentIcon: action.payload,
      };
  }
};

const useCollectionTypeBodyReducer = () => {
  const [state, setState] = useInitializeReducer(reducer, initialState);

  return [state, setState];
};

export default useCollectionTypeBodyReducer;
