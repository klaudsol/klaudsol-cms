import { useInitializeReducer } from "@/components/hooks";
import {
  LOADING,
  SET_ADD_CONTENT_TYPE_MODAL,
  SET_HEADER_DROPDOWN,
} from "@/lib/actions";

const initialState = {
  showHeaderDropdown: false,
  showAddContentTypeModal: false,
  isLoading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_ADD_CONTENT_TYPE_MODAL:
      return {
        ...state,
        showAddContentTypeModal: action.payload,
      };
    case SET_HEADER_DROPDOWN:
      return {
        ...state,
        showHeaderDropdown: action.payload,
      };
  }
};

const useSidebarReducer = () => {
  const [state, setState] = useInitializeReducer(reducer, initialState);

  return [state, setState];
};

export default useSidebarReducer;
