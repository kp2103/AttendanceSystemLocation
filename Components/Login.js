import LottieView from "lottie-react-native";
import React, { useState,useContext, useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, View,ToastAndroid } from "react-native";
import { Button, Text, TextInput ,RadioButton ,ToggleButton,SegmentedButtons} from 'react-native-paper'
import UserData from "../FireBaseData/UserData";
import {UserInfo} from '../App'
import Toggle from 'react-native-toggle-element'
import Colors from "../Color/Colors";
import LoadingComponent from "./Loading";
const Login = (props)=>{
    const [uid,setUid] = useState("")
    const [upass,setUpass] = useState("")
    const [userType,setUserType] = useState('Student')
    const [toggleValue,setToggleValue] = useState(false)
    const UInfo = useContext(UserInfo)
    // const [isclicked,setIsClicked] = useState(false)
    const [animationSource,setAnimationSource] = useState(require('../LottieAnimations/login.json'))
    
    const changeUserName = useCallback((value)=>{setUid(value)},[uid])
    const changeUSerPassword = useCallback((value)=>{setUpass(value)},[upass])
    const chnageUserType = useCallback((value)=>{setUserType(value)},[userType])

    async function onBtnClick()
    {
        console.log("Checking")
        let response = await UserData(uid)
        if(uid=="" || upass=="")
        {
            ToastAndroid.show("Enter userid or password",ToastAndroid.SHORT)
            console.warn("Enter userid or password")
        }
        else if(response.exists)
        {
            if((await response.get('password')).toString()==upass && (await response.get('type').toString()==userType))
            {
                ToastAndroid.show("Successfull",ToastAndroid.SHORT)
                console.log("Successfull")
                UInfo.setName(uid)
                UInfo.setUserType(userType)
                
                props.navigation.replace('HomeDrawer')
            }
            else{
                ToastAndroid.show("userid or password is invalid",ToastAndroid.SHORT)
                console.warn("userid or password is invalid")
            }
        }
        else{
            ToastAndroid.show("User does not exist",ToastAndroid.SHORT)
            console.warn("User does not exist")
        }
    }
    

        return(

            
        <View style={style.mainContainer}>
          {/* <ScrollView contentContainerStyle={{flexGrow:1}} scrollEnabled={true} nestedScrollEnabled={true} > */}
    
            <View style={style.lottieStyle}>
                <LottieView
                    style = {{height:'80%'}}
                    autoPlay
                    loop
                    source={animationSource}
                ></LottieView>
                {/* : <LoadingComponent></LoadingComponent>} */}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{fontSize : 35,textAlign:"center",marginBottom:20}}>{UserInfo.name}</Text>

            <TextInput style={style.inpytTextStyle} mode="outlined" label="Name" activeOutlineColor="dodgerblue"  
            left={<TextInput.Icon icon={'home'}/>}
            onChangeText={(value)=>{
                // setUid(value)
                changeUserName(value)
            }}  
            
            ></TextInput>
                
            <TextInput mode="outlined" label="Password" activeOutlineColor="dodgerblue" secureTextEntry 
            right={<TextInput.Icon icon={'eye'} />}
            onChangeText={(value)=>{
                // setUpass(value)
                changeUSerPassword(value)
            }}
            ></TextInput>
                
            <Text 
                onPress={()=>{
                    props.navigation.replace('SignUp')
                }}
                style={{marginTop : 20,fontSize : 20,color:"dodgerblue"}}>Create An New Account
            </Text>
            <View style={{display:"flex",alignItems:'center'}}>

                {/* <RadioButton.Group onValueChange={(value)=>{setUserType(value)}} value={userType}>
                    <RadioButton.Item color={Colors.purple} labelStyle={{color:'dodgerblue',fontSize:20}} label="Student" value="Student" status={userType=='Student'?"checked":"unchecked"}></RadioButton.Item>
                    
                    <RadioButton.Item  color={Colors.purple} labelStyle={{color:'dodgerblue',fontSize:20}} label="Faculty" value="Faculty"
                        status={userType=='Faculty'?"checked":"unchecked"}
                    ></RadioButton.Item>
                </RadioButton.Group> */}
                {/* <ToggleButton.Row onValueChange={(value)=>{setUserType(value) 
                    console.warn(userType)}}>
                    <ToggleButton value="Student">Student</ToggleButton>
                    <ToggleButton value="Faculty"></ToggleButton>
                </ToggleButton.Row> */}
                <Toggle  
                containerStyle={{marginTop:10}}
                        leftTitle={"Student"}
                        rightTitle={"Faculty"}
                        value = {false}
                        animationDuration={350}
                        trackBarStyle={{backgroundColor:'dodgerblue'}}
                        thumbButton={{width:80,inActiveColor:'white',activeColor:'white',inActiveBackgroundColor:'white',activeBackgroundColor:'white'}}
                        thumbStyle={{backgroundColor:Colors.purple}}  
                        onPress={(value)=>{
                            userType=='Student' ? chnageUserType('Faculty') : chnageUserType('Student')
                        // setToggleValue(value)
                        // console.log(value + " " + toggleValue + " "  +userType)
                    }}
                    ></Toggle>    
                    

                    {/* <SegmentedButtons
                        multiSelect={false}
                        value={userType}
                        style={{width:'70%'}}
                        onValueChange={(value)=>{setUserType(value)}}
                        buttons={[
                            {
                                label : 'Student',
                                value : 'Student',
                                style : userType=='Student'? {backgroundColor:Colors.purple} : {backgroundColor:'white'},
                                checkedColor : userType=='Student'? 'white' : 'black'
                            },
                            {
                                label : 'Faculty',
                                value : 'Faculty',                                
                                style : userType=='Faculty'? {backgroundColor:Colors.purple} : {backgroundColor:'white'},
                                checkedColor : userType=='Student'? 'white' : 'black'
                            }
                        ]}
                    ></SegmentedButtons>  */}
            </View>
            <Pressable>
                <Button onPress={()=>{
                        setAnimationSource(require('../LottieAnimations/loading.json'))
                        onBtnClick()
                        console.log(userType)
                    }} 
                    mode="contained" buttonColor="dodgerblue" textColor="white" style={{marginTop:20,marginBottom:20}}>Go to Home</Button>
            </Pressable>
            </ScrollView>
         {/* </ScrollView> */}
        </View>

    )
}

const style = StyleSheet.create({
    mainContainer : {
        paddingLeft : 30,
        paddingRight : 30,
        flex:1,
        height : '100%'
    },
    lottieStyle :
    {
        height : '50%',
        width : undefined,
    },
    inpytTextStyle : {
        borderRadius : 5,
        marginBottom : 5
    }
})

export default Login
