import { SET_LIBRARY, UPDATE_LIBRARY } from "../actions/CourseLibrary";

const initialLibraryState = {
    myLibrary: []
};

export default (state = initialLibraryState, action) => {
    switch(action.type){
        case SET_LIBRARY:
            return {
                myLibrary: action.myLibrary
            }
        case UPDATE_LIBRARY:
            return {
                myLibrary: action.myLibrary
            }
        default:
            return state;
    };
};
