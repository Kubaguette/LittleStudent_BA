import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Button, ImageBackground} from 'react-native';


//screen for displaying course statistics and progress made
const CourseStatistics = props => {
  useEffect(() => {//setting Options for the CourseMenu-Screen
    props.navigation.setOptions({ 
      headerTitle:props.route.params.mycourse.coursename + " - Statistics"
    })
  }, []);

  console.log(props.route.params.mycourse)

  return (
    <ImageBackground style={styles.container} source={require("../components/pictures/wood.jpg")}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text>COURSE STATS</Text>
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
  }
});

export default CourseStatistics;