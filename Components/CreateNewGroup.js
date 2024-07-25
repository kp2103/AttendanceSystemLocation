import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import LottieView from 'lottie-react-native'
import Colors from "../Color/Colors";
import firestore from '@react-native-firebase/firestore'
import Header from "./Header";
import { UserInfo } from "../App";

const CreateNewGroup = (props) => {

    const [isNewGroupCreated, setIsGroupCreated] = useState(false)
    const [groupName, setGroupName] = useState("");

    const context = useContext(UserInfo)

    function getUserDocumentReference() {
        try {
            let documentReference = firestore().collection("UserInfo").doc(context.name)
            return documentReference
        }
        catch (error) {
            console.log(error)
        }
    }

    function getGroupDocumentReference() {
        try {
            let documentReference = firestore().collection("GroupInfo")
            return documentReference
        }
        catch (error) {
            console.log(error)
        }
    }

    async function createNew() {
        let min = 1000
        let max = 9999
        let groupId = Math.floor(Math.random() * (max - min + 1) + min).toString()+ "_" + groupName
        try {

            if(groupName=="")
            {
                console.warn("Enter Group Name")
            }
            else{
                console.log(context.userGroupInfo)
                let UserGroupInfo =  getUserDocumentReference().collection('GroupInfo')
                    .doc((groupId).toString())
                
                let isGroupExists = 0
                context.userGroupInfo.forEach((value)=>{
                    if(value.name==groupName.toString())
                    {
                        isGroupExists = 1
                    }
                })

                if(!isGroupExists)
                {
                        UserGroupInfo.set({
                        name: groupName.toString(),
                        onwer: context.name.toString(),
                        groupId: groupId.toString()
                    }).then(() => {
                        getGroupDocumentReference().doc(groupId.toString()).set({
                            name: groupName.toString(),
                            onwer: context.name.toString(),
                            groupId: groupId.toString(),
                            [context.userType] : [context.name]
                        }).then(() => {
                            console.warn("Group Created Successfully")
                            console.info(groupName)
                            context.userGroupInfo.add({
                                name: groupName.toString(),
                                onwer: context.name.toString(),
                                groupId: groupId.toString()
                            })
                            
                            props.route.params.setGroupList([...props.route.params.groupList,{name: groupName.toString(),
                                onwer: context.name.toString(),
                                groupId: groupId.toString()}])
                            console.log(props.route.params.groupList)
                            // props.setGroupList(Array.from(context.userGroupInfo))
                            setIsGroupCreated(true)

                        }).catch((e) => {
                            console.log("Error in second Document" + e)
                        })
                    }).catch((error) => {
                        console.log("Error in First Document" + error)
                    })   
                }
                else{
                    console.warn("group is created already")
                }
    
            }
        }
        catch (error) {
            console.log("Main Part" + error.toString())
        }
        
    }

    function onBack() {
        props.navigation.navigate('GroupSection')
        setGroupName("")
        setIsGroupCreated(false)
    }

    return (
        <View style={{ backgroundColor: 'white' }}>
            <Header {...props}></Header>
            <View style={styleSheet.mainContainer}>
                <View style={styleSheet.lottieContainer}>
                    <LottieView
                        style={styleSheet.lottie}
                        autoPlay
                        loop
                        renderMode="AUTOMATIC"
                        useNativeLooping
                        source={isNewGroupCreated ? require('../LottieAnimations/enjoy_beach_vacation.json') : require('../LottieAnimations/call_center.json')}
                    ></LottieView>

                    <View>
                        <TextInput
                            mode="flat"
                            style={{ backgroundColor: 'white', alignSelf: 'center', width: '70%' }}
                            inputMode="text"
                            textColor={Colors.purple}
                            onChangeText={(value)=>{
                                setGroupName(value)
                            }}
                            placeholder="Group Name"
                        ></TextInput>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>

                        <Button mode="contained" style={{ alignSelf: 'baseline' }} buttonColor={Colors.purple} textColor="white"
                            onPress={() => {
                                onBack()
                            }}
                        >Back</Button>


                        <Button mode="elevated" style={{ marginLeft: 10, alignSelf: "baseline" }} textColor="white"
                            onPress={() => {
                                createNew()
                            }}
                            buttonColor={Colors.purple}>Create</Button>

                    </View>
                </View>
            </View>
        </View>
    )
}
const styleSheet = StyleSheet.create({
    mainContainer: {
        height: '100%',
        justifyContent: 'center'
    },
    lottieContainer: {
        height: '100%',
        justifyContent: 'center'
    },
    lottie: {
        height: '30%',
    }
})

export default CreateNewGroup