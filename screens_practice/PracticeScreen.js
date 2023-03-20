import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, BackHandler, Alert, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, ImageBackground, Image} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Toast, { BaseToast } from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import firebase from "firebase";
import { AntDesign } from '@expo/vector-icons';

import * as LibraryActions from "../store/actions/CourseLibrary";
import * as SpecialActions from "../store/actions/SpecialActions";

import CardFlip from 'react-native-card-flip';

import storage from "../store/MMKV/MMKV";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Tts from 'react-native-tts';

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

const PracticeScreen = props => {
  const dispatch = useDispatch();

  const myLibrary = useSelector(state => state.myLibrary.myLibrary);
  const myBottomTab = useSelector(state => state.myOtherReducers.showBottomTab);
  const currentVoice = useSelector(state => state.myOtherReducers.currentVoice);

  const backActionRef = useRef(null);
  const cardRef = useRef(null);

  
  //console.log(props.route.params) //courseData and currentmethod 


  const [loadedCardStack, setLoadedCardStack] = useState([]); //preloaded CardStack
  const [modalVisible, setModalVisible] = useState(false);  //InfoModal-Trigger

  const [currentAnswer, setCurrentAnswer] = useState(""); //current Answer which is inside TextInput
  
  const [wrongCards, setWrongCards] = useState([]); //all wrong cards user did
  const [goodCards, setGoodCards] = useState([]); //all good cards user did

  const [currentSide, setCurrentSide] = useState("A"); // needed to determine which side we need to load right now
  const [cardCounter, setCardCounter] = useState(0); // for display, also to check when the end of array is archieved

  const [fillerTextA, setFillerTextA] = useState(""); //Question or part of question
  const [fillerText2A, setFillerText2A] = useState(""); // only used if any type of fillertext active
  const [wrongAnswerA, SetWrongAnswerA] = useState(""); //wrong answer, only used in MultipleQuestion
  const [wrongAnswer2A, SetWrongAnswer2A] = useState(""); //wrong answer, only used in MultipleQuestion
  const [cardSolutionA, setCardSolutionA] = useState(null); //right Answer A
  const [cardTypeA, setCardTypeA] = useState(null); //type of card A

  const [fillerTextB, setFillerTextB] = useState("");
  const [fillerText2B, setFillerText2B] = useState("");
  const [wrongAnswerB, SetWrongAnswerB] = useState("");
  const [wrongAnswer2B, SetWrongAnswer2B] = useState("");
  const [cardSolutionB, setCardSolutionB] = useState(null);
  const [cardTypeB, setCardTypeB] = useState(null);

  const [isAnswerRight, setIsAnswerRight] = useState(null); //trigger which allows to turn card - loads after buttonPress.

  //conditional properties which need to render (special cards)
  const [falseAnswerA1, setFalseAnswerA1] = useState("");
  const [falseAnswerA2, setFalseAnswerA2] = useState("");
  const [falseAnswerB1, setFalseAnswerB1] = useState("");
  const [falseAnswerB2, setFalseAnswerB2] = useState("");
  const [touchableButtonsArray, setTouchableButtonsArray] = useState(["05121998", "05121998", "05121998"]);
  const [touchableButtonsArray2, setTouchableButtonsArray2] = useState(["05121998", "05121998", "05121998"]);


  const [buttonDisabled, setButtonDisabled] = useState(false); //button to check answer


  useEffect(() => {
    /**listener sub and unsub when changing screen
     * dispatching of bottom tab nav happening here*/
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the course? Unsaved progress will get lost.", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => {
          dispatch(SpecialActions.setBottomTabVisibility("flex"));
          storage.delete("mistakes");
          props.navigation.goBack();
          props.navigation.goBack();
        }}
      ],{cancelable: false});
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

  useLayoutEffect(() => {
    /*Layoutstyling for header must be here, not in Navigator.js*/
    props.navigation.setOptions({
      headerTitle: 'Practice Screen',
      headerStyle: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
      },
      headerTitleStyle: {
        color: 'tomato',
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => {
          Alert.alert("Hold on!", "Are you sure you want to exit the course? Unsaved progress will get lost.", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => {
              dispatch(SpecialActions.setBottomTabVisibility("flex"));
              storage.delete("mistakes");
              props.navigation.goBack()
              props.navigation.goBack()            
            }}
          ],{cancelable: false});
        }}>
          <AntDesign name="caretleft" size={24} color="tomato" style={{paddingLeft:10}}/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          setModalVisible(!modalVisible)
        }}>
          <AntDesign name="infocirlce" size={24} color="tomato" />
        </TouchableOpacity>
      ),
      headerBackground: () => (
        <Image
        style={{flex:1}}
        resizeMode="stretch"
        source={require("../components/pictures/greywood.jpg")}
        />
      ),
    });
  }, [props.navigation]);

  useEffect(() => {
    /*loading up the Cards at the beginning */ 
    loadCardStack();
  }, []);

  useEffect(() => {
    /*Load first card*/
    if(cardCounter == 0){
      loadCard("first");
    }
  }, [loadedCardStack]);
  
  const loadCardStack = () => {
    /* function to load all cards into the State, adding a dummycard to the end*/ 
    var preLoadedStack = [];
    Object.assign(preLoadedStack, props.route.params.courseData.cards)
    preLoadedStack.push({type:"ENDCARD"})
    //console.log("here are the cards: ", preLoadedStack )
    setLoadedCardStack(preLoadedStack);
  };

  const loadCard = (checkvar) => {
    if(loadedCardStack.length > 0){
      if((currentSide =="A" && checkvar=="first") || (currentSide=="B")){
        switch(loadedCardStack[cardCounter].type){
          case "Q&A":
            setFillerTextA(loadedCardStack[cardCounter].q1)
            setCardSolutionA(loadedCardStack[cardCounter].answer)
            setCardTypeA(loadedCardStack[cardCounter].type)
            break;
          case "fillertext":
            setFillerTextA(loadedCardStack[cardCounter].q1)
            setFillerText2A(loadedCardStack[cardCounter].q2)
            setCardSolutionA(loadedCardStack[cardCounter].answer)
            setCardTypeA(loadedCardStack[cardCounter].type)
            break;
          case "fillertextMC":
            //generate random order, set array of objects to setTouchableButtonsArray
            var buttondata = [
              loadedCardStack[cardCounter].wa1, loadedCardStack[cardCounter].wa2, loadedCardStack[cardCounter].answer
            ]
            setTouchableButtonsArray(buttondata.sort(() => Math.random() - 0.5));
            setFillerTextA(loadedCardStack[cardCounter].q1)
            setFillerText2A(loadedCardStack[cardCounter].q2)
            setCardSolutionA(loadedCardStack[cardCounter].answer)
            //setFalseAnswerA1(loadedCardStack[cardCounter].wa1)
            //setFalseAnswerA2(loadedCardStack[cardCounter].wa2)
            setCardTypeA(loadedCardStack[cardCounter].type)
            break;
          case "MC":
            //generate random order, set array of objects to setTouchableButtonsArray
            var buttondata = [
              loadedCardStack[cardCounter].wa1, loadedCardStack[cardCounter].wa2, loadedCardStack[cardCounter].answer
            ]
            setTouchableButtonsArray(buttondata.sort(() => Math.random() - 0.5));
            setFillerTextA(loadedCardStack[cardCounter].q1)
            setCardSolutionA(loadedCardStack[cardCounter].answer)
            //setFalseAnswerA1(loadedCardStack[cardCounter].wa1)
            //setFalseAnswerA2(loadedCardStack[cardCounter].wa2)
            setCardTypeA(loadedCardStack[cardCounter].type)
            break;
          case "listenwrite":
            setFillerTextA(loadedCardStack[cardCounter].q1)
            setCardSolutionA(loadedCardStack[cardCounter].answer)
            setCardTypeA(loadedCardStack[cardCounter].type)
            break;
          default:
            setFillerTextA("END")
            setFillerText2A("END")
            SetWrongAnswerA("IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")
            SetWrongAnswer2A("IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")
            setCardSolutionA("THISISTHEENDSTOPITNOW")
            setCardTypeA(loadedCardStack[cardCounter].type)
            break;
        }
      }else{
        console.log("loading new card on B side")
        switch(loadedCardStack[cardCounter].type){
          case "Q&A":
            setFillerTextB(loadedCardStack[cardCounter].q1)
            setCardSolutionB(loadedCardStack[cardCounter].answer)
            setCardTypeB(loadedCardStack[cardCounter].type)
            break;
          case "fillertext":
            setFillerTextB(loadedCardStack[cardCounter].q1)
            setFillerText2B(loadedCardStack[cardCounter].q2)
            setCardSolutionB(loadedCardStack[cardCounter].answer)
            setCardTypeB(loadedCardStack[cardCounter].type)
            break;
          case "fillertextMC":
            //generate random order, set array of objects to setTouchableButtonsArray
            var buttondata = [
              loadedCardStack[cardCounter].wa1, loadedCardStack[cardCounter].wa2, loadedCardStack[cardCounter].answer
            ]
            setTouchableButtonsArray2(buttondata.sort(() => Math.random() - 0.5));
            setFillerTextB(loadedCardStack[cardCounter].q1)
            setFillerText2B(loadedCardStack[cardCounter].q2)
            setCardSolutionB(loadedCardStack[cardCounter].answer)
            //setFalseAnswerB1(loadedCardStack[cardCounter].wa1)
            //setFalseAnswerB2(loadedCardStack[cardCounter].wa2)
            setCardTypeB(loadedCardStack[cardCounter].type)
            break;
          case "MC":
            //generate random order, set array of objects to setTouchableButtonsArray
            var buttondata = [
              loadedCardStack[cardCounter].wa1, loadedCardStack[cardCounter].wa2, loadedCardStack[cardCounter].answer
            ]
            setTouchableButtonsArray2(buttondata.sort(() => Math.random() - 0.5));
            setFillerTextB(loadedCardStack[cardCounter].q1)
            setCardSolutionB(loadedCardStack[cardCounter].answer)
            //setFalseAnswerB1(loadedCardStack[cardCounter].wa1)
            //setFalseAnswerB2(loadedCardStack[cardCounter].wa2)
            setCardTypeB(loadedCardStack[cardCounter].type)
            break;
          case "listenwrite":
            setFillerTextB(loadedCardStack[cardCounter].q1)
            setCardSolutionB(loadedCardStack[cardCounter].answer)
            setCardTypeB(loadedCardStack[cardCounter].type)
            break;
          default:
            setFillerTextB("END")
            setFillerText2B("END")
            SetWrongAnswerB("IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")
            SetWrongAnswer2B("IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")
            setCardSolutionB("THISISTHEENDSTOPITNOW")
            setCardTypeB(loadedCardStack[cardCounter].type)
            break;
        }
      }
      //counter +1
      setCardCounter(cardCounter+1)
    }else{
      console.log("logging empty array")
    }
    
  };

  const checkResultOfCard = (check) => {
    //if wrong question, mark card, else add to positive stack
    if(currentSide == "A"){
      if((currentAnswer == cardSolutionA)||(check == cardSolutionA)){
        setButtonDisabled(true)
        setupNextCard();
        loadCard("notfirst");
      }else{
        setIsAnswerRight(false);
        console.log("wrong answer")
        //ADD CARD TO FAILED STAPLE IF NOT ADDED YET
        var objToFind = loadedCardStack[cardCounter-1];
        var isObjectInArray = wrongCards.some(obj => obj.q1 === objToFind.q1);
        if (isObjectInArray) {
          console.log('The object is already in the array');
        } else {
          setWrongCards((wrongCards) => { //downgrade needed of cardCounter because its mainly to load next side. 
            var currentMistake = {};
            Object.assign(currentMistake, loadedCardStack[cardCounter-1]);
            switch (props.route.params.courseData.difficulty) {
              case "easy":
                currentMistake["mistakeCounter"] = 1;
                break;
              case "medium":
                currentMistake["mistakeCounter"] = 2;
                break;
              default:
                currentMistake["mistakeCounter"] = 3;
            }
            var quicksave = [...wrongCards, currentMistake];
            storage.set("mistakes", JSON.stringify(quicksave))
            return quicksave
          });
        }
      }
    }else{
      if((currentAnswer == cardSolutionB)||(check == cardSolutionB)){
        setButtonDisabled(true)
        setupNextCard();
        loadCard("notfirst");
      }else{
        setIsAnswerRight(false);
        console.log("wrong answer")
        //ADD CARD TO FAILED STAPLE IF NOT ADDED YET
        var objToFind = loadedCardStack[cardCounter-1];
        var isObjectInArray = wrongCards.some(obj => obj.q1 === objToFind.q1);
        if (isObjectInArray) {
          //console.log('The object is already in the array');
        } else {
          setWrongCards((wrongCards) => { //downgrade needed of cardCounter because its mainly to load next side. 
            var currentMistake = {};
            Object.assign(currentMistake, loadedCardStack[cardCounter-1]);
            switch (props.route.params.courseData.difficulty) {
              case "easy":
                currentMistake["mistakeCounter"] = 1;
                break;
              case "medium":
                currentMistake["mistakeCounter"] = 2;
                break;
              default:
                currentMistake["mistakeCounter"] = 3;
            }
            var quicksave = [...wrongCards, currentMistake];
            storage.set("mistakes", JSON.stringify(quicksave))
            return quicksave
          });
        }
      }
    }
  };

  const setupNextCard = () => {
    console.log("WELL DONE");
    setIsAnswerRight(true);
    //change current side
    if(currentSide =="A"){
      setCurrentSide("B")
      console.log("switched to B side now in state")
    }else{
      setCurrentSide("A")
    }
  };

  const jumpToNextCard = () => {
  if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
    cardRef.current.jiggle({ count: 4, duration: 100, progress: 0.05 })
    Toast.show({
      type: 'success',
      text1: 'No cards left!',
      text2: 'There are no more cards left. Exit the course or reload all cards 👋'
    });
  }else{
    //flip card (is already loaded because answer was right)
    cardRef.current.flip();
    //reset all shit
    setIsAnswerRight("unloaded");
    setCurrentAnswer("");
    setButtonDisabled(false);
  }
  };

  const saveCurrentState = async () => {
    /* save Progress when you try to leave the PracticeScreen */
    try{
      //calculate new percentage of done cards
      var percentageDone = Math.round((cardCounter-1  - wrongCards.length)/(loadedCardStack.length -1 )*100)/100 //-1 because of ENDCARD and because of cardCounter going +1
      //create new courseObject
      var courseID = props.route.params.courseData.courseID;
      var courseInfo = props.route.params.courseData.courseInfo;
      var coursename = props.route.params.courseData.coursename;
      var difficulty = props.route.params.courseData.difficulty;
      var cards = props.route.params.courseData.cards;
      var currentMistakes;
      if(storage.getString("mistakes") == undefined){
        currentMistakes = []
      }else{
        currentMistakes = JSON.parse(storage.getString("mistakes"))
      }
      var newCourseObject = {cards, currentMistakes, courseID, courseInfo, coursename, difficulty, percentageDone};
      var JSONnewCourseObject = JSON.stringify(newCourseObject);
      //overwrite course
      await AsyncStorage.setItem(courseID.toString(), JSONnewCourseObject)
      //update percentage in library
      dispatch(LibraryActions.updateLibrary(newCourseObject))
      console.log("PERCENTAGE: ", percentageDone)
    }catch(e){
      console.log(e)
      console.log("SAVE WENT WRONG")
    }
  };


  return (
    <ImageBackground style={{flex:1}} source={require("../components/pictures/wood.jpg")}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior='height' 
        keyboardVerticalOffset={-(Dimensions.get('window').height * 0.18)} 
        disabled
      >
        {loadedCardStack.length > 0 && (
        <View 
          style={styles.CardStackStyle} 
        >
          <CardFlip 
            style={styles.cardContainer}
            ref={cardRef}
          >
            <TouchableOpacity
              style={styles.fullTouchableCard}
              onPress={() => {
                if(isAnswerRight==true){
                  jumpToNextCard();
                  console.log("wrong cards here: ", wrongCards)
                }
                else{
                  cardRef.current.jiggle({ count: 4, duration: 100, progress: 0.05 })
                }
              }}
            >
              {(() => {
                switch(cardTypeA){
                  case "Q&A":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question1}>{fillerTextA}</Text> 
                        <TextInput 
                          style={styles.textEdit1}
                          placeholder=" answer"
                          value={currentAnswer}
                          onChangeText={(text) => {
                            setCurrentAnswer(text); 
                          }}
                        />
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={styles.buttonStyle}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard();   
                            }
                          }}
                        >
                        <Text>Check Result</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case "listenwrite":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question1}>{fillerTextA}</Text> 
                        <TextInput 
                          style={styles.textEdit1}
                          placeholder=" answer"
                          value={currentAnswer}
                          onChangeText={(text) => {
                            setCurrentAnswer(text); 
                          }}
                        />
                        <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => {
                          Tts.speak(fillerTextB, {
                            androidParams: {
                              KEY_PARAM_PAN: 0,
                              KEY_PARAM_VOLUME: 0.5,
                              KEY_PARAM_STREAM: 'STREAM_MUSIC',
                            },
                          });
                        }}
                        >
                          <AntDesign name="sound" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard();   
                            }
                          }}
                        >
                        <Text>Check Result</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case "fillertext":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question1}>{fillerTextA}</Text> 
                        <TextInput 
                          style={styles.textEdit1}
                          placeholder=" answer"
                          value={currentAnswer}
                          onChangeText={(text) => {
                            setCurrentAnswer(text); 
                          }}
                        />
                        <Text style={styles.question1}>{fillerText2A}</Text>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={styles.buttonStyle}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard();   
                            }
                          }}
                        >
                        <Text>Check Result</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case "fillertextMC":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question2}>{fillerTextA}</Text> 
                        <Text style={styles.question2}>"________"</Text> 
                        <Text style={styles.question2}>{fillerText2A}</Text>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray[0]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray[1]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray[1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray[2]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray[2]}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case "MC":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question2}>{fillerTextA}</Text> 
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray[0]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray[1]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray[1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray[2]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray[2]}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  default:
                    return(
                      <View style={styles.splitCard}>
                      
                      </View>
                    )
                }
              })()}
              <View style={styles.splitCard}>
                {(() => {
                  switch(isAnswerRight){
                    case true:
                      return(
                        <View style={styles.bottomOutputRight}>
                          <ImageBackground source={require('../components/pictures/bubble.png')} style={{...styles.bubble}}>
                            <Text style={{marginTop:"10%", marginLeft:"6.5%", color:"tomato"}}>You're doing well! Let us continue with the next card!</Text>
                          </ImageBackground>
                          <Image source={require('../components/pictures/littlestudent-maskottchen.png')} style={styles.mascot}/>
                        </View>
                      );
                    case false:
                      return(
                        <View style={styles.bottomOutputFalse}>
                          <ImageBackground source={require('../components/pictures/bubble.png')} style={{...styles.bubble}}>
                            <Text style={{marginTop:"10%", marginLeft:"6.5%", color:"tomato"}}>This is the wrong answer! Please try again.</Text>
                          </ImageBackground>
                          <Image source={require('../components/pictures/littlestudent-maskottchen.png')} style={styles.mascot}/>
                        </View>
                      );
                    default:
                      return(
                        <View style={{...styles.bottomOutputFalse, borderColor:"black"}}>
                          <ImageBackground source={require('../components/pictures/bubble.png')} style={{...styles.bubble}}>
                            <Text style={{marginTop:"10%", marginLeft:"6.5%", color:"tomato"}}>I hope you're making progress so far.</Text>
                          </ImageBackground>
                        <Image source={require('../components/pictures/littlestudent-maskottchen.png')} style={styles.mascot}/>
                        </View>
                      )
                  }
                })()}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fullTouchableCard}
              onPress={() => {
                if(isAnswerRight==true){
                  jumpToNextCard();
                  console.log("wrong cards here: ", wrongCards)
                }
                else{
                  cardRef.current.jiggle({ count: 4, duration: 100, progress: 0.05 })
                }
              }}
            >
              {(() => {
                switch(cardTypeB){
                  case "Q&A":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question1}>{fillerTextB}</Text> 
                        <TextInput 
                          style={styles.textEdit1}
                          placeholder=" answer"
                          value={currentAnswer}
                          onChangeText={(text) => {
                            setCurrentAnswer(text); 
                          }}
                        />
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={styles.buttonStyle}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard();   
                            }
                          }}
                        >
                        <Text>Check Result</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case "listenwrite":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question1}>{fillerTextB}</Text> 
                        <TextInput 
                          style={styles.textEdit1}
                          placeholder=" answer"
                          value={currentAnswer}
                          onChangeText={(text) => {
                            setCurrentAnswer(text); 
                          }}
                        />
                        <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => {
                          Tts.speak(fillerTextB, {
                            androidParams: {
                              KEY_PARAM_PAN: 0,
                              KEY_PARAM_VOLUME: 0.5,
                              KEY_PARAM_STREAM: 'STREAM_MUSIC',
                            },
                          });
                        }}
                      >
                          <AntDesign name="sound" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard();   
                            }
                          }}
                        >
                        <Text>Check Result</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case "fillertext":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question1}>{fillerTextB}</Text> 
                        <TextInput 
                          style={styles.textEdit1}
                          placeholder=" answer"
                          value={currentAnswer}
                          onChangeText={(text) => {
                            setCurrentAnswer(text); 
                          }}
                        />
                        <Text style={styles.question1}>{fillerText2B}</Text>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={styles.buttonStyle}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard();   
                            }
                          }}
                        >
                        <Text>Check Result</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case "fillertextMC":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question2}>{fillerTextB}</Text> 
                        <Text style={styles.question2}>________</Text> 
                        <Text style={styles.question2}>{fillerText2B}</Text>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray2[0]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray2[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray2[1]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray2[1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray2[2]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray2[2]}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case "MC":
                    return(
                      <View style={styles.splitCard}>
                        <Text style={styles.question2}>{fillerTextB}</Text> 
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray2[0]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray2[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray2[1]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray2[1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={buttonDisabled}
                          style={{...styles.buttonStyle, paddingHorizontal: "1%", marginTop:"2%"}}
                          onPress={() => {
                            if((wrongAnswerA == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA") || (wrongAnswerB == "IOHBOQEHUIBHIUABDCHIUBAHDUBCUIIUBCA")){
                              console.log("END REACHED");
                            }else{
                              checkResultOfCard(touchableButtonsArray2[2]);   
                            }
                          }}
                        >
                        <Text>{touchableButtonsArray2[2]}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  default:
                    return(
                      <View style={styles.splitCard}>
                      
                      </View>
                    )
                }
              })()}
              <View style={styles.splitCard}>
                {(() => {
                  switch(isAnswerRight){
                    case true:
                      return(
                        <View style={styles.bottomOutputRight}>
                          <ImageBackground source={require('../components/pictures/bubble.png')} style={{...styles.bubble}}>
                            <Text style={{marginTop:"10%", marginLeft:"6.5%", color:"tomato"}}>You're doing well! Let us continue with the next card!</Text>
                          </ImageBackground>
                          <Image source={require('../components/pictures/littlestudent-maskottchen.png')} style={styles.mascot}/>
                        </View>
                      );
                    case false:
                      return(
                        <View style={styles.bottomOutputFalse}>
                          <ImageBackground source={require('../components/pictures/bubble.png')} style={{...styles.bubble}}>
                            <Text style={{marginTop:"10%", marginLeft:"6.5%", color:"tomato"}}>You really need to focus. Please try again friend!</Text>
                          </ImageBackground>
                          <Image source={require('../components/pictures/littlestudent-maskottchen.png')} style={styles.mascot}/>
                        </View>
                      );
                    default:
                      return(
                        <View style={{...styles.bottomOutputFalse, borderColor:"black"}}>
                          <ImageBackground source={require('../components/pictures/bubble.png')} style={{...styles.bubble}}>
                            <Text style={{marginTop:"10%", marginLeft:"6.5%", color:"tomato"}}>A new card, a new chance!</Text>
                          </ImageBackground>
                          <Image source={require('../components/pictures/littlestudent-maskottchen.png')} style={styles.mascot}/>
                        </View>
                      )
                  }
                })()}
              </View>
            </TouchableOpacity>
          </CardFlip>
        </View>
        )}
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>Current learning method:</Text> 
                <Text style={{fontWeight:"500"}}> {props.route.params.currentmethod}</Text>
                <Text>Chosen difficulty for this course:</Text> 
                <Text style={{fontWeight:"500"}}>{props.route.params.courseData.difficulty}</Text>
                {(() => {
                  switch (props.route.params.courseData.difficulty) {
                    case 'easy':
                      return (
                        <Text style={{textAlign:"center"}}>
                          Because this course is set to "easy", cards you answer wrong will be needed to repeat 1 time correct in order to absolve them.
                          This does not apply if you chosen "infinite repetition" as your learning method.
                        </Text>
                      );
                    case 'medium':
                      return (
                        <Text style={{textAlign:"center"}}>
                          Because this course is set to "medium", cards you answer wrong will be needed to repeat 3 times correct in order to absolve them.
                        </Text>
                      );
                    case 'hard':
                      return (
                        <Text style={{textAlign:"center"}}>
                          Because this course is set to "hard", cards you answer wrong will be needed to repeat 5 times correct in order to absolve them.
                        </Text>
                      );
                    default:
                      return (
                      <Text> Default text </Text>
                      );
                  }
                })()}
                <TouchableOpacity
                  style={styles.buttonModalStyle}
                  onPress={() => {
                    saveCurrentState();
                    console.log("-----------------------------------------")
                    console.log("cardCounter rn: ", cardCounter)
                    console.log("wrong cards len: ", wrongCards.length);
                    console.log("allcards len: ", loadedCardStack.length -1 ) 
                    Toast.show({
                      type: 'success',
                      text1: 'Saved!',
                      text2: 'Current progress saved 👋'
                    });
                  }}
                >
                <Text>Save current state</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CardStackStyle:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContainer:{
    width:Dimensions.get('window').width * 0.85,
    height:Dimensions.get('window').height * 0.75,
    alignItems:"center"
  },
  fullTouchableCard:{
    height:"100%",
    width:"100%",
    backgroundColor: 'rgba(0, 128, 0, 0.8)', //green color
    borderColor:"black",
    borderWidth:1,
    borderRadius:30,
  },
  splitCard:{
    alignItems: 'center',
    justifyContent:"center",
    height:"50%",
    width:"100%"
  },
  bottomOutputFalse:{
    alignItems: 'center',
    borderWidth:2,
    borderColor:"red",
    width:"90%",
    height:"90%",
    borderRadius:10
  },
  bottomOutputRight:{
    alignItems: 'center',
    borderWidth:2,
    borderColor:"purple",
    width:"90%",
    height:"90%",
    borderRadius:10
  },
  textEdit1:{
    width:200,
    maxWidth:Dimensions.get('window').width * 0.70,
    borderColor:"black",
    borderWidth:1,
  },
  question1:{
    paddingTop:"8%",
    marginBottom:"8%",
    fontSize:18
  },
  question2:{
    paddingTop:"2.5%",
    marginBottom:"2.5%",
    fontSize:16
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(128,128,128,0.9)",
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModalStyle:{
    backgroundColor: "rgba(255, 99, 71, 0.9)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    //elevation: 5,
    width:200,
    maxWidth:Dimensions.get('window').width * 0.5,
    justifyContent:"center",
    alignItems:"center",
    marginTop:"8%"
  },
  buttonStyle: {
    backgroundColor: "rgba(128,128,128,0.75)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    //elevation: 5,
    width:200,
    maxWidth:Dimensions.get('window').width * 0.35,
    justifyContent:"center",
    alignItems:"center",
    marginTop:"8%"
  },
  mascot:{
    height: 125, 
    width:125,
    resizeMode:'contain',
    marginTop:"-10%",
    marginRight:"50%"
  },
  bubble:{
    height: 150, 
    width:175,
    resizeMode:'contain'
  },
  
});

export default PracticeScreen;