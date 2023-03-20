import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Dimensions, ImageBackground, TouchableOpacity, BackHandler} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';

import * as SpecialActions from "../store/actions/SpecialActions";
import * as LibraryActions from "../store/actions/CourseLibrary";


//dispatch(SpecialActions.setBottomTabVisibility("none"));
const RemoveCards = props => {
const dispatch = useDispatch();
const [currentCards, setCurrentCards] = useState([]);
const backActionRef = useRef(null);

useEffect(() => {
  /**listener sub and unsub when changing screen
   * dispatching of bottom tab nav happening here*/
  const backAction = () => {
        dispatch(SpecialActions.setBottomTabVisibility("flex"));
        props.navigation.goBack();
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
    dispatch(SpecialActions.setBottomTabVisibility("flex"));
    BackHandler.removeEventListener("hardwareBackPress", backHandler);
  });

  return () => {
    focusListener();
    blurListener();
    BackHandler.removeEventListener("hardwareBackPress", backHandler);
  }
}, [props.navigation]);

useEffect(() => {
  const unsubscribe = props.navigation.addListener('focus', () => {
    loadCards();
    console.log("FOCUSED")
  });
  return unsubscribe;
},[props])

const loadCards = () => {
  var toset = props.route.params.passedCourse.cards
  setCurrentCards(toset)//returns string with name of course
};

const deleteCard = async (cardToDelete) => {
  try{
    var newCourseObject = {};
    var newCardsArray = [];
    Object.assign(newCourseObject,props.route.params.passedCourse);
    Object.assign(newCardsArray,currentCards)
    //delete the card in the newCardsArray
    var filteredCards = newCardsArray.filter(item => item.q1 !== cardToDelete.q1);
    //check if you need to delete the Card in currentMistakes
    console.log("OBJECT BEFORE",newCourseObject)
    if(newCourseObject.currentMistakes.length > 0){
      var index = newCourseObject.currentMistakes.findIndex(obj => obj.q1 === cardToDelete.q1)
      if(index !==-1){
        newCourseObject.currentMistakes.splice(index, 1);
        console.log("OBJECT AFTER", newCourseObject)
      }
    }
    //calculate percentage new
    if(filteredCards.length==1 && newCourseObject.currentMistakes.length==0){
      var newPercentage = 0
    }else{
      var newPercentage = Math.round(((filteredCards.length - newCourseObject.currentMistakes.length)/filteredCards.length)*100)/100
    }
    //save it in asyncstorage
    var finalData = {...newCourseObject, cards: filteredCards, percentageDone: newPercentage} // <--- current courseDATA
    var finalDataJSON = JSON.stringify(finalData)
    await AsyncStorage.setItem(finalData.courseID.toString(), finalDataJSON)
    dispatch(LibraryActions.updateLibrary(newCourseObject))
    setCurrentCards(finalData.cards)
  }catch(e){
    console.log(e);
  }
};

  return (
    <ImageBackground style={styles.container} source={require("../components/pictures/wood.jpg")}>
      <ScrollView style={styles.ScrollView} contentContainerStyle={{justifyContent:"center", alignItems:"center"}}>
      {currentCards.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.CardElement} 
          onPress={() => {
            deleteCard(item);
          }}>
          <Text>{item.q1}</Text>
          {item?.q2 && (<Text> __ {item.q2}</Text>)}
        </TouchableOpacity>
      ))}
      </ScrollView>
      <StatusBar style="auto"/>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ScrollView:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height
  },
  CardElement:{
    width:Dimensions.get('window').width*0.85,
    height:Dimensions.get('window').height*0.08,
    backgroundColor:"rgba(128,128,128,0.65)",
    justifyContent:"center", 
    alignItems:"center",
    flexDirection:"row",
    borderRadius:20,
    marginTop:40
  }
});

export default RemoveCards;