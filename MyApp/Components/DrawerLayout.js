import React, {  } from "react";
import {createDrawerNavigator} from '@react-navigation/drawer'
import Home from "./Home";
import SignUp from "./SignUp";
import DrawerContent from "./DrawerContent";
import BottomLayout from "./BottomLayout";
import Header from "./Header";
import CreateNewGroup from "./CreateNewGroup";
import SearchGroup from "./SearchGroup";
import InAttendance from "./InAttendance";
const DrawerLayout = ()=>{
    const Drawer = createDrawerNavigator()
    return(
        <Drawer.Navigator screenOptions={{headerShown:false}}
            drawerContent={(props)=><DrawerContent {...props}/>}
        >
            
        <Drawer.Screen component={BottomLayout} name="BottomLayout" options={{headerShown:false}}></Drawer.Screen>
        <Drawer.Screen component={SignUp} name="SignUp"></Drawer.Screen>

        <Drawer.Screen component={Header} name="Header"></Drawer.Screen>

        <Drawer.Screen name='CreateNewGroup' component={CreateNewGroup}></Drawer.Screen>

        <Drawer.Screen name="SearchGroup" component={SearchGroup}></Drawer.Screen>
            
        <Drawer.Screen name="InAttendance" component={InAttendance}></Drawer.Screen>    
        </Drawer.Navigator>
    )
}

export default DrawerLayout