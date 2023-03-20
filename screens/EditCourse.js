import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, Modal, Alert, ImageBackground, TouchableOpacity} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Picker} from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import Toast, { BaseToast } from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import * as LibraryActions from "../store/actions/CourseLibrary";
import { useRoute } from '@react-navigation/native';

import * as SpecialActions from "../store/actions/SpecialActions";

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

const EditCourse = props => {
  const dispatch = useDispatch();
  const route = useRoute();
  const [difficulty, setDifficulty] = useState("easy");
  const [cardType, setCardType] = useState("Q&A");
  const [fillerText, setFillerText] = useState("");
  const [fillerText2, setFillerText2] = useState("");
  const [fillerAnswer, setFillerAnswer] = useState("");
  const [wrongAnswer, SetWrongAnswer] = useState("");
  const [wrongAnswer2, SetWrongAnswer2] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [courseObject, setCourseObject] = useState(null);

useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log("back on EditCourse")
      loadCourse();
    });
    if(props.route.params.coursekey == 1){
      props.navigation.setOptions({ 
        headerTitle:"No course yet!"
      })
    }else{
      props.navigation.setOptions({ 
        headerTitle:props.route.params.coursename + " - Options"
      })
    }
    return unsubscribe;
}, [props.navigation])

const loadCourse = async () => {
  try{
    const decryptedvalue = (props.route.params.coursekey).toString();
    await AsyncStorage.getItem(decryptedvalue).then(oneCourseJSON =>{
      const decryptedOneCourse = JSON.parse(oneCourseJSON);
      console.log(decryptedOneCourse);
      setCourseObject(decryptedOneCourse);
      setDifficulty(decryptedOneCourse.difficulty)
    })
  }catch(e){
    console.log(e)
  }
};

const addCard = async() => {
  // if Befehle damit Fehler abgefangen werden
  //abspeichern
  try{
    switch(cardType){
      case 'Q&A':
        if(fillerText=="" || fillerAnswer==""){
          Toast.show({
            type: 'error',
            text1: 'An error occured!',
            text2: 'Please fill out all the requested parts.'
          });
        }else{
          const newCard = {type:"Q&A", q1: fillerText, answer: fillerAnswer}
          const cardSet = courseObject.cards;
          cardSet.push(newCard);
          const newCourseObject = {...courseObject, cards: cardSet};
          setCourseObject(newCourseObject);
          const strNewCourseObject = JSON.stringify(newCourseObject);
          //course object now updated on screen, now you need to write it inside asyncstorage
          await AsyncStorage.setItem((props.route.params.coursekey).toString(), strNewCourseObject);
          setFillerAnswer("");
          setFillerText("");
          Toast.show({
            type: 'success',
            text1: 'Card added!',
            text2: "A new card has been added to the course! 👋"
          });
        }
        break;

      case 'fillertext':
        if(fillerText=="" || fillerText2=="" || fillerAnswer==""){
          Toast.show({
            type: 'error',
            text1: 'An error occured!',
            text2: 'Please fill out all the requested parts.'
          });
        }else{
          const newCard = {type:"fillertext", q1: fillerText, q2: fillerText2, answer: fillerAnswer}
          const cardSet = courseObject.cards;
          cardSet.push(newCard);
          const newCourseObject = {...courseObject, cards: cardSet};
          setCourseObject(newCourseObject);
          const strNewCourseObject = JSON.stringify(newCourseObject);
          //course object now updated on screen, now you need to write it inside asyncstorage
          await AsyncStorage.setItem((props.route.params.coursekey).toString(), strNewCourseObject);
          setFillerAnswer("");
          setFillerText("");
          setFillerText2("");
          Toast.show({
            type: 'success',
            text1: 'Card added!',
            text2: "A new card has been added to the course! 👋"
          });
        }
        break;

      case 'fillertextMC':
        if(fillerText=="" || fillerText2=="" || fillerAnswer=="" || wrongAnswer=="" || wrongAnswer2==""){
          Toast.show({
            type: 'error',
            text1: 'An error occured!',
            text2: 'Please fill out all the requested parts.'
          });
        }else{
          const newCard = {type:"fillertextMC", q1: fillerText, q2: fillerText2, answer: fillerAnswer, wa1: wrongAnswer, wa2: wrongAnswer2}
          const cardSet = courseObject.cards;
          cardSet.push(newCard);
          const newCourseObject = {...courseObject, cards: cardSet};
          setCourseObject(newCourseObject);
          const strNewCourseObject = JSON.stringify(newCourseObject);
          //course object now updated on screen, now you need to write it inside asyncstorage
          await AsyncStorage.setItem((props.route.params.coursekey).toString(), strNewCourseObject);
          setFillerAnswer("");
          setFillerText("");
          setFillerText2("");
          SetWrongAnswer("");
          SetWrongAnswer2("");
          Toast.show({
            type: 'success',
            text1: 'Card added!',
            text2: "A new card has been added to the course! 👋"
          });
        }
        break;

      case 'MC':
        if(fillerText=="" || fillerAnswer=="" || wrongAnswer=="" || wrongAnswer2==""){
          Toast.show({
            type: 'error',
            text1: 'An error occured!',
            text2: 'Please fill out all the requested parts.'
          });
        }else{
          const newCard = {type:"MC", q1: fillerText, answer: fillerAnswer, wa1: wrongAnswer, wa2: wrongAnswer2}
          const cardSet = courseObject.cards;
          cardSet.push(newCard);
          const newCourseObject = {...courseObject, cards: cardSet};
          setCourseObject(newCourseObject);
          const strNewCourseObject = JSON.stringify(newCourseObject);
          //course object now updated on screen, now you need to write it inside asyncstorage
          await AsyncStorage.setItem((props.route.params.coursekey).toString(), strNewCourseObject);
          setFillerAnswer("");
          setFillerText("");
          SetWrongAnswer("");
          SetWrongAnswer2("");
          Toast.show({
            type: 'success',
            text1: 'Card added!',
            text2: "A new card has been added to the course! 👋"
          });
        }
        break;

      case 'listenwrite':
        if(fillerText=="" || fillerAnswer==""){
          Toast.show({
            type: 'error',
            text1: 'An error occured!',
            text2: 'Please fill out all the requested parts.'
          });
        }else{
          const newCard = {type:"listenwrite", q1: fillerText, answer: fillerAnswer}
          const cardSet = courseObject.cards;
          cardSet.push(newCard);
          const newCourseObject = {...courseObject, cards: cardSet};
          setCourseObject(newCourseObject);
          const strNewCourseObject = JSON.stringify(newCourseObject);
          //course object now updated on screen, now you need to write it inside asyncstorage
          await AsyncStorage.setItem((props.route.params.coursekey).toString(), strNewCourseObject);
          setFillerAnswer("");
          setFillerText("");
          SetWrongAnswer("");
          SetWrongAnswer2("");
          Toast.show({
            type: 'success',
            text1: 'Card added!',
            text2: "A new card has been added to the course! 👋"
          });
        }
        break;

      default:
        break;
    };
  }catch(e){
    Toast.show({
      type: 'error',
      text1: 'An error occured!',
      text2: 'Something went wrong.'
    });
    console.log(e)
  }
};
const updateDifficulty = async() => {
  /* 
  get the whole course object
  overwrite course object
  save course object again
  dispatch an course update
  */ 
  try {
    const newCourseObject = {...courseObject, difficulty: difficulty};
    const StringifiedNewCourse = JSON.stringify(newCourseObject);
    console.log(props.route.params.coursekey)
    await AsyncStorage.setItem((props.route.params.coursekey).toString(), StringifiedNewCourse);

  } catch (e) {
    console.log("something went wrong saving to async storage, read note: " + e)
  }
  Toast.show({
    type: 'success',
    text1: 'Difficulty updated!',
    text2: 'This course will be now set to the difficulty ' + difficulty + ' 👋'
  });
};
const infopressed = () => {
  switch(cardType){
    case 'Q&A':
      setModalTitle("Q&A")
      setModalText("Simple card providing one question accepting only one right answer.")
      break;
    case 'fillertext':
      setModalTitle("Fillertext")
      setModalText("Type in your question and a correct answer for this card. The question is separated into two parts because during practice it will be displayed with an empty field splitting the question so you know what is missing.")
      break;

    case 'fillertextMC':
      setModalTitle("Fillertext & MC")
      setModalText("Type in your question (separated where the text to fill should be) and provide the right answer along with 2 wrong answers.")
      break;

    case 'MC':
      setModalTitle("MC")
      setModalText("Pure multiple-choice. Provide your question along with an answer and two wrong answers. ")
      break;

    case 'listenwrite':
      setModalTitle("Listen & Write")
      setModalText("The question you provide will be spoken out by the app, this exercise aims to let you listen to the sentence and provide the right answer.")
      break;

    default:
      console.log("0")
      break;
  }
  setModalVisible(true);
};
const removeCardsPressed = () => {
  if(courseObject.cards.length > 0){
    var preLoaded = {};
    Object.assign(preLoaded, courseObject)
    dispatch(SpecialActions.setBottomTabVisibility("none"));
    props.navigation.navigate({name:'Remove Cards', params:{
      passedCourse: preLoaded
  }});
  }else{
    Toast.show({
      type: 'error',
      text1: 'No cards in course!',
      text2: 'You have no cards in this course yet.'
    });
  }
  
};
const removeEntireCourse = () => {
  Alert.alert("Hold on!", "Are you sure you want to delete the course?", [
    {
      text: "Cancel",
      onPress: () => null,
      style: "cancel"
    },
    { text: "YES", onPress: async() => {
      try{
        const decryptedvalue = (props.route.params.coursekey);
        //delete all CourseData
        const StringedDecryptedValue = decryptedvalue.toString();
        await AsyncStorage.removeItem(StringedDecryptedValue);
        //delete library entry
        const CourseLibrary = await AsyncStorage.getItem('CourseLibrary');
        const CourseLibraryObj = JSON.parse(CourseLibrary);
        const index = CourseLibraryObj.findIndex(obj => obj.courseID === decryptedvalue);
        if (index !== -1) {
          CourseLibraryObj.splice(index, 1);
          const jsonValue = JSON.stringify(CourseLibraryObj);
          await AsyncStorage.setItem('CourseLibrary', jsonValue);
          //dispatch new Library State
          dispatch(LibraryActions.setLibrary())
        }
        props.navigation.goBack();
        }catch(e){
          console.log(e);
        }
    }}
  ],{cancelable: false});
};

  return (
    (courseObject != null) ? (
    <ImageBackground style={styles.container} source={require("../components/pictures/wood.jpg")}>
      <StatusBar style="auto"/>
      <View style={styles.splitter1}>
        <Text style={styles.titlestyle}>Change current difficulty:</Text>
        <View style={styles.pickerslot}>
          <Text style={{fontSize:16, color:"tomato", fontWeight:"500"}}>Current difficulty: </Text>
          <Picker
            style={styles.picker}
            selectedValue={difficulty}
            onValueChange={(itemValue) =>{
              setDifficulty(itemValue)
              updateDifficulty(itemValue)
            }
            }>
            <Picker.Item label="easy" value="easy" />
            <Picker.Item label="medium" value="medium" />
            <Picker.Item label="hard" value="hard" />
          </Picker>
        </View>
      </View>
      <View style={styles.splitter2}>
        <Text style={styles.titlestyle}>Add new cards: </Text>
        <View style={styles.pickerslot}>
          <Text style={{fontSize:16, color:"tomato", fontWeight:"500"}}>Type of card: </Text>
          <AntDesign name="infocirlce" size={24} color="black" onPress={() => {infopressed()}}/>
          <Picker
            style={styles.picker}
            selectedValue={cardType}
            onValueChange={(itemValue) =>
              setCardType(itemValue)
            }>
            <Picker.Item label="Q&A" value="Q&A" />
            <Picker.Item label="Fillertext" value="fillertext" />
            <Picker.Item label="Fillertext & MC" value="fillertextMC" />
            <Picker.Item label="MC" value="MC" />
            <Picker.Item label="Listen & Write" value="listenwrite" />
          </Picker>
        </View>
        {(() => {
            switch (cardType) {
              case 'Q&A':
                return (
                  <View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Question: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerText(value)}
                        value={fillerText}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerAnswer(value)}
                        value={fillerAnswer}
                      />
                    </View>
                  </View>
                );
              case 'fillertext':
                return (
                  <View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Question part 1: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerText(value)}
                        value={fillerText}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Question part 2: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerText2(value)}
                        value={fillerText2}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerAnswer(value)}
                        value={fillerAnswer}
                      />
                    </View>
                  </View>
                );
              case 'fillertextMC':
                return (
                  <ScrollView>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Question part 1: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerText(value)}
                        value={fillerText}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Question part 2: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerText2(value)}
                        value={fillerText2}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerAnswer(value)}
                        value={fillerAnswer}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Wrong answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => SetWrongAnswer(value)}
                        value={wrongAnswer}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Wrong answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => SetWrongAnswer2(value)}
                        value={wrongAnswer2}
                      />
                    </View>
                  </ScrollView>
                  );
              case 'MC':
                return (
                  <ScrollView>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Question:  
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerText(value)}
                        value={fillerText}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerAnswer(value)}
                        value={fillerAnswer}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Wrong answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => SetWrongAnswer(value)}
                        value={wrongAnswer}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Wrong answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => SetWrongAnswer2(value)}
                        value={wrongAnswer2}
                      />
                    </View>
                  </ScrollView>
                  );
              case 'listenwrite':
                return (
                  <View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Question: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerText(value)}
                        value={fillerText}
                      />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Text style={styles.pickerfont}>
                        Answer: 
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => setFillerAnswer(value)}
                        value={fillerAnswer}
                      />
                    </View>
                  </View>
                  );
              default:
                return (
                  <Text> Choose a type of card to edit it </Text>
                  );
            }
          })()}
      </View>
      <View style={styles.splitter3}>
        <TouchableOpacity style={styles.bottombutton} onPress={() => removeEntireCourse()}><Text style={{fontWeight:'500', color:"black", fontWeight:"500"}}>remove course</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bottombutton} onPress={() => addCard()}><Text style={{fontWeight:'500', color:"black", fontWeight:"500"}}>add card</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bottombutton} onPress={() => removeCardsPressed()}><Text style={{fontWeight:'600', color:"black", fontWeight:"500"}}>remove cards</Text></TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modal}>
            <Text style={{fontSize:20}}>{modalTitle}</Text>
            <Text style={{marginTop:10, marginBottom:10}}>{modalText}</Text>
            <TouchableOpacity style={{...styles.bottombutton, backgroundColor:"rgba(255, 99, 71, 0.65)"}} onPress={() => {setModalVisible(false)}}>
              <Text style={{fontWeight:'600', color:"black", fontWeight:"500"}}>Close Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast config={toastConfig} />
    </ImageBackground>
    ) : (
    <ImageBackground style={styles.container} source={require("../components/pictures/wood.jpg")}>
      <StatusBar style="auto"/>
      <Text style={styles.titlestyle}>Add a course first!</Text>
    </ImageBackground>
    )
    
  );
}

const styles = StyleSheet.create({
  container: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitter1:{
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height)*(1.5/10),
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  splitter2:{
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height)*(5/10),
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"flex-start",
  },
  splitter3:{
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height)*(3.5/10),
    flexDirection:"row",
    alignItems:'baseline',
    paddingTop:"15%",
    justifyContent:'space-evenly'
  },
  titlestyle:{
    fontSize:18,
    fontWeight:"500",
    color:"tomato"
  },
  pickerslot:{
    width: (Dimensions.get('window').width)*(9.5/10),
    height: (Dimensions.get('window').height)*(1/10),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-around",
    backgroundColor:"rgba(128, 128, 128, 0.5)",
    borderRadius:15,
    marginTop:"0%"
  },
  picker:{
    width: (Dimensions.get('window').width)*(4/10),
    backgroundColor:"rgba(255, 99, 71, 0.5)"
  },
  input: {
    height: 40,
    width:(Dimensions.get('window').width)*(5/10),
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor:"tomato",
    color:"tomato"
  },
  bottombutton:{
    backgroundColor: "rgba(128,128,128,0.75)",
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    //elevation: 5,
    width:150,
    maxWidth:Dimensions.get('window').width * 0.3,
    height:40,
    justifyContent:"center",
    alignItems:"center",
  },
  modalWrapper:{
    width: "100%",
    height: "100%",
    marginTop:"40%",
    flexDirection:"column",
    alignItems:'center',
    justifyContent:"space-between",
  },
  modal:{
    margin: 10,
    backgroundColor:"rgba(128,128,128,0.9)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  pickerfont:{
    color:"tomato", 
    fontWeight:"500"
  }
});

export default EditCourse;