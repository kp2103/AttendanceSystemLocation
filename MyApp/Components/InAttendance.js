import { View, Text, StyleSheet, Image, TouchableOpacity, BackHandler} from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Avatar ,Button} from 'react-native-paper'
import Colors from '../Color/Colors'
import { UserInfo } from '../App'
import firestore from '@react-native-firebase/firestore'


export default function InAttendance(props) {

    const dateObj = new Date() 
    const context = useContext(UserInfo)
    const [isButtonClicked,setIsButtonClicked] = useState(false)
    const [reload,setReload] = useState(false)
    
    const chnageButtonClicked = useCallback(()=>{setIsButtonClicked(true)},[isButtonClicked])

    const chnageReload = useCallback(()=>{setReload(true)},[reload])
    
    useEffect(()=>{

        BackHandler.addEventListener('hardwareBackPress',()=>{
            if(context.userType=='Student' && !isButtonClicked)
            {
                firestore().collection('Instance').doc(props.route.params.groupId + "_" + props.route.params.subject).update({
                    users : firestore.FieldValue.arrayRemove(context.name)
                }).then(()=>{
                    console.log('your Attendance is not going to take')
                })
            }
        })
    },[])
    const storeRecord = async(data)=>{
        firestore().collection('UserInfo').doc(context.name).collection('Records').doc(props.route.params.groupId + "_" + props.route.params.subject).set({
            users : data
        }).then(()=>{
            console.log('User Data stored in Records')
        })
    }

    const storeAttendance = async(data)=>{
        const collectionReference = firestore().collection('UserInfo')
        data.forEach(async(value)=>{
           
           const id = dateObj.getDate() + "-" + (dateObj.getMonth()+1) + "-" + dateObj.getFullYear() 
           const obj = {
                id : id,  
                date : dateObj
           }
           const documentReference =  collectionReference.doc(value).collection('Attendance').doc(props.route.params.groupId + "_" + props.route.params.subject)
           if((await documentReference.get()).exists)
           {
                
                documentReference.update({
                    attendedDays : firestore.FieldValue.arrayUnion(obj)
                }).then(()=>{
                    console.log('Attendance updated successfully')
                })
           }
           else{
                documentReference.set({
                    attendedDays :[obj] 
                }).then(()=>{
                    console.log('Attendance set successfully')
                })
           }
           
        });
        firestore().collection('Instance').doc(props.route.params.groupId + "_" + props.route.params.subject).delete().then(()=>{
            chnageReload()
            console.log('Instance has been deleted')
           })
    }
    useEffect(()=>{
        firestore().collection('UserInfo').doc(context.name).collection('Attendance').doc(props.route.params.groupId + "_" + props.route.params.subject).onSnapshot((documentSnapShot)=>{
            chnageReload()
            
        })
    })

    const takeAttendance = async()=>{
        const instanceDocumentReference  = firestore().collection('Instance').doc(props.route.params.groupId + "_" + props.route.params.subject).get().then(async(document)=>{
            // const data = document.get('users')
            if(document.exists)
            {
                console.log('fatched data ' + document.get('users'))
                await storeRecord(document.get('users'))
                await storeAttendance(document.get('users'))
            }
            else{
                console.warn('Attendance is already  taken today')
            }
        })   
    }

    async function addInstance(documentReference,obj)
    {
        if((await documentReference.get()).exists)
        {
            documentReference.update({
                users : firestore.FieldValue.arrayUnion(obj)
            })
        }
        else{
            documentReference.set({
                users : [obj]
            }).then(()=>{
                console.log('created new Instance doc')
            })
        }
    }

    useEffect(()=>{
        const documentReference = firestore().collection('Instance').doc(props.route.params.groupId + "_" + props.route.params.subject)
        const obj = [
            context.name,
            // time : dateObj,   
        ]      
        if(context.userType=='Student')
        {
            addInstance(documentReference,context.name)
        }  
    })

    return (
        <>
            <View style={{backgroundColor : 'black'}}>
                <TouchableOpacity>
                    <Image source={require('../Images/icons8-previous-48.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={styleSheet.mainView}>
                <View>
                    <Avatar.Text
                        label={context.name.toUpperCase().charAt(0)}
                        color='white'
                        style={styleSheet.textAvatar}
                        size={150}
                    // labelStyle={{fontSize : 80}}
                    ></Avatar.Text>
                </View>
                <View>
                    <Text style={context.name=='Faculty'?styleSheet.text  : {display : 'none'}}>{reload ? 'Attended': 'Attending'}</Text>
                    <Text style={context.userType=='Student'?styleSheet.text:{display : 'none'}}>{reload ? 'Attending':'Attended'}</Text>
                </View>
                <View>
                    <Button
                        style={context.userType!='Student'?{display : 'flex'}:{display : 'none'}}
                        mode='contained'
                        buttonColor={Colors.purple}
                        textColor='white'
                        onPress={()=>{
                            takeAttendance()
                            chnageButtonClicked()  
                        }}
                    >Take Attendance</Button>
                </View>
            </View>
        </>
    )
}

const styleSheet = StyleSheet.create({
    mainView: {
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    textAvatar: {
        backgroundColor: Colors.purple
    },
    text : {
        color : 'white',
        fontSize : 45,
        marginTop : 20,
    }
})