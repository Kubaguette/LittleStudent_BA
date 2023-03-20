import { StatusBar } from 'expo-status-bar';
import React, {useState, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, Button} from 'react-native';
import ALLTEXTFILES from '../informations/Textfiles';


const Squats = props => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.ScrollView}>
        
      </ScrollView>
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
  ScrollView:{
    width:Dimensions.get('window').width,
    height:(Dimensions.get('window').height)*2
  },
  title:{
    alignSelf:"center",
    fontSize:20,
    marginTop:"5%"
  },
  usualtext:{
    alignSelf:"center",
    fontSize:16,
    marginTop:"5%",
    marginBottom:"3%",
    width: "90%"
  },
  usualtext2:{
    alignSelf:"center",
    fontSize:16,
    fontWeight:"bold",
    marginTop:"5%",
    marginBottom:"3%",
    width: "90%"
  },
  picture:{
    resizeMode:"contain",
    height:(Dimensions.get('window').height)*0.25,
    alignSelf:"center",
    marginTop:"5%"
  },
});

export default Squats;