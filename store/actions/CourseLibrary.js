export const SET_LIBRARY = 'SET_LIBRARY';
export const UPDATE_LIBRARY = 'UPDATE_LIBRARY';

import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLibrary = () => {
  //setting LibraryState depending on AsyncStorage
    return async (dispatch) => {
        try {
            const CourseLibrary = await AsyncStorage.getItem('CourseLibrary');
            if(CourseLibrary == null) {// value previously stored
              console.log("Library empty!!");
              var emptylibrary = [];
              const jsonValue = JSON.stringify(emptylibrary);
              await AsyncStorage.setItem('CourseLibrary', jsonValue);
              dispatch({type: SET_LIBRARY, myLibrary: emptylibrary})
            }else{
              const parsedCourseLibrary = JSON.parse(CourseLibrary);
              console.log("here is your loaded array: " + JSON.stringify(parsedCourseLibrary));
              dispatch({type: SET_LIBRARY, myLibrary: parsedCourseLibrary})
            };
          } catch(e) {
            console.log(e);
          }
    }
};

export const updateLibrary = (updatedEntry) => {
  //receives one CourseData to update the Library
  return async (dispatch) => {
      try {
          const CourseLibrary = await AsyncStorage.getItem('CourseLibrary');
          const CourseLibraryObj = JSON.parse(CourseLibrary);
          const index = CourseLibraryObj.findIndex(obj => obj.courseID === updatedEntry.courseID);
          if (index !== -1) {

            CourseLibraryObj.splice(index, 1, {coursename: updatedEntry.coursename, courseID: updatedEntry.courseID, percentageDone: updatedEntry.percentageDone});
          }
          const jsonValue = JSON.stringify(CourseLibraryObj);
          await AsyncStorage.setItem('CourseLibrary', jsonValue);
          dispatch({type: UPDATE_LIBRARY, myLibrary: CourseLibraryObj})
        } catch(e) {
          console.log(e);
          console.log("DISPATCH WENT WRONG")
        }
  }
};