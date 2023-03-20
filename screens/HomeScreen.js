import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, BackHandler, Alert, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import LearnModule from "../components/LearnModule";

const HomeScreen = props => {
  const myLibrary = useSelector(state => state.myLibrary.myLibrary);
  const backActionRef = useRef(null);

  useEffect(() => {//prevent to go back with button on this screen
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to close the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    backActionRef.current = backAction;

    const backHandler = () => {
      backActionRef.current();
      return true;
    };

    // event listener when the screen comes into focus
    const focusListener = props.navigation.addListener('focus', () => {
      BackHandler.addEventListener("hardwareBackPress", backHandler);
    });

    // removing of the listener when the screen goes out of focus
    const blurListener = props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    });

    return () => {
      focusListener();
      blurListener();
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    }
  }, [props.navigation]);

  return (
    <ImageBackground style={styles.container} source={require("../components/pictures/wood.jpg")} >
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {(myLibrary.length != 0) ? (
          myLibrary.map(item => (
            <LearnModule 
              progress={item.percentageDone} 
              modulename={item.coursename} 
              key={item.courseID} 
              keyforprops={item.courseID} 
              navigation={props.navigation}
              />
          ))
        ): (
          <Text style={{alignItems:'center', justifyContent:'center', color:"tomato", paddingTop:"2%"}}> No modules yet added! </Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: (Dimensions.get('window').width),
    minHeight: (Dimensions.get('window').height),
    flexDirection:"column",
    alignItems:"center",
    backgroundColor:"transparent"
  }
});

export default HomeScreen;
