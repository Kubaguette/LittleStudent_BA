import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
//Screens Imports
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/Settings';
import LoginScreen from '../screens/LoginScreen';
import StartupScreen from './StartupScreen';
import FilterResults from '../screens/FilterResults';
import EditCourse from '../screens/EditCourse';
import PracticeScreen from '../screens_practice/PracticeScreen';
import AddCourse from '../screens/AddCourse';
import CourseMenu from '../screens_practice/CourseMenu';
import CourseStatistics from '../screens_practice/CourseStatistics';
import RemoveCards from '../screens/RemoveCards';

//Icons
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
//special modules to generate dynamic number of screens
import { useSelector, useDispatch } from 'react-redux';
import * as SpecialActions from "../store/actions/SpecialActions";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const EditCourseNavigator = props => {
  const dispatch = useDispatch();
  //load data here from async storage
  var test = "kuba is a genius";
  var DATA = ["1","2","3"];
  //load data from redux state 
  const myLibrary = useSelector(state => state.myLibrary.myLibrary);
  const tabAllowed = useSelector(state => state.myOtherReducers.showBottomTab);
  return(
    <Drawer.Navigator
    screenOptions={{
      headerShown:true,
      headerBackground: () => (
        <Image
        style={{flex:1}}
        resizeMode="stretch"
        source={require("../components/pictures/greywood.jpg")}
        />
      ),
      drawerActiveTintColor:"tomato",
      drawerActiveBackgroundColor:"rgba(128,128,128,0.5)",
      drawerInactiveTintColor:"rgba(200,200,200,1)"
    }}
    drawerContent={(props) => {
      return (
        <ImageBackground
          style={{flex:1}}
          resizeMode="stretch"
          source={require("../components/pictures/greywood.jpg")}
        >
          <View style={{height:25}}/>
          <DrawerItemList {...props}/>
        </ImageBackground>
      );
    }}
    >
      {((myLibrary.length > 0)) ? (
          myLibrary.map(item => (
            <Drawer.Screen 
            name={item.coursename} 
            key={item.courseID} 
            component={EditCourse} 
            initialParams={{
              coursekey: item.courseID,
              coursename: item.coursename
            }}
            options={({ navigation }) => ({
              headerTitleStyle:{color:"tomato"},
              headerLeft: () => {return(
                <TouchableOpacity onPress={() => {
                  navigation.toggleDrawer()
                }}>
                  <AntDesign name="bars" size={24} color="tomato" style={{paddingLeft:10}}/>
                </TouchableOpacity>
              )},
            })}
            />
          ))
        ) : (
          <Drawer.Screen 
          name={"No course added yet"} 
          component={EditCourse} 
          key={0} 
          initialParams={{
            coursekey: 1,
            coursename: "No course added yet"
          }}
          options={{headerTitleStyle:{color:"tomato"}, drawerItemStyle: { height: 0 }}}
          />
        )
      }
      <Drawer.Screen 
        name={"Remove Cards"} 
        key={11111111111111} 
        component={RemoveCards} 
        options={({ navigation }) => ({
          drawerItemStyle: { height: 0},
          headerTitleStyle:{color:"tomato"},
          swipeEnabled:false,
          headerLeft: () => {return(
            <TouchableOpacity onPress={() => {
              //dispatch state botttom 
              dispatch(SpecialActions.setBottomTabVisibility("flex"));
              navigation.goBack();
            }}>
              <AntDesign name="caretleft" size={24} color="tomato" style={{paddingLeft:10}}/>
            </TouchableOpacity>
          )},
        })}
      />
    </Drawer.Navigator>
  )
};

const CoursePractice = props => {
  return (
      <Stack.Navigator
        screenOptions={{
          headerBackground: () => (
            <Image
            style={{flex:1}}
            resizeMode="stretch"
            source={require("../components/pictures/greywood.jpg")}
            />
          ),
        }}
      >
        <Stack.Screen //Homescreen with all courses displayed
        name="Home Screen" 
        component={HomeScreen} 
        options={{headerShown:true,headerTitle:"Little Student", headerStyle:{borderBottomWidth:0.5, borderBottomColor:"black"}, headerTitleStyle:{color:"tomato"}}}
        />
        <Stack.Screen //displaying one single course
        name="CourseMenu" 
        component={CourseMenu} 
        options={{headerShown:true, headerStyle:{borderBottomWidth:0.5, borderBottomColor:"black"}, headerTitleStyle:{color:"tomato"}}}
        />
        <Stack.Screen //displaying statistics about the specific course
        name="CourseStatistics" 
        component={CourseStatistics} 
        options={{headerShown:true, headerStyle:{borderBottomWidth:0.5, borderBottomColor:"black", headerTitleStyle:{color:"tomato"}}}}
        />
        <Stack.Screen //Practicing a course happens here
        name="PracticeScreen" 
        component={PracticeScreen} 
        //options terminated here, look in file directly
        />
      </Stack.Navigator>
  );
}

const AppNavigator = props => {
  const tabAllowed = useSelector(state => state.myOtherReducers.showBottomTab);
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home'){
                iconName = focused ? 'md-home': 'md-home';
                return <Ionicons name={iconName} size={size} color={color}/>;
            } else if (route.name === 'Edit Course') {
                iconName = focused ? 'fitness-center' : 'fitness-center';
                return <AntDesign name="edit" size={size} color={color}/>
            } else if (route.name === 'Settings') {
                iconName = focused ? 'ios-settings' : 'md-settings';
                return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Add Course') {
              iconName = focused ? 'ios-book' : 'ios-book';
              return <AntDesign name="addfile" size={size} color={color} />
            }
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'tomato',
          tabBarActiveBackgroundColor: "#rgba(128, 128, 128, 0.65)",
          tabBarInactiveBackgroundColor: "#rgba(128, 128, 128, 0.15)",
          tabBarBackground:() => {
            return(<Image
              style={{flex:1}}
              resizeMode="stretch"
              source={require("../components/pictures/greywood.jpg")}
            />)
          },
          headerBackground: () => (
            <Image
            style={{flex:1}}
            resizeMode="stretch"
            source={require("../components/pictures/greywood.jpg")}
            />
          ),
        })
      }
        
    >
      <Tab.Screen name="Home" component={CoursePractice} options={{headerShown:false, tabBarStyle:{display:tabAllowed, borderTopWidth:1, borderTopColor:"black"}}}/>
      <Tab.Screen name="Edit Course" component={EditCourseNavigator} options={{headerShown:false, tabBarStyle:{display:tabAllowed,borderTopWidth:1, borderTopColor:"black"}}}/>
      <Tab.Screen name="Add Course" component={AddCourse} options={{headerShown:true, tabBarStyle:{borderTopWidth:1, borderTopColor:"black"}, headerTitleStyle:{color:"tomato"}}}/>
      <Tab.Screen name="Settings" component={SettingsScreen} options={{headerShown:true, tabBarStyle:{ borderTopWidth:1, borderTopColor:"black"}, headerTitleStyle:{color:"tomato"}}}/>
    </Tab.Navigator>
  );
};

const PreNavigator = props => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen //auto login screen
        name="Startup" 
        component={StartupScreen} 
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name="Login" //Login Screen
        component={LoginScreen} 
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name="App"  //The Main App
        component={AppNavigator} 
        options={{headerShown:false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default PreNavigator;

