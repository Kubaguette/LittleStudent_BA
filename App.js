import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReduxThunk from 'redux-thunk';
import * as firebase from "firebase";
import Navigator from "./navigation/Navigator";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';

//import Reducers
import LibraryReducer from './store/reducers/CourseLibrary';
import OtherStateReducer from './store/reducers/SpecialReducers';

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false); //are fonts loaded?
  const firebaseConfig = {//censored Data so no thrid party can access firebase userdata.
    apiKey: "AIzaSyBeiouoN604YQcjwLXlnIbpYbTGFuIQdYM",
    authDomain: "littlestudent-9905c.firebaseapp.com",
    databaseURL: "https://littlestudent-9905c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "littlestudent-9905c",
    storageBucket: "littlestudent-9905c.appspot.com",
    messagingSenderId: "302084222512",
    appId: "1:302084222512:web:e39747da71d147fa1547f5",
    measurementId: "G-GTW5DQSHFK"
  };
  const fetchFonts = () => {
    return Font.loadAsync({
      'AmaticBold' : require('./assets/fonts/Amatic-Bold.ttf'),
    });
  };

  const rootReducer = combineReducers({
    myLibrary: LibraryReducer,
    myOtherReducers: OtherStateReducer
  });

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        } else {
          firebase.app(); // if already initialized, use that one
        };
        await fetchFonts();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. 
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setDataLoaded(true);
      }
    }

    prepare();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (dataLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [dataLoaded]);

  if(!dataLoaded){ //will go into if clause because fonts are not loaded
    return(
      null
    )
  }
  return (
    <Provider store={store}>
      <Navigator/>
    </Provider>
  );
}

