import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, ImageBackground, Image, Button} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import * as SpecialActions from "../store/actions/SpecialActions";
import { useDispatch } from 'react-redux';
import Toast, { BaseToast } from 'react-native-toast-message';


const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'tomato' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  )
}

//screen for Displaying current module. Statistics, all cards, etc
const CourseMenu = props => {
  const dispatch = useDispatch();
  const [chosenMethod, setChosenMethod] = useState(null);
  const buttonStyle = {
    width:"30%",
    height:"60%", 
    backgroundColor:"green",
    borderWidth:2,
    borderColor:"black"
  };
  const [buttonColor1, setButtonColor1] = useState("black");
  const [buttonColor2, setButtonColor2] = useState("black");
  const [buttonColor3, setButtonColor3] = useState("black");
  
  const changeMethod = (chosenone) =>{
    switch(chosenone){
      case "infinite":
        setButtonColor1("tomato")
        setButtonColor2("black")
        setButtonColor3("black")
        setChosenMethod("infinite")
        console.log("changed")
        break;
      case "hard":
        setButtonColor1("black")
        setButtonColor2("tomato")
        setButtonColor3("black")
        setChosenMethod("hard")
        console.log("changed2")
        break;
      case "correcture":
        setButtonColor1("black")
        setButtonColor2("black")
        setButtonColor3("tomato")
        setChosenMethod("correcture")
        console.log("changed3")
        break;
      default:
        break;
    }
  };

  const gotopractice = (currentMethod) => {
    if(props.route.params.mycourse.cards.length == 0){
      console.log("EMPTY COURSE")
      Toast.show({
        type: 'error',
        text1: 'No cards added yet!',
        text2: 'Please edit the course and add some cards before you continue.'
      });
    }else{
      if(currentMethod=="hard"||currentMethod=="correcture"){
        Toast.show({
          type: 'error',
          text1: 'Not available yet!',
          text2: "The " + currentMethod + "-method is not available in the Demo Version."
        });
      }else{
        dispatch(SpecialActions.setBottomTabVisibility("none"));
        props.navigation.navigate({name:'PracticeScreen', params:{
        currentmethod: currentMethod,
        courseData: props.route.params.mycourse
        }});
      }
    }
  };

  useEffect(() => {//setting Options for the CourseMenu-Screen
    props.navigation.setOptions({ 
      headerTitle:props.route.params.mycourse.coursename,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate({name:'CourseStatistics', params:{
              mycourse: props.route.params.mycourse
          }});
          }}
          title="Info"
          color="black"
        >
          <Entypo name="area-graph" size={24} color="tomato" />
        </TouchableOpacity>
      )
    
    })
  }, []);

  //console.log(props.route.params.mycourse)

  return (
    <ImageBackground style={styles.container} source={require("../components/pictures/wood.jpg")}>
      <StatusBar style="auto" />

      <View style={styles.screenfold1}>
        <View style={styles.screensplit}>
          <ImageBackground source={require('../components/pictures/bubble.png')} style={{...styles.bubble, marginTop:"55%"}}>
            <Text style={{marginTop:"10%", marginLeft:"6.5%", color:"tomato"}}>Choose your learning method and let us start to learn!</Text>
          </ImageBackground>
          <Image source={require('../components/pictures/littlestudent-maskottchen.png')} style={styles.mascot}/>
        </View>
        <View style={styles.screensplit}>
          <TouchableOpacity 
            onPress={()=>{gotopractice(chosenMethod)}} 
            style={{...styles.buttonstartStyle, display:chosenMethod?"flex":'none'}}
          >
            <Ionicons name="ios-infinite-sharp" size={24} color="black" style={{alignSelf:"center"}}/>
            <Text style={{alignSelf:"center", fontSize:18}}>Let us study</Text>
            <Text style={{alignSelf:"center", fontSize:12, marginHorizontal:10, marginTop:"35%"}}>Press to practice!</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.screenfold2}>
        <View style={{height:"10%", width:"100%"}}>
          <Text style={{fontSize:20, textAlign:"center", paddingTop:"2%", color:"tomato"}}>Choose your learn method:</Text>
        </View>
        <View style={{height:"90%", width:"100%", flexDirection:"row", justifyContent:"space-evenly", alignItems:"flex-start", marginTop:"5%"}}>
          <TouchableOpacity onPress={()=>{changeMethod("infinite")}} style={{...buttonStyle, borderColor:buttonColor1}}>
            <Ionicons name="ios-infinite-sharp" size={24} color="black" style={{alignSelf:"center"}}/>
            <Text style={{alignSelf:"center"}}>Infinite Repetition</Text>
            <Text style={{alignSelf:"center", fontSize:12, marginHorizontal:10, marginTop:"35%"}}>Practice without any penalty, trying out your skills.</Text>

          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{changeMethod("hard")}} style={{...buttonStyle, borderColor:buttonColor2}}>
            <Ionicons name="flame" size={24} color="black" style={{alignSelf:"center"}}/>
            <Text style={{alignSelf:"center"}}>Hard difficulty</Text>
            <Text style={{alignSelf:"center", fontSize:12, marginHorizontal:10, marginTop:"35%"}}>Repeat all cards, your weak ones will be shown more often.</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{changeMethod("correcture")}} style={{...buttonStyle, borderColor:buttonColor3}}>
            <Ionicons name="ios-hammer" size={24} color="black" style={{alignSelf:"center"}}/>
            <Text style={{alignSelf:"center"}}>Correct mistakes</Text>
            <Text style={{alignSelf:"center", fontSize:12, marginHorizontal:10, marginTop:"35%"}}>Only failed cards will appear here.</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast config={toastConfig} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#5aa7de"
  },
  scrollView: {
    width: (Dimensions.get('window').width),
    minHeight: (Dimensions.get('window').height),
    flexDirection:"column",
    alignItems:"center",
    backgroundColor: '#5aa7de'
  },
  screensplit:{
    flexDirection:"column",
    justifyContent:"space-evenly",
    alignItems:"center",
    height:"100%",
    width:"50%"
  },
  screenfold1:{
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height)/2,
    flexDirection:"row"
  },
  screenfold2:{
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height)/2,
  },
  bubble:{
    height: 150, 
    width:175,
    resizeMode:'contain'
  },
  mascot:{
    height: 200, 
    width:150,
    resizeMode:'contain',
    marginleft:100
  },
  buttonstartStyle:{
    width:"80%",
    height:"40%", 
    backgroundColor:"green",
    borderWidth:2,
    borderColor:"tomato",
  }
  
});

export default CourseMenu;