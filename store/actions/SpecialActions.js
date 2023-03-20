export const SET_BOTTOMTAB = 'SET_BOTTOMTAB';
export const SET_VOICE = "SET_VOICE";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Tts from 'react-native-tts';

export const setBottomTabVisibility = (newState) => {
    console.log("dispatching bottomtab state")
    return async (dispatch) => {
        dispatch({type: SET_BOTTOMTAB, showBottomTab: newState})
    }
};

export const setVoiceLanguage = (newState) => {
    Tts.setDefaultLanguage(newState);
    return async (dispatch) => {
        console.log("dispatching new voice language state");
        try{
            await AsyncStorage.setItem('currentVoiceLanguage', newState);
            dispatch({type: SET_VOICE, currentVoice: newState})
        }catch(e){
            console.log(e)
        }
        
    }
};

export const initiateVoiceLanguage = () => {
    console.log("dispatching backed up voice language state");
    return async (dispatch) => {
        try{
            const currentVoice = await AsyncStorage.getItem('currentVoiceLanguage');
            if(currentVoice == null){
                console.log("No voice safed yet!!");
                await AsyncStorage.setItem('currentVoiceLanguage', "en-GB");
                Tts.setDefaultLanguage("en-GB");
                dispatch({type: SET_VOICE, currentVoice: "en-GB"})
            }else{
                console.log("current voice: ", currentVoice)
                Tts.setDefaultLanguage(currentVoice);
                dispatch({type: SET_VOICE, currentVoice: currentVoice})
                };
        }catch(e){
            console.log(e)
        }
    }
};