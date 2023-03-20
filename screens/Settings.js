import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback} from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, Dimensions, TouchableOpacity, Modal, Linking, Image} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Flag from 'react-native-flags';
import * as SpecialActions from "../store/actions/SpecialActions";
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = props => {
  const dispatch = useDispatch();
  const currentVoice = useSelector(state => state.myOtherReducers.currentVoice);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModalState, setCurrentModalState] = useState("voiceChange");

  const setLanguage = (language) => {
    switch(language){
      case "ENGLISH":
        dispatch(SpecialActions.setVoiceLanguage("en-GB"));
        Tts.speak("Little Student will speak from now on with an english pronunciation.", {
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });
        changeLanguageInStorage("en-GB");
        break;
      case "GERMAN":
        dispatch(SpecialActions.setVoiceLanguage("de-DE"));
        Tts.speak("Der kleine Student wird mit dir ab jetzt in deutscher Aussprache sprechen.", {
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });
        changeLanguageInStorage("de-DE");
        break;
      default:
        dispatch(SpecialActions.setVoiceLanguage("en-GB"));
        console.log("DEFAULT TO ENGLISH!!!!")
        break;
    }
  };

  const changeLanguageInStorage = async(languageCode) => {
    try{
      await AsyncStorage.setItem('currentVoiceLanguage', languageCode);
    }catch(e){
      console.log(e)
    }
  }

  return (
    <ImageBackground style={styles.container} source={require("../components/pictures/wood.jpg")}>
      <ScrollView>
        <TouchableOpacity onPress={() => {
          setCurrentModalState("voiceChange");
          setModalVisible(true)
        }}>
          <View style={styles.innerTouch}>
            <Text style={styles.touchText}>Change voice output language</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setCurrentModalState("credits");
          setModalVisible(true)
        }}>
          <View style={styles.innerTouch}>
            <Text style={styles.touchText}>Credits</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        {(() => {
          switch (currentModalState) {
            case 'voiceChange':
              return (
                <View style={styles.modalView}>
                  <View style={styles.modalTitle}>
                    <Text style={{textAlign:"center", fontSize:20}}>
                      All available voices:
                    </Text>
                  </View>
                  <View style={styles.modalBody}>
                    <TouchableOpacity style={styles.modalElement} onPress={() => {setLanguage("ENGLISH")}}>
                      <Text>English</Text>
                      <Flag
                        code="GB"
                        size={32}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalElement} onPress={() => {setLanguage("GERMAN")}}>
                      <Text>German</Text>
                      <Flag
                        code="DE"
                        size={32}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalEnding}>
                    <TouchableOpacity
                      style={styles.buttonModalStyle}
                      onPress={() => {
                        setModalVisible(false)
                      }}
                    >
                      <Text>Press to close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            case 'credits':
              return (
                <View style={styles.modalView}>
                  <View style={styles.modalTitle}>
                    <Text style={{textAlign:"center", fontSize:20}}>
                      Credits
                    </Text>
                  </View>
                  <View style={styles.modalBody}>
                    <View style={{...styles.modalElement, backgroundColor:"transparent"}}>
                      <Text style={{textAlign:"center"}}>LittleStudent developed by Jakub Pietraszko a.k.a. JJP Apps.</Text>
                    </View>
                    <View style={{...styles.modalElement, backgroundColor:"transparent"}} onPress={() => {Linking.openURL("https://www.instagram.com/art_of_kaska")}}>
                      <Text style={{textAlign:"center"}}>LittleStudents mascot was drawn by {"\n"}@art_of_kaska.{"\n"}Click on the LittleProfessor to check out her work!</Text>
                    </View>
                    <TouchableOpacity style={{...styles.modalElement, backgroundColor:"transparent", paddingTop:"10%"}} onPress={() => {Linking.openURL("https://www.instagram.com/art_of_kaska")}}>
                      <Image source={require("../components/pictures/littlestudent-icon.png")} style={{alignSelf:"center", resizeMode:"contain", width:150, height:150}}/>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalEnding}>
                  <TouchableOpacity
                    style={styles.buttonModalStyle}
                    onPress={() => {
                      setModalVisible(false)
                    }}
                  >
                    <Text>Press to close</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              );
            default:
              return (
              <View style={styles.modalView}>
                <Text> Default text </Text>
              </View>
              );
          }
        })()}
      </View>
    </Modal>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerTouch:{
    width: (Dimensions.get('window').width)*9.5/10,
    height: (Dimensions.get('window').height)*1/10,
    backgroundColor: "rgba(128,128,128,0.35)",
    justifyContent:"center",
    marginTop:"5%",
    borderRadius:15
  },
  touchText:{
    fontSize:20,
    color:"tomato",
    fontWeight:"500",
    paddingLeft:"5%"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: (Dimensions.get('window').width)*8/10,
    height: (Dimensions.get('window').height)*8/10,
    margin: 20,
    backgroundColor: "rgba(128,128,128,0.95)",
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
  modalTitle:{
    height:"10%",
    width:"100%"
  },
  modalBody:{
    height:"75%",
    width:"100%"
  },
  modalEnding:{
    height:"15%",
    width:"100%"
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
    alignSelf:"center",
    marginTop:"8%"
  },
  modalElement:{
    justifyContent:"space-evenly", 
    alignItems:"center",
    flexDirection:"row", 
    backgroundColor:"rgba(200,200,200,0.5)", 
    borderRadius:15,
    marginBottom:10
  }

});

export default SettingsScreen;
