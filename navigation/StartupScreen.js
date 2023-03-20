import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert, ImageBackground, TextInput, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as firebase from "firebase";
import * as LibraryActions from "../store/actions/CourseLibrary";
import * as SpecialActions from "../store/actions/SpecialActions";

import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';


const StartupScreen = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        checkSession();
        dispatch(LibraryActions.setLibrary());
        dispatch(SpecialActions.setBottomTabVisibility("flex"));
        dispatch(SpecialActions.initiateVoiceLanguage());
    }, [])

    const checkSession = () => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              console.log("User is signed in. Navigating to Homescreen.");
              props.navigation.navigate('App');
            } else {
              console.log("User logged out, navigating to LoginScreen.");
              props.navigation.navigate('Login');
            }
          });
    }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/splash.png')} style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
        <ActivityIndicator size="large" color="tomato" style={{alignSelf:"center"}}/>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StartupScreen;
