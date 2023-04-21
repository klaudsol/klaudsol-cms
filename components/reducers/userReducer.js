import {
    LOADING,
    SAVING,
    DELETING,
    SET_VALUES,
    SET_GROUPS,
    SET_MODAL_CONTENT
} from "@/lib/actions";
import { useInitializeReducer } from "../hooks";

export const initialState = {
    user: {},
    groups: [],
    isLoading: false,
    isDeleting: false,
    isSaving: false,
    modalContent: {},
};

export const reducer = (state, action) => {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        case SAVING:
            return {
                ...state,
                isSaving: action.payload,
            };
        case DELETING:
            return {
                ...state,
                isDeleting: action.payload,
            };
        case SET_VALUES:
            return {
                ...state,
                user: action.payload,
            };
        case SET_GROUPS:
            return {
                ...state,
                groups: action.payload,
            }
        case SET_MODAL_CONTENT:
            return {
                ...state,
                modalContent: action.payload,
            };
    }
};

const useUserReducer = () => {
    const [state, setState] = useInitializeReducer(reducer, initialState);

    return [state, setState];
}

export default useUserReducer;
