import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Dimensions} from 'react-native';
import ALLTEXTFILES from '../informations/Textfiles';

const Benefits = props => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
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
  }
});

export default Benefits;