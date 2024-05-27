import React, {useContext, useEffect, useState } from "react";
import {StyleSheet,PermissionsAndroid, Text, View,ScrollView, Image} from 'react-native';
import {UserInfo} from '../App'
import firestore from '@react-native-firebase/firestore'
import { Avatar, Button, Card } from "react-native-paper";
import Icons from "../Icons/icons";
import * as Animatable from 'react-native-animatable'
// import WifiManager from 'react-native-wifi-reborn'
// import SignUp from "./SignUp";
// import DrawerContent from './DrawerContent'
// import DrawerLayout from "./DrawerLayout";
// import Animated from "react-native-reanimated";
// import BottomLayout from "./BottomLayout";
// import { Icon } from "react-native-vector-icons/Icon";
// import UserData from "../FireBaseData/UserData";
const Home = (props)=>{
    const context = useContext(UserInfo)
    const [isRender,setIsRender] = useState(false)

    async function permission(){
        const fineLocationGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,{
            message : 'This app needs a location for accessing some basic detail of connected wifi',
            title : 'Location permission is required for accessing basic info of connected wifi',
            buttonPositive : 'Allow',
            buttonNegative : 'Deny'
        })

        const backgroundLocation = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,{
            message : 'This app needs a location for accessing some basic detail of connected wifi',
            title : 'Location permission is required for accessing basic info of connected wifi',
            buttonPositive : 'Allow',
            buttonNegative : 'Deny'
        })


        const locationGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
            message : 'Location permission',
            title  : 'Location Permission',
            buttonPositive : 'Allow',
            buttonNegative : 'Deny'
        })
        if(fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED && locationGranted === PermissionsAndroid.RESULTS.GRANTED && backgroundLocation === PermissionsAndroid.RESULTS.GRANTED)
        {
            console.log('permission is granted')
        }
    }

    useEffect(()=>{
        permission()
    },[])

    useEffect(()=>{
        if(!isRender)
        {
            context.userGroupInfo.clear()
            let response = firestore().collection('UserInfo').doc(context.name).collection('GroupInfo').onSnapshot((res)=>{
                res.forEach((documentSnapshot)=>{
                    context.userGroupInfo.add(documentSnapshot.data())
                })
                setIsRender(true)
                console.info(context.userGroupInfo.size)
            })
        }
    },[isRender])
    

    const img = Icons.home
    return(
        <Animatable.View  duration={700}>
        <View style={{backgroundColor:'white',flex:1}}>
            <View style={style.avtarText}>
                
            </View>
                
            <View style={{position:"absolute",width:'80%',alignSelf:"center"}}>
                <Card mode="elevated" style={{backgroundColor:'transparent',alignItems:"center",marginTop:'25%'}}>
                    <Card.Title title="User Info"></Card.Title> 

                    <Card.Content style={{}}>
                        <Avatar.Text label={context.name.toUpperCase().charAt(0)} color="white" style={{backgroundColor:'dodgerblue'}}></Avatar.Text>
                        <Text style={{fontSize:25,justifyContent:"center"}}>{context.name.toString()}</Text>
                    </Card.Content>
                </Card>
            </View>
            
            
            <View style={{position:"relative"}}>
                <Text style={{fontSize:25,marginTop:'30%'}}>{context.name}</Text>
                <Button mode="contained-tonal" onPress={()=>{
                    props.navigation.openDrawer()
                }} >Open Drawer</Button>
            </View>
        </View>
        </Animatable.View>
    )  
}
const style = StyleSheet.create({
    imageStyle : {
        height : 'auto',
        width : undefined,
        aspectRatio : 1,
        borderRadius : 20,
        marginTop : 20,
        marginRight : 20,
        display : 'flex',
        alignItems : 'stretch',
    },
    avtarText:{
        marginLeft:0,
        marginTop : 10,
        backgroundColor:'#7cc',
        height : '25%',
        borderBottomRightRadius : 50,
        borderBottomLeftRadius : 50
    },
    textStyle : {
        fontSize : 33,
        color : 'black',
        marginTop : 50
    }
})
export default Home;