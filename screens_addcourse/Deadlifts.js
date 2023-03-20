import { StatusBar } from 'expo-status-bar';
import React, {useState, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, Button} from 'react-native';
import ALLTEXTFILES from '../informations/Textfiles';
import { Video } from 'expo-av';

const Deadlifts = props => {
  const video = useRef(null);
  const [status, setStatus] = useState({});
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
  
});

export default Deadlifts;