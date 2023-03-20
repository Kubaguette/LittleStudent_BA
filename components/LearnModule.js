import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LearnModule = props => {
  console.log("my progress so far: ", props.progress)
  const onPress = async () => {
    try{
      const decryptedvalue = (props.keyforprops).toString();
      await AsyncStorage.getItem(decryptedvalue).then(oneCourseJSON =>{
        const decryptedOneCourse = JSON.parse(oneCourseJSON);
        console.log(decryptedOneCourse)
        props.navigation.navigate({name:'CourseMenu', params:{
          mycourse: decryptedOneCourse
      }});
      })
    }catch(e){
      console.log(e)
    }
  };

  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => onPress()}>
        <Text style={{marginLeft:10, fontSize:16, fontWeight:"500"}}>{props.modulename}</Text>
        <Progress.Circle size={65} indeterminateAnimationDuration={100} progress={props.progress} formatText={()=>{return (Math.round(props.progress * 100) + "%")}} thickness={10} color='tomato' showsText={true} style={{marginRight:10}}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    wrapper:{
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"space-between",
    backgroundColor:"rgba(128, 128, 128, 0.75)",
    width:"85%",
    height:(Dimensions.get('window').height)/6, 
    marginTop:20,
    borderRadius:25
  }
});

export default LearnModule;
