// import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
// import { StyleSheet, View, FlatList } from 'react-native'
// import { Text, AnimatedFAB,Card,Avatar,Button} from "react-native-paper";
// import * as Animayable from 'react-native-animatable'
// // import BottomSheet from '@devvie/bottom-sheet'
// import { UserInfo } from "../App";
// import firestore from '@react-native-firebase/firestore'
// import Colors from "../Color/Colors";
// // import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
// import {format} from 'date-fns'
// // import NetInfo from '@react-native-community/netinfo'
// // import { tabBarStyle } from "./BottomLayout";
// // import DropDown from "./DropDown";
// // import DateTimePicker from "@react-native-community/datetimepicker";
// // import DateTimePickerModal from 'react-native-modal-datetime-picker'
// import NewSchedule from "./NewSchedule";
// import EmptyComponent from "./EmptyComponent";
// import NetInfo from "@react-native-community/netinfo";
// import { giveAttendance } from "../FireBaseData/GiveAttendance";
// import Geolocation from '@react-native-community/geolocation'


// const ScheduleSection = (props) => {
//     const context = useContext(UserInfo)
//     const [schedules,setSchedules] = useState(new Array())
//     const [bottomSheetRef,setBottomSheetRef] = useState()
//     const [reload,setReload] = useState(false)
//     const identifierRef = useRef({})
//     const [isRefreshing,setisreFreshing] = useState(false)

//     // useEffect(()=>{
//     //     context.userGroupInfo.forEach((object) => {
//     //         groupName.push(object.groupId)
//     //     })
//     // },[])
//     const chnageSchedules = useCallback(()=>{setSchedules([])})
//     const chnageReload = useCallback(()=>{setReload(!reload)})
//     // const currentDate = useMemo(()=>{return new Date()})


//     async function updateLocation(cname,groupId,subject,identifierRef,radius)
//     {
//         const documentReference = (firestore().collection('GroupInfo').doc(groupId).collection('ScheduleInfo').doc(subject))
        
//         let  latitude = undefined
//         let longitude = undefined
        
//         Geolocation.getCurrentPosition((position)=>{
//             latitude = position.coords.latitude
//             longitude = position.coords.longitude
//             console.log(latitude + " " + longitude)
//             documentReference.update(
//                 {
//                     identifier : {
//                         latitude : latitude,longitude :longitude
//                     }
//                 }
//             ).then(()=>{
//                 console.log('updated')
//                 giveAttendance(cname,groupId,subject,identifierRef,radius).then((value)=>{
//                     if(value)
//                     {
//                         const uName = cname
//                         // const groupId = groupId
//                         // const subject = item.subject
//                         props.navigation.navigate('InAttendance',{
//                             uName,
//                             groupId,
//                             subject,
//                         })
//                     }
//               })

//                 // return true
//             })

//             // identifierRef.current = {
//             //     latitude : position.coords.latitude,
//             //     longitude : position.coords.longitude
//             // }
//         })

//     }

//     const getSchedules = ()=>{
//         // setSchedules([])
//         // schedules.clear()
//         const newSchedule = []
//         // const zonedDate = utcToZonedTime(new Date(),'Asia/Kolkata')
//         // currentDate = zonedTimeToUtc(zonedDate, timeZone)
//         let currentDate = new Date();

//         // const timezoneOffset = new Date().getTimezoneOffset();
    
//         // Adjust the date by adding the offset
//         // currentDate = new Date(currentDate.getTime() - timezoneOffset * 60000);
    


//         // schedules.splice(0,schedules.length)
//         const collectionReference = firestore().collection('GroupInfo')
//         context.userGroupInfo.forEach((object)=>{
//             collectionReference.doc(object.groupId).collection('ScheduleInfo').onSnapshot((querySnapShort)=>{
//                 querySnapShort.docs.map((document)=>{
//                     const lastDate = document.get('lastDate').toDate()
//                     const startDate = document.get('time').toDate()
//                     const day = document.get('day')
//                     console.log(document.get('subject'))
//                     if((currentDate<=lastDate && currentDate>=startDate) && (day==currentDate.getDay() || day==7))
//                     {
//                         newSchedule.push(document.data())
//                         console.log(schedules)
//                     }
//                     else{
//                         console.log('no data found')
//                     }
//                 })
//             })
//         })
//         setSchedules(()=>(newSchedule))
//     }

//     useEffect(()=>{
//         getSchedules()
//     },[reload])


//     useEffect(() => {
//         NetInfo.addEventListener((info)=>{
//             if(!info.isWifiEnabled)
//             {
//                 console.warn("Please Connect To WIFI")
//                 // console.info(info.details.ipAddress)
//                 Geolocation.getCurrentPosition((position)=>{
//                     identifierRef.current = {
//                         bssid : info.details.bssid,
//                         ssid : info.details.ssid,
//                         latitude : position.coords.latitude,
//                         longitude : position.coords.longitude
//                     }
//                 })
//                 console.info(identifierRef.current)
//             }
//             else{
//                 Geolocation.getCurrentPosition((position)=>{
//                     identifierRef.current = {
//                         bssid : info.details.bssid,
//                         ssid : info.details.ssid,
//                         latitude : position.coords.latitude,
//                         longitude : position.coords.longitude
//                     }
//                 },(e)=>{console.info(e)},{enableHighAccuracy : true})
//                 console.info(identifierRef.current)
//             }
            
//         })  
//     },[])


//     return (
//         <Animayable.View animation={'fadeIn'} duration={700} useNativeDriver={true}>
//             <View style={{ height: '100%' }}>
//                 {/* <Text style={{ fontSize: 30 }}>ScheduleSection</Text> */}

//                 <FlatList
//                     scrollEnabled={true}
//                     // extraData={schedules}
//                     onRefresh={async ()=>{
//                         await getSchedules()
//                         setisreFreshing(false)
//                     }
//                     }
//                     refreshing={isRefreshing}
//                     data={(schedules)}
//                     ListEmptyComponent={<EmptyComponent></EmptyComponent>}
//                     renderItem={({item,index})=>{
//                         return(
//                         <Card mode="elevated" style={styleSheet.cardStyle}>
//                             <Card.Content
//                                 style={{flexDirection : "row",flex:1,justifyContent : 'space-between',alignItems:'center'}}
//                             >
//                                 <View>
//                                     <Avatar.Text
//                                         color="white"
//                                         label={item.subject.toString().charAt(0) + item.subject.toString().charAt(1)}
//                                         labelStyle={{fontSize:25}}
//                                         style={styleSheet.cardCircleStyle}
//                                     ></Avatar.Text>
//                                 </View>
//                                 <View>
//                                     <Text style={styleSheet.cardTextStyle}>{item.subject}</Text>
//                                     <Text style={styleSheet.cardIdStyle}>{item.time.toDate().getHours() + ":" +item.time.toDate().getMinutes()}</Text>
//                                 </View>
//                                 <View>
//                                     <Button mode="contained"  buttonColor={Colors.purple} 
                                    
//                                     textColor='white'
                                    
//                                         onPress={async()=>{
//                                             updateLocation(context.name,item.groupId,item.subject,identifierRef.current,item.radius).then((response)=>{
//                                                 console.info(response)
//                                                 // if(response)
      
//                                             })
//                                             //   console.info(giveAttendance(context.name,item.groupId,item.subject,identifierRef.current))
                                              
//                                         }}
//                                     >Join</Button>
//                                 </View>

//                             </Card.Content>
//                         </Card>                            
//                         )
//                     }}
//                 ></FlatList>


//                 <AnimatedFAB label="New Schedule"
//                     icon={'plus'}
//                     extended={true}
//                     iconMode="static"
//                     animateFrom="right"
//                     color={'white'}
//                     onPress={() => {
//                         bottomSheetRef.current.open()                        
//                     }}
//                     style={context.userType=='Faculty'?styleSheet.fabButtonStyle:{display : 'none'}}
//                 ></AnimatedFAB>

//                 <NewSchedule setReload={chnageReload} updateSchedule={getSchedules} setRef={setBottomSheetRef} navigation={props.navigation}></NewSchedule>


                
//             </View>
//         </Animayable.View>
//     )
// }

// const styleSheet = StyleSheet.create({

//     fabButtonStyle: {
//         position: 'absolute',
//         right: 0,
//         backgroundColor: Colors.purple,
//         marginBottom: '18%',
//         bottom: 0,
//     },
//     fabHeaderStyle: {
//         fontSize: 30,
//         alignSelf: 'center',
//         color: Colors.purple,
//         fontWeight: 'bold'
//     },
//     textStyle: {
//         backgroundColor: 'white',
//         textAlign: 'center',
//         color: Colors.purple,
//     },
//     bottomSheetMainContainer: {
//         marginLeft: '10%',
//         marginRight: '10%',
//         marginBottom : '30%',
//     },
//     eachViewStyle: {
//         width: '100%'
//     },
//     button : {
//         borderRadius : 20,
//         marginTop : '5%'
//     },
//     text:{
//         fontSize :22,
//         marginTop : 10,
//         marginBottom : 10,
//         alignSelf : "center"
//     },
//     unVisibleDateTimePicker : {
//         display : "none"
//     },
//     visibleDateTimePicker:{
//         display : 'flex'
//     },
//     cardStyle : {
//         marginLeft : 20,
//         marginRight : 20,
//         marginTop : 5,
//         marginBottom : 10,
//         backgroundColor : 'white',
//     },
//     cardCircleStyle : {
//         backgroundColor : Colors.purple,
//     },
//     cardTextStyle  : {
//         color : Colors.purple,
//         fontSize : 25,
//         marginLeft : 10,
//         alignItems: 'center'
//     },
//     cardIdStyle : {
//         color : Colors.purple,
//         fontSize : 15,
//         marginLeft : 10,
//     },
// })


// export default ScheduleSection





import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, AnimatedFAB, Card, Avatar, Button } from "react-native-paper";
import * as Animatable from 'react-native-animatable';
import { UserInfo } from "../App";
import firestore from '@react-native-firebase/firestore';
import Colors from "../Color/Colors";
import NetInfo from "@react-native-community/netinfo";
import Geolocation from '@react-native-community/geolocation';
import NewSchedule from "./NewSchedule";
import EmptyComponent from "./EmptyComponent";
import { giveAttendance } from "../FireBaseData/GiveAttendance";

const ScheduleSection = (props) => {
    const context = useContext(UserInfo);
    const [schedules, setSchedules] = useState([]);
    const [bottomSheetRef, setBottomSheetRef] = useState();
    const [reload, setReload] = useState(false);
    const identifierRef = useRef({});
    const [isRefreshing, setIsRefreshing] = useState(false);

    const changeReload = useCallback(() => setReload(!reload), [reload]);

    async function updateLocation(cname, groupId, subject, identifier, radius,isFaculty) {
        const documentReference = firestore()
            .collection('GroupInfo')
            .doc(groupId)
            .collection('ScheduleInfo')
            .doc(subject);

        Geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            if(isFaculty)
            {
                await documentReference.update({
                    identifier: { latitude, longitude }
                });
                console.log('Location updated');
            }
            const attendanceGiven = await giveAttendance(cname, groupId, subject, {latitude,longitude});
            if (attendanceGiven) {
                props.navigation.navigate('InAttendance', {
                    uName: cname,
                    groupId,
                    subject,
                });
            }
        }, (error) => {
            console.error(error);
        });
    }

    const getSchedules = useCallback(() => {
        const newSchedules = [];
        // setSchedules([])
        const currentDate = new Date();
        const collectionReference = firestore().collection('GroupInfo');

        context.userGroupInfo.forEach((object) => {
            collectionReference.doc(object.groupId).collection('ScheduleInfo').onSnapshot((querySnapshot) => {
                querySnapshot.docs.forEach((document) => {
                    const lastDate = document.get('lastDate').toDate();
                    const startDate = document.get('time').toDate();
                    const day = document.get('day');
                    if ((currentDate <= lastDate && currentDate >= startDate) && (day === currentDate.getDay() || day === 7)) {
                        newSchedules.push(document.data());
                    }
                });
            });
            setSchedules(newSchedules);
        });
    }, [context.userGroupInfo]);

    useEffect(() => {
        getSchedules();
    }, [reload,getSchedules]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((info) => {
            if (!info.isWifiEnabled) {
                console.warn("Please Connect To WIFI");
                Geolocation.getCurrentPosition((position) => {
                    identifierRef.current = {
                        bssid: info.details.bssid,
                        ssid: info.details.ssid,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                });
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <Animatable.View animation={'fadeIn'} duration={700} useNativeDriver={true}>
            <View style={{ height: '100%' }}>
                <FlatList
                    scrollEnabled={true}
                    onRefresh={async () => {
                        await getSchedules();
                        setIsRefreshing(false);
                    }}
                    refreshing={isRefreshing}
                    data={schedules}
                    ListEmptyComponent={<EmptyComponent />}
                    renderItem={({ item }) => (
                        <Card mode="elevated" style={styleSheet.cardStyle}>
                            <Card.Content style={styleSheet.cardContentStyle}>
                                <View>
                                    <Avatar.Text
                                        color="white"
                                        label={item.subject.charAt(0) + item.subject.charAt(1)}
                                        labelStyle={{ fontSize: 25 }}
                                        style={styleSheet.cardCircleStyle}
                                    />
                                </View>
                                <View>
                                    <Text style={styleSheet.cardTextStyle}>{item.subject}</Text>
                                    <Text style={styleSheet.cardIdStyle}>{item.time.toDate().getHours()}:{item.time.toDate().getMinutes()}</Text>
                                </View>
                                <View>
                                    <Button
                                        mode="contained"
                                        buttonColor={Colors.purple}
                                        textColor="white"
                                        onPress={() => {
                                            const isFaculty = context.userType=='Faculty'
                                            updateLocation(context.name, item.groupId, item.subject, identifierRef.current, item.radius,isFaculty)}}
                                    >Join</Button>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                />
                <AnimatedFAB
                    label="New Schedule"
                    icon="plus"
                    extended={true}
                    iconMode="static"
                    animateFrom="right"
                    color="white"
                    onPress={() => bottomSheetRef.current.open()}
                    style={context.userType === 'Faculty' ? styleSheet.fabButtonStyle : { display: 'none' }}
                />
                <NewSchedule setReload={changeReload} updateSchedule={getSchedules} schedule={schedules} setRef={setBottomSheetRef} navigation={props.navigation} />
            </View>
        </Animatable.View>
    );
}

const styleSheet = StyleSheet.create({
    fabButtonStyle: {
        position: 'absolute',
        right: 0,
        backgroundColor: Colors.purple,
        marginBottom: '18%',
        bottom: 0,
    },
    cardStyle: {
        marginHorizontal: 20,
        marginVertical: 5,
        backgroundColor: 'white',
    },
    cardContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardCircleStyle: {
        backgroundColor: Colors.purple,
    },
    cardTextStyle: {
        color: Colors.purple,
        fontSize: 25,
        marginLeft: 10,
    },
    cardIdStyle: {
        color: Colors.purple,
        fontSize: 15,
        marginLeft: 10,
    },
});

export default ScheduleSection;
