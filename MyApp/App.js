import 'react-native-gesture-handler'

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { createContext, useState } from 'react';
import {
  StatusBar,
  StyleSheet
} from 'react-native';
import SplashScreen from './Components/SplashScreen';
import Login from './Components/Login'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import SignUp from './Components/SignUp';
import DrawerLayout from './Components/DrawerLayout';
import CreateNewGroup from './Components/CreateNewGroup';

const Stack = createNativeStackNavigator()

const UserInfo = createContext(null)

const App = ()=>{
  const [name,setName] = useState("User")
  const [userType,setUserType] = useState("Student");
  const [userGroupInfo,setUserGroupInfo] = useState(new Set())

  const userInfoContext = {
    name,
    setName,
    userType,
    setUserType,
    userGroupInfo,
    setUserGroupInfo,
    
  }

  return (
    <UserInfo.Provider value= {userInfoContext}>
      <NavigationContainer>
        <StatusBar barStyle={'light-content'} backgroundColor={'dodgerblue'}></StatusBar>

        
        <Stack.Navigator screenOptions={{animation:'fade',animationDuration:500,gestureEnabled:true}} initialRouteName='SplashScreen'>
          <Stack.Screen name='SplashScreen' component={SplashScreen} options={{headerShown:false}}></Stack.Screen>
          
          <Stack.Screen name='Login' component={Login} uName={name.toString()} options={{headerShown:false}} ></Stack.Screen>

          <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false}}></Stack.Screen>

          <Stack.Screen name='HomeDrawer' component={DrawerLayout} options={{headerShown : false}} ></Stack.Screen>

          
        </Stack.Navigator>
      </NavigationContainer>
      </UserInfo.Provider>         

  )
}
 
const headerStyle = StyleSheet.create(
  {
    color:{
      color:'red',
      backgroundColor : 'white'
    }
  }
)
export default App
export {UserInfo}
