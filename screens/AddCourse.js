import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { Dimensions, StyleSheet, Text, View, Button, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import Toast, { BaseToast } from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import * as LibraryActions from "../store/actions/CourseLibrary";

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

const AddCourse = props => {
  const dispatch = useDispatch();
  const [coursename, changeCourseName] = useState("");
  const [easy, setEasy] = useState(false);
  const [medium, setMedium] = useState(false);
  const [hard, setHard] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [courseInfo, setCourseInfo] = useState("");

  const ButtonisPressed = async() => {
    if(coursename == "" ){
      console.log("Coursename may not be empty!")
    }else
    if(easy==false & medium==false & hard==false){
      console.log("Please set a difficulty first!");
    }else{
      const courseID = Math.floor(Math.random() * 999999999);

      const courseObject = {//setting the course object full
        coursename: coursename,
        courseID: courseID,
        difficulty: difficulty,
        courseInfo: courseInfo,
        cards:[],
        currentMistakes:[],
        percentageDone:0
      };
      const courseIdentifier = {//setting only the pointer to the full course
        coursename: coursename,
        courseID: courseID,
        percentageDone:0
      };
      console.log(courseObject);
      console.log(courseIdentifier);
      try {
        //save new course
        const jsonCourse = JSON.stringify(courseObject);
        await AsyncStorage.setItem(courseID.toString(), jsonCourse);
        //pull out library of courses
        const courseLibraryJSON = await AsyncStorage.getItem('CourseLibrary');
        const courseLibrary = JSON.parse(courseLibraryJSON);//array with course objects (only links, no cards)
        //add course to library
        courseLibrary.push(courseIdentifier);
        //save it again
        const updatedCourseLibrary = JSON.stringify(courseLibrary);
        await AsyncStorage.setItem('CourseLibrary', updatedCourseLibrary);
      } catch (e) {
        console.log("something went wrong saving to async storage, read note: " + e)
      }
      changeCourseName("");
      setEasy(false);
      setMedium(false);
      setHard(false);
      dispatch(LibraryActions.setLibrary());
      Toast.show({
        type: 'success',
        text1: 'Course added!',
        text2: 'Your course ' + coursename + " has been added! 👋"
      });
    };
  };



  return (
    <ImageBackground style={styles.container} source={require("../components/pictures/wood.jpg")}>
      <StatusBar style="auto" />
      <View style={styles.subcontainer}>
        <Text style={styles.subboxtext}>Name your next course: </Text>
        <TextInput style={styles.input} value={coursename} onChangeText={changeCourseName}/>
      </View>
      <View style={styles.subcontainer}>
        <Text style={styles.subboxtext}>Set your difficulty:</Text>
        <View style={styles.textandbox}>
          <Text style={styles.textOverBox}>EASY</Text>
          <CheckBox
          
          value={easy}
          tintColors={{true: "tomato", false: "black"}}
          onValueChange={(newValue) => {setEasy(newValue), setMedium(false), setHard(false), setDifficulty("easy")}}
          />
        </View>
        <View style={styles.textandbox}>
          <Text style={styles.textOverBox}>MEDIUM</Text>
          <CheckBox
          value={medium}
          tintColors={{true: "tomato", false: "black"}}
          onValueChange={(newValue) => {setMedium(newValue), setEasy(false), setHard(false), setDifficulty("medium")}}
          />
        </View>
        <View style={styles.textandbox}>
          <Text style={styles.textOverBox}>HARD</Text> 
          <CheckBox
          value={hard}
          tintColors={{true: "tomato", false: "black"}}
          onValueChange={(newValue) => {setHard(newValue), setMedium(false), setEasy(false), setDifficulty("hard")}}
          />
        </View>
      </View>
      <View style={styles.subcontainer}>
        <Text style={styles.subboxtext}>Course Info (optional): </Text>
          <TextInput style={styles.input} value={courseInfo} onChangeText={setCourseInfo}/>
      </View>
      <Button title="Create Course" color="tomato" accessibilityLabel="Learn more about this purple button" onPress={() => {ButtonisPressed()}}/>
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
  subcontainer:{
    flexDirection:"row",
    minHeight: (Dimensions.get('window').height/8),
    width:"80%",
    justifyContent:"space-between",
    alignItems:"center"
  },
  subboxtext:{
    fontSize:16,
    color:"tomato",
    fontWeight:"500"
  },
  input: {
    height: 40,
    width:"37.5%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor:"tomato",
    color:"tomato"
  },
  textandbox: {
    flexDirection:"column", 
    alignItems:"center", 
    justifyContent:"space-between"
  },
  textOverBox:{
    color:"tomato",
    fontWeight:"500"
  }
  
});

export default AddCourse;