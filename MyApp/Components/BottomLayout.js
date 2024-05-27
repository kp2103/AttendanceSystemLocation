import React from "react";
import { Animated, Easing, Image, StyleSheet } from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import GroupSection from "./GroupSection";
import Home from "./Home";
import Colors from '../Color/Colors'
import ScheduleSection from "./ScheduleSection";
import ReportSection from "./ReportSection";
import Header from "./Header";
import * as  Animatable from 'react-native-animatable'
const Bottom = createBottomTabNavigator()

const BottomLayout = (props)=>{
    return(
        <Bottom.Navigator  screenOptions={{tabBarStyle:styleSheet.tabBarStyle,tabBarShowLabel:false, freezeOnBlur:true,header:()=><Header {...props}></Header>}} >
            <Bottom.Screen 
                options={{unmountOnBlur:true,tabBarIcon:({focused})=>{
                return (
                    <Image source={require('../Images/icons8-home-48.png')} style={focused ? styleSheet.iconstyleFocused : styleSheet.iconstyleUnFocused}></Image>
                )
            }}} name="Home" component={Home}></Bottom.Screen>
            
            <Bottom.Screen  name="GroupSection" component={GroupSection} options={{unmountOnBlur:false,tabBarIcon : ({focused})=>{
                return (
                    <Animatable.Image animation={focused ? 'zoomInUp' : 'fadeIn'}  source={require('../Images/icons8-group-48.png')} style={focused ? styleSheet.iconstyleFocused : styleSheet.iconstyleUnFocused}></Animatable.Image>)
                }}}></Bottom.Screen>
            
            <Bottom.Screen name="ScheduleSection" component={ScheduleSection} options={{unmountOnBlur:false,tabBarIcon : ({focused})=>{
                return(<Image source={require('../Images/icons8-schedule-48.png')} style={focused ? styleSheet.iconstyleFocused : styleSheet.iconstyleUnFocused}></Image>)
            }}}></Bottom.Screen>
            
            <Bottom.Screen name="ReportSection" component={ReportSection} options={{tabBarIcon:({focused})=>{
                return (
                    <Image source={require('../Images/icons8-report-48.png')} style={focused ? styleSheet.iconstyleFocused : styleSheet.iconstyleUnFocused}></Image>
                )

                }}}></Bottom.Screen>

        </Bottom.Navigator>
    )
}

const styleSheet = StyleSheet.create({
    iconstyleUnFocused : {
        height : 30,
        width  : 30,
        
    },
    iconstyleFocused :{
        height : 43,
        width  : 43,
    },
    tabBarStyle : {
        position : "absolute",
        marginBottom : 10,
        marginRight : 20,
        marginLeft : 20,
        borderRadius  : 40,
        height : 60,

    }
})

export default BottomLayout

export  {styleSheet as tabBarStyle}