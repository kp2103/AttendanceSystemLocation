import React, { useContext, useEffect, useRef, useState } from 'react'
import {  StyleSheet, View } from 'react-native'
import { TextInput, Button, Card, Avatar } from 'react-native-paper'
import LottieView from 'lottie-react-native'
import Colors from "../Color/Colors";
import firestore from '@react-native-firebase/firestore'
import Header from "./Header";
import { UserInfo } from '../App';
import { Text } from 'react-native';


export default function SearchGroup(props) {

    const context = useContext(UserInfo)
    const [isJoinGroup, setIsJoinGroup] = useState(false)
    const [groupId, setGroupId] = useState("")
    const [groupVisible, setGroupVisible] = useState(false)
    // const [isAlreadyJoin,setIsAlreadyJoin] = useState(false)
    // const [isGroupExist,setIsGroupExist] = useState(false)
    const [groupInfoObject, setGroupInfoObject] = useState({})

    const isAlreadyJoin = useRef(false)
    const isGroupExist = useRef(false)

    const cardRef = useRef()

    // useEffect(()=>{
    //     setIsJoinGroup(false)
    //     setGroupVisible(false)
    //     setIsAlreadyJoin(false)
    //     setIsGroupExist(false)
    //     setGroupInfoObject({})
    // })

    function back() {
        setIsJoinGroup(false)
        setGroupVisible(false)
        // setIsAlreadyJoin(false)
        // setIsGroupExist(false)
        isAlreadyJoin.current = false
        isGroupExist.current = false
        setGroupInfoObject({})
        props.navigation.navigate('GroupSection')
    }

    function getUserGroupReference() {
        try {
            return (firestore().collection('UserInfo').doc(context.name).collection('GroupInfo'))
        }
        catch (error) {
            console.warn(error)
        }
    }

    async function alreadyJoin() {
        console.warn("Calling alreadyJoin()")
        const documentReference = (await getUserGroupReference().doc(groupId).get())
        if (documentReference.exists) {
            isAlreadyJoin.current = true
        }
        // getUserGroupReference().doc(groupId).get().then((documentReference)=>{
        //     if(documentReference.exists)
        //     {
        //         // setIsAlreadyJoin(true)
        //         isAlreadyJoin.current = true
        //     }
        // })
    }

    async function groupInfoDocRef()
    {
        const groupRef =  await firestore().collection('GroupInfo').doc(groupId).get()
        if(groupRef.exists)
            return groupRef
        return false
    }

    async function checkGroupExist() {
        console.warn("calling groupExist()")


        // const documentReference = await firestore().collection('GroupInfo').doc(groupId).get()
        const documentReference = await groupInfoDocRef()
        if(documentReference)
        // if (documentReference.exists) 
        {
            console.log(documentReference.data())
            // setIsGroupExist(true)
            isGroupExist.current = true
            setGroupInfoObject(documentReference.data())

        }

    }

    async function check() {
        console.warn("Calling check()")
        console.warn(isAlreadyJoin.current + ' ' + isGroupExist.current)
        if (!isAlreadyJoin.current) {
            if (isGroupExist.current) {
                setGroupVisible(true)
            }
            else {
                console.warn("Group Does Not Exist")
                setGroupVisible(false)
            }
        }
        else {
            console.warn("User Already Join in this Group")
            setGroupVisible(true)
        }

    }

    async function search() {
        await checkGroupExist()
        await alreadyJoin()
        await check()

    }


    function join() {
        getUserGroupReference().doc(groupId).set(groupInfoObject).then(async() => {
            const documentReference = await groupInfoDocRef()
            if(documentReference)
            {
                documentReference.ref.update({
                    [context.userType] : firestore.FieldValue.arrayUnion(context.name)
                }).then(()=>{
                    console.warn("Joined Group")
                    // setIsJoinGroup(true)
                    // setIsAlreadyJoin(false)
                    isAlreadyJoin.current = true
                    // isGroupExist.current = false
                    props.route.params.setGroupList([...props.route.params.groupList,groupInfoObject])
                }).catch((e)=>{
                    console.warn("Error in Joining Group : " + e)
                })
            }

        })
            .catch((error) => {
                console.log(error.toString())
            })

    }



    return (

        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <View>
                <Header {...props}></Header>
            </View>

            <View style={{ marginLeft: '10%', marginRight: '10%' }}>
                <View style={{ height: '50%' }}>
                    <LottieView
                        autoPlay
                        style={{ height: '100%' }}
                        loop
                        useNativeLooping
                        source={isJoinGroup ? require('../LottieAnimations/enjoy_beach_vacation.json') : require('../LottieAnimations/call_center.json')}
                    ></LottieView>
                </View>

                <TextInput
                    mode='flat'
                    textContentType='name'
                    style={{ backgroundColor: 'transparent' }}
                    placeholder='Enter Group Name'
                    onChangeText={(value) => {
                        setGroupId(value)
                        isAlreadyJoin.current = false
                        isGroupExist.current = false
                
                    }}
                    placeholderTextColor={Colors.purple}
                    textColor={Colors.purple}
                ></TextInput>

                <View style={styleSheet.buttonContainer}>
                    <Button
                        mode='contained'
                        buttonColor={Colors.purple}
                        textColor='white'
                        onPress={() => {
                            back()
                        }}
                    >Back</Button>

                    <Button
                        mode='contained'
                        buttonColor={Colors.purple}
                        textColor='white'
                        onPress={() => {
                            search()
                        }}
                    >Search</Button>
                </View>

                <View style={{marginTop : '10%'}}>
                    <Card style={groupVisible ? styleSheet.visibleJoinSection : styleSheet.unvisibleJoinSection}>
                        <Card.Content style={{flexDirection : 'row',alignItems  : 'center'}}>
                            <Avatar.Text label={groupVisible ? groupInfoObject.name.charAt(0) + groupInfoObject.name.charAt(1): 'Group Data'} 
                                style={{backgroundColor : Colors.purple}}
                                size={50}
                                color='white'
                            ></Avatar.Text>

                            <View style={{marginLeft : '4%'}}>
                                <Text style={{color:Colors.purple,fontSize : 18}}>{groupInfoObject.name}</Text>
                                <Text style={{color:Colors.purple,fontSize : 13}}>{groupInfoObject.groupId}</Text>
                            </View>

                            <View style={{marginLeft : '4%'}}>
                                <Button mode='contained' buttonColor={Colors.purple} textColor='white'
                                    style={isAlreadyJoin.current ? styleSheet.unvisibleTextSection : styleSheet.visibleTextSection}
                                    onPress={() => {
                                        join()
                                    }}
                                >Join</Button>
                                <Text style={isAlreadyJoin.current ? styleSheet.visibleTextSection : styleSheet.unvisibleTextSection} >Already Join</Text>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </View>



        </View>
    )
}

const styleSheet = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '5%'
    },
    buttonStyle: {

    },
    visibleJoinSection: {
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    unvisibleJoinSection: {
        display: "none",
        flexDirection : 'row'
    },
    visibleTextSection : {
        flexDirection  :'row',
        fontSize : 18,
        textAlign  :'right',
        
    },
    unvisibleTextSection : {
        display : 'none'
    }
})
