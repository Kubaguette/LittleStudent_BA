import { SET_BOTTOMTAB } from "../actions/SpecialActions";
import { SET_VOICE } from "../actions/SpecialActions";

const InitialSpecialState = {
    showBottomTab: "flex",
    currentVoice: 'en-GB'
};

export default (state = InitialSpecialState, action) => {
    switch(action.type){
        case SET_BOTTOMTAB:
            return {
                ...state,
                showBottomTab: action.showBottomTab
            };
        case SET_VOICE:
            return {
                ...state,
                currentVoice: action.currentVoice
            }
        default:
            return state;
    };
};

