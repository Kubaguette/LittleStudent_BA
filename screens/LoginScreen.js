import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert, ImageBackground, TextInput, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as firebase from "firebase";

import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false); 
    const [valueMail, onChangeValueMail] = useState('');
    const [valuePassword, onChangeValuePassword] = useState('');
    const [error, setError] = useState();


    useEffect(() => {
        
        if(error){
            Alert.alert('An Error Occured while Login/Signup. Please check your connection!', error, [{text: 'Okay'}]);
            console.log(error)
        }
    }, [error]);

    const signup = async (email, password) => {
          const response = await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(async () => {
            return await firebase.auth().createUserWithEmailAndPassword(email, password).
            catch((error) => {
                console.log(error);
                throw new Error(error.message);
              })
            }).catch((error) => {
              // Handle Errors here.
              console.log(error.code);
              console.log(error.message);
          });
          if (response == undefined) {
            throw new Error('Something went wrong!');
          }
          console.log("Das ist die Resdata: ", response);
          saveDataToStorage(response.user.uid);
    };
    const login = async (email, password) => {
        const response = await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(async () => {
          return firebase.auth().signInWithEmailAndPassword(email, password).
          catch((error) => {
              console.log(error)
              throw new Error(error.message);
            })
          }).catch((error) => {
            // Handle Errors here.
            console.log(error.code);
            console.log(error.message);
        });
        if (response == undefined) {
            throw new Error('Something went wrong!');
        }
        console.log("Das ist die Resdata: ", response);
        saveDataToStorage(response.user.uid);
    }

    const authHandler = async (mail, password) =>{
        setError(null);
        setIsLoading(true);
        try{
            if(isSignup){
                await signup(mail, password);
            } else {
                await login(mail, password);
            };
            props.navigation.navigate('App');
        }catch(err){
            console.log("Error in loginscreen!")
            setError(err.message);
            setIsLoading(false);
        };
    };  

    const saveDataToStorage = (userId) => { //Always gets launched with signup and login 
        AsyncStorage.setItem('userData', JSON.stringify({ 
          userId: userId
        }))
      };
return (
    <View style={styles.container}>
      <ImageBackground source={require('../components/pictures/welcome.png')} style={styles.image}>
                <View style={styles.wrappingView}>
                    <BlurView style={styles.loginfield} intensity={150}>
                        <Text style={styles.welcometext}>This is the welcome text for the app!</Text>
                        <View style={{flexDirection:"row", paddingBottom: 10}}>
                            <Ionicons 
                                name="md-mail" 
                                size={24} 
                                color="black" 
                                style={{marginRight: 10, paddingTop: 2}}/>                    
                            <TextInput //updated Email State
                                id='email' 
                                label="E-Mail" 
                                style={styles.input}
                                autoCapitalize= "none"
                                defaultValue= {valueMail}
                                autoCorrect= {false}
                                onChangeText={valueMail => onChangeValueMail(valueMail)}
                            />
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Ionicons 
                                name="md-key" 
                                size={24} 
                                color="black" 
                                style={{marginRight: 10, paddingTop: 2}}/>                    
                            <TextInput //updates Password State
                                id='password' 
                                label="password" 
                                style={styles.input}
                                autoCapitalize= "none"
                                defaultValue={valuePassword}
                                autoCorrect= {false}
                                secureTextEntry={true}
                                onChangeText={valuePassword => onChangeValuePassword(valuePassword)}
                            />
                        </View> 
                    </BlurView>
                    <View style={styles.bottomfield}>
                        <Text style={styles.bottomtext}>
                            This is a prototype application.{"\n"}
                            Use as email: kuba@kuba.kuba{"\n"}
                            Use as password: kubakuba
                        </Text>
                    </View>
                    <View style={styles.buttonView}>
                        {isLoading ? (
                        <ActivityIndicator size='small' color="red"/>
                        ) : (
                        <Button 
                            style={styles.button} 
                            title={isSignup ? "Signup" : "Login"}
                            onPress={() => authHandler(valueMail, valuePassword)}
                            />)
                        }
                        <Button 
                            style={styles.button} 
                            title={isSignup ? "Switch to Login" : "Switch to Signup"}
                            onPress={() => {
                                setIsSignup(prevState => !prevState);
                            }}
                            />
                    </View>
                </View>
            </ImageBackground>
    </View>
    );
  
}

const styles = StyleSheet.create({
    image:{
        width: "100%",
        height: "100%",
    },
    wrappingView:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button:{
        //Ab hier Einstellungen zum Schatten
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6,
        elevation: 3.5,
        
    },
    buttonView:{
        flexDirection:"row",
        justifyContent: "space-between",
        width: "70%",
        
    },
    welcometext:{
        paddingBottom: 20,
        width:"80%",
        fontSize: 20,
        alignSelf:"center"
    },
    input:{
        fontSize: 20,
        justifyContent: "space-between",
        width: "70%",
        borderBottomWidth: 1,
        borderBottomColor: "black",
        
    },
    screen:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loginfield:{
        flex: 0.45,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "black",
        borderRadius: 10,
        width: "80%",
        height: "30%",

        //Ab hier Einstellungen zum Schatten
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6,
        elevation: 3.5,
    },
    bottomfield:{
        width: "75%",
        height: "30%",
    },
    bottomtext:{
        marginTop: 30,
        textAlign: "center",
        fontSize: 16,
        alignSelf:"center",

        
    }
});

export default LoginScreen;
