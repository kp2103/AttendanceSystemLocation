import LottieView from 'lottie-react-native';
import React, { useCallback, useContext, useState } from 'react';
import { UserInfo } from '../App';
import {ScrollView, StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore'
import Colors from '../Color/Colors';
import Toggle from 'react-native-toggle-element'
const SignUp = (props)=>{
    const context = useContext(UserInfo)
    const [fname,setFname] = useState("")
    const [lname,setLname] = useState("")
    const [email,setEmial] = useState("")
    const [uId,setUid] = useState("")
    const [pass,setPass] = useState("")
    const [cpass,setCpass] = useState("")
    const [userType,setUserType] = useState("Student")
    const [user,setUser] = useState({
        fname : "",
        lname : "",
        mail : "",
        password : "", 
        userId : "",
        type : ""
    })

    const changeUserFname = useCallback((value)=>{setFname(value)},[fname])
    const changeUserLname = useCallback((value)=>{setLnamename(value)},[lname])
    const changeUserMail = useCallback((value)=>{setEmial(value)},[email])
    const changeUserId = useCallback((value)=>{setUid(value)},[uId])
    const changePass = useCallback((value)=>{setPass(value)},[pass])
    const changeCpass = useCallback((value)=>{setCpass(value)},[cpass])
    const changeType = useCallback((value)=>{setUserType(value)},[userType])

    async function signUp()
    {
        if(fname=="" || lname=="" || email=="" || pass=="" || cpass=="")
        {
            console.warn('Plaese Enter all information properly')
        }
        else{
            const database = firestore().collection('UserInfo').doc(uId)
            const ifUserExists = await (database.get()).exists
            if(pass!=cpass)
            {
                console.warn('Password missmatch')
            }
            else if(ifUserExists)
            {
                console.warn('User Id already exist')
            }
            else{
                
                // setUser({
                //     fname  : fname,
                //     lname  : lname,
                //     mail   : email,
                //     password : pass,
                //     userId  : uId
                // })

                // setUser({
                //     fname : fname,
                //     lname:lname,
                //     mail:email,
                //     password : pass,
                //     userId : uId,
                // })
                user.fname = fname
                user.lname = lname
                user.userId = uId
                user.mail = email
                user.password = pass
                user.type = userType
                console.log(user)
                await(database.set(user)).then((value)=>{
                                            context.setName(uId)
                                            context.setUserType(userType)
                                            props.navigation.replace('HomeDrawer')
                                      })
            }
        }
    }

    // function craete()
    // {
    //     firestore().collection('UserInfo').doc().set()
    // }

    return(
        <View style={{flex:1,paddingLeft:30,paddingRight:30}}>
        
        <ScrollView  contentContainerStyle={{flex:1}} scrollEnabled={true} nestedScrollEnable={true}>
    
        <View style={style.mianContainer}>
        
            <View style={style.lottieView}>
                <LottieView
                    style={{height:'93%',backgroundColor:'transparent'}}
                    loop
                    autoPlay
                    source={require('../LottieAnimations/welcome3.json')}
                ></LottieView>
            </View>

            <View style={{flex:1,marginBottom : 10}}>
                <ScrollView contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false}>
                <TextInput
                    inputMode='text' style={style.textInput}
                    onChangeText={(value)=>{changeUserFname(value)}}
                    mode='outlined' label={"First Name"} activeOutlineColor='dodgerblue' 
                    outlineStyle={{borderRadius : 10}}
                    
                ></TextInput>
                
                <TextInput
                    inputMode='text' style={style.textInput}
                    onChangeText={(value)=>{changeUserLname(value)}}
                    mode='outlined' label={"Last Name"} activeOutlineColor='dodgerblue' 
                    outlineStyle={{borderRadius : 10}}
                ></TextInput>
               
                <TextInput
                    inputMode='email' style={style.textInput}
                    onChangeText={(value)=>{changeUserMail(value)}}
                    mode='outlined' label={"E-Mail"} activeOutlineColor='dodgerblue' 
                    outlineStyle={{borderRadius : 10}}
                ></TextInput>

                <TextInput
                    inputMode='text' style={style.textInput}
                    onChangeText={(value)=>{changeUserId(value)}}
                    mode='outlined' label={'UserId'} activeOutlineColor='dodgerblue'
                    outlineStyle={{borderRadius : 10}} 
                ></TextInput>

                <TextInput
                    inputMode='text' style={style.textInput} secureTextEntry
                    onChangeText={(value)=>{changePass(value)}}
                    mode='outlined' label={"Password"} activeOutlineColor='dodgerblue' 
                    outlineStyle={{borderRadius : 10}}
                ></TextInput>
                <TextInput
                    inputMode='text' style={style.textInput}
                    mode='outlined' label={"Confrom Password"}
                    onChangeText={(value)=>{changeCpass(value)}} 
                    activeOutlineColor='dodgerblue' 
                    outlineStyle={{borderRadius : 10}}
                    
                ></TextInput>
                
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
                            userType=='Student' ? changeType('Faculty') : changeType('Student')
                        // setToggleValue(value)
                        // console.log(value + " " + toggleValue + " "  +userType)
                    }}
                    ></Toggle>


                <Text 
                    onPress={()=>{
                        props.navigation.replace('Login')
                    }}
                    style={{color :'dodgerblue',fontSize:20,marginBottom:8}}>Go back to Signin
                </Text>
                
                <Button mode='contained'buttonColor='dodgerblue' compact
                    onPress={()=>{
                      signUp()  
                    }}
                >Create</Button>
                </ScrollView>
            </View>
        </View>
        </ScrollView>

        </View>
    )
}

const style = StyleSheet.create({
    mianContainer : {
        flex :1,
    },
    lottieView : {
        height : '37%',
    },
    textInput : {
        marginBottom : 10,
    }

})

export default SignUp