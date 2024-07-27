import { View, Text, StyleSheet, Image, TouchableOpacity, BackHandler} from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Avatar ,Button} from 'react-native-paper'
import Colors from '../Color/Colors'
import { UserInfo } from '../App'
import firestore from '@react-native-firebase/firestore'
import { FlatList } from 'react-native-gesture-handler'
import LottieView from 'lottie-react-native'
import { ToastAndroid } from 'react-native';

export default function InAttendance(props) {

    const dateObj = new Date() 
    const [totalStudents,setTotalStudents] = useState([])
    const context = useContext(UserInfo)
    const [isButtonClicked,setIsButtonClicked] = useState(false)
    const [reload,setReload] = useState(false)
    const [isLoading,setLoading] = useState(false)
    
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


    // firestore().collection('Instance').doc(props.route.params.groupId + "_" + props.route.params.subject).onSnapshot((documentSnapShot)=>{
    //         totalStudents.splice(0,totalStudents.length)
    //         let newStudents = []
    //         if(documentSnapShot.exists)
    //         {
    //             documentSnapShot.get('users').forEach((student)=>{
    //             newStudents.push(student)
    //         })
    //         setTotalStudents(newStudents)
    //         }
    // })

    useEffect(() => {
        const documentReference = firestore().collection('Instance').doc(props.route.params.groupId + "_" + props.route.params.subject)

        const unsubscribe = documentReference.onSnapshot((documentSnapshot) => {
            if (documentSnapshot.exists) {
                const users = documentSnapshot.get('users') || []
                setTotalStudents(users)
            } else {
                setTotalStudents([])
            }
        }, (error) => {
            console.error('Error getting document:', error)
        })

        return () => unsubscribe() // Clean up the listener on unmount
    }, [props.route.params.groupId, props.route.params.subject])


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
                const data = (await documentReference.get()).get('attendedDays')
                const newDate = new Date()
                const newId = newDate.getDate() +'-'+ newDate.getMonth()+1 + '-' + newDate.getFullYear()
                if(data[data.length -1 ].id != newId)
                {
                    documentReference.update({
                        attendedDays : firestore.FieldValue.arrayUnion(obj)
                    }).then(()=>{
                        console.log('Attendance updated successfully')
                    })
                }else{
                    // console.log('Attendance is already taken')
                    ToastAndroid.show('Attendance is already taken', ToastAndroid.SHORT);
                }
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
        if(context.userType=='Student')
        {
            firestore().collection('UserInfo').doc(context.name).collection('Attendance').doc(props.route.params.groupId + "_" + props.route.params.subject).onSnapshot((documentSnapShot)=>{
                chnageReload() 
            })
        }
    })

    const takeAttendance = async()=>{
        // console.warn('hello')
        const instanceDocumentReference  = firestore().collection('Instance').doc(props.route.params.groupId + "_" + props.route.params.subject).get().then(async(document)=>{
            // const data = document.get('users')
            console.log('data : '  + document.get('users'))
            if(document.exists)
            {
                setLoading(true)
                console.log('fatched data ' + document.get('users'))
                await storeRecord(document.get('users'))
                await storeAttendance(document.get('users'))
                setLoading(false)
            }
            else{
                // console.warn('Attendance is already  taken today')
                ToastAndroid.show('Attendance is already taken today', ToastAndroid.SHORT);
            }
            props.navigation.navigate('ScheduleSection')
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
            {isLoading ? <View style={{flex : 1,height : '100%'}}>
            <View style={{height  : '70%'}}>
                <LottieView
                    loop
                    autoPlay
                    source={require('../LottieAnimations/loading.json')}
                ></LottieView>
            </View>
            </View>
            :
            <View>

            <View style={{backgroundColor : 'black'}}>
                <TouchableOpacity>
                    {/* <Image source={require('../Images/icons8-previous-48.png')}></Image> */}
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
                <View>
                    {context.userType=='Faculty'?
                    
                    <FlatList
                        data={totalStudents}
                        renderItem={({item})=>
                        <View>
                            <Text style={{color : 'green',fontSize : 30}}>{item}</Text>
                        </View>
                    
                        }
                    ></FlatList>
                    :null
                }
                </View>
            </View>
            </View>
            }
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