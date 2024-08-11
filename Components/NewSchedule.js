import React, { useEffect, useRef, useContext, useState, useCallback } from 'react'
import { StyleSheet, View, ScrollView, } from 'react-native'
import { Text, TextInput, Button } from "react-native-paper";
import BottomSheet from '@devvie/bottom-sheet'
import Colors from "../Color/Colors";
import { tabBarStyle } from "./BottomLayout";
import DropDown from "./DropDown";
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { UserInfo } from "../App";
import NetInfo from '@react-native-community/netinfo'
// import * as Animayable from 'react-native-animatable'
import firestore from '@react-native-firebase/firestore'
import LottieView from 'lottie-react-native';
import { ToastAndroid } from 'react-native';
import DatePicker from 'react-native-date-picker'
import Geolocation from '@react-native-community/geolocation'


export default NewSchedule = (props) => {

    const context = useContext(UserInfo)
    const groupName = []
    const [showLocation, setShowLocation] = useState(false)
    // const dayRef = useRef()
    const [wifiBSSID, setWifiBSSID] = useState('')
    const [wifiSSID, setWifiSSID] = useState("")
    const bottomRef = useRef()
    const [subject, setSubject] = useState("")
    const [selectedGroup, setSelectedGroup] = useState("")
    const [radius, setRadius] = useState(5)
    const [selectedScheduleType, setSelectedScheduleType] = useState("")
    // const [totalDays,setTotalDays] = useState(1)
    const [showdPicker, setShowPicker] = useState(false)
    const [second, setSecond] = useState(false)
    // const [currentDate,setCurrentDate] = useState(new Date())
    // const dateObj = new Date()
    const dateRef = useRef(new Date())
    const dateRef2 = useRef(new Date())
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())
    // const [coords,setCoords] = useState({})
    const [latitude, SetLatitude] = useState("")
    const [longitude, setLongitide] = useState("")
    const [uniqueIndetifier, setUniqueIndetifier] = useState("");

    function getRandomOffset(min, max) {
        return Math.random() * (max - min) + min;
    }

    function withinLocation(tLatitude, tLongitude) {
        const currentLatitude = getRandomOffset(-100, 100) / 111000
        const currentLongitude = getRandomOffset(-100, 100) / (111000 * Math.cos(tLatitude * Math.PI / 180))
        console.log(currentLatitude + " " + currentLongitude)
    }

    const [animationSource,setAnimationSource] = useState(require('../LottieAnimations/turnOnLocation2.json'))

    //callbacks

    const chnageSource = useCallback((source)=>{setAnimationSource(source)},[setAnimationSource])

    const chnageTime = useCallback((time) => { setCurrentTime(time) }, [currentTime])

    const chnageRadius = useCallback((radius) => { setRadius(radius) }, [setRadius])

    const chnageIndetifier = useCallback((identifier) => { setUniqueIndetifier(identifier) }, [uniqueIndetifier])

    const changeScheduleType = useCallback((type) => { setSelectedScheduleType(type) }, [selectedScheduleType])

    const changeGroup = useCallback((group) => { setSelectedGroup(group) }, [selectedGroup])

    const chnageShowLocation = useCallback((value) => { setShowLocation(value) }, [setShowLocation])

    const changePosition = useCallback((position) => {
        setCoords(position)
    })
    useEffect(() => {
        props.setRef(bottomRef)
        context.userGroupInfo.forEach((object) => {
            groupName.push(object.groupId)
        })
    })


    async function checkLocation() {
        Geolocation.getCurrentPosition((location) => {
            // setCoords(location.coords)
            // console.warn("Hello")
            console.log("Location laptitude:" + location.coords.latitude)
            console.log("Location longitude:" + location.coords.longitude)
            SetLatitude(location.coords.latitude)
            setLongitide(location.coords.longitude)
            console.log("location got")
            chnageShowLocation(false)
            // withinLocation(location.coords.latitude,location.coords.longitude)

            // console.error(location.coords.longitude)
        }), (e) => {
            // call dialog 
            console.log("display no location")
            chnageShowLocation(true)
        }

    }

    useEffect(() => {

        // SetLatitude("Location not found")
        // NetInfo.addEventListener((info)=>{
        //     if(!info.isWifiEnabled)
        //     {
        //         console.warn("Please Connect To WIFI")
        //         setWifiBSSID("")
        //         setWifiSSID("")
        //     }else{
        //         setWifiBSSID(info.details.bssid)
        //         setWifiSSID(info.details.ssid)
        //         console.log(wifiSSID)
        //     }
        // })  

        // Geolocation.requestAuthorization((location)=>{
        //     location
        // })
        // Geolocation.watchPosition((location)=>{
        //     // changePosition(location.coords)
        //     SetLatitude(location.coords.latitude)
        // })
        Geolocation.getCurrentPosition((location) => {
            // setCoords(location.coords)
            // console.warn("Hello")
            console.log("Location laptitude:" + location.coords.latitude)
            console.log("Location longitude:" + location.coords.longitude)
            SetLatitude(location.coords.latitude)
            setLongitide(location.coords.longitude)
            console.log("location got")
            chnageShowLocation(false)
            // withinLocation(location.coords.latitude,location.coords.longitude)

            // console.error(location.coords.longitude)
        }), (e) => {
            // call dialog 
            console.log("display no location")
            chnageShowLocation(true)
        }
    // }, [])
    },[uniqueIndetifier])

    const getTime = (time) => {
        const t = ((time.getHours() > 12) ? (time.getHours() % 12) : time.getHours()) + ":" + time.getMinutes() + " " + (time.getHours() > 11 ? 'PM' : 'AM')
        return (t)
    }

    const create = useCallback(async() => {
        const group = selectedGroup
         
        const documentReference = firestore().collection('GroupInfo').doc(group).collection('ScheduleInfo').doc(subject);
        if((await (documentReference.get())).exists)
        {
            ToastAndroid.show('Subject is already exist', ToastAndroid.SHORT);
        }
        const emptyFieldCheck = !selectedGroup || !subject 

        if (emptyFieldCheck) {
            ToastAndroid.show('Field cannot be empty',ToastAndroid.SHORT)
            console.warn("Field cannot be empty");
            return;
        }

        const data = {
            subject: subject,
            groupId: selectedGroup,
            // totalDays : totalDays,
            time: currentTime,
            lastDate: dateRef2.current,
            day: selectedScheduleType == 'Every Week' ? dateRef.current.getDay() : 7,
            scheduleType: selectedScheduleType,
            date: dateRef.current.getDate() + '-' + (dateRef.current.getMonth() + 1).toString() + '-' + dateRef.current.getFullYear(),
            identifier: uniqueIndetifier == 'WIFI' ? { bssid: wifiBSSID, ssid: wifiSSID } : { latitude: latitude, longitude: longitude },
            indetifierType: uniqueIndetifier,
            radius: parseInt(radius)
};

        documentReference.set(data).then(() => {
            props.setReload();
            // props.schedule.push(data)
            props.updateSchedule([...props.schedule,data])
            bottomRef.current.close();
        }).catch((error) => console.error("Error adding document: ", error));
    }, [props]);



    return (
        <>
            
             <BottomSheet
                    closeOnDragDown={true}
                    style={{ backgroundColor: 'white' }}
                    openDuration={1200}
                    closeDuration={1500}
                    ref={bottomRef}
                    closeOnBackdropPress={true}
                    height={'85%'}
                    animateOnMount={true}
                    onClose={() => {
                        props.navigation.setOptions({ tabBarStyle: tabBarStyle.tabBarStyle })
                    }}
                    onOpen={() => {
                        props.navigation.setOptions({ tabBarStyle: { display: 'none' } })
                    }}
                >
                {latitude=='' || longitude=='' ?
                <>
                    <View style={{height : '100%'}}>
                        <View style={{height : '50%'}}>
                            <View style={{height : '100%'}}>
                                <LottieView
                                    style={{ height: '90%' }}
                                    autoPlay
                                    loop
                                    source={animationSource}
                                ></LottieView>
                            </View>
                        </View>
                        <View>
                            <Text>Turn On Location</Text>
                        </View>
                        <View>
                            <Button mode='contained'
                                onPress={async() => {
                                    chnageSource(require('../LottieAnimations/loading.json'))
                                    await checkLocation()
                                }}
                            >Check</Button>
                        </View>
                    </View>
                </>
                :
                    <><View style={{ height: '100%' }}>
                        <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>

                            <View style={styleSheet.bottomSheetMainContainer}>

                                <Text style={styleSheet.fabHeaderStyle}>New Schedule</Text>
                                <Text style={{ color: 'red', fontSize: 25 }}>Be make sure your Location is turn on</Text>
                                <View style={styleSheet.eachViewStyle}>
                                    <TextInput
                                        mode="flat"
                                        textColor={Colors.purple}
                                        placeholderTextColor={Colors.purple}
                                        onChangeText={(value) => {
                                            setSubject(value)
                                        }}
                                        left={<TextInput.Icon icon='eye'></TextInput.Icon>}
                                        style={styleSheet.textStyle} placeholder="Subject"
                                    ></TextInput>
                                </View>
                                <DropDown header={'Select Group Name'} setSelected={changeGroup} data={groupName}></DropDown>
                                {/* <TextInput
                                    mode="flat" textColor={Colors.purple}
                                    inputMode="numeric"
                                    value={totalDays}
                                    placeholderTextColor={Colors.purple}
                                    onChangeText={(value) => {
                                        setTotalDays(value)
                                    }}
                                    style={styleSheet.textStyle} placeholder="Total Days"
                                ></TextInput> */}

                                <DropDown header={'Select Schedule Mode'} setSelected={changeScheduleType} data={['Once Only', 'Every Day', 'Every Week']}></DropDown>

                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <View>
                                        <Text onPress={() => { setShowPicker(!showdPicker) }} style={styleSheet.text}>{dateRef.current.getDate() + '-' + (dateRef.current.getMonth() + 1).toString() + '-' + dateRef.current.getFullYear()}</Text>
                                        <Text> To </Text>
                                        <Text onPress={() => { setShowPicker(!showdPicker); setSecond(!second) }} style={styleSheet.text}>
                                            {
                                                selectedScheduleType == 'Once Only' ? dateRef.current.getDate() + '-' + (dateRef.current.getMonth() + 1).toString() + '-' + dateRef.current.getFullYear() : dateRef2.current.getDate() + '-' + (dateRef2.current.getMonth() + 1).toString() + '-' + dateRef2.current.getFullYear()
                                            }</Text>
                                    </View>

                                    <DateTimePickerModal
                                        date={dateRef.current}
                                        mode="date"
                                        isVisible={showdPicker}
                                        minimumDate={new Date()}
                                        onConfirm={(date) => {
                                            if (!second || selectedScheduleType == 'Once Only') {
                                                dateRef.current = date
                                            }
                                            else {
                                                dateRef2.current = date
                                            }
                                            setShowPicker(false)
                                        }}
                                        onCancel={() => { setShowPicker(false) }}
                                    ></DateTimePickerModal>
                                </View>

                                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                    <Text style={styleSheet.text}>{getTime(currentTime)}</Text>

                                    <DatePicker
                                        mode='time'
                                        date={currentTime}
                                        open={showTimePicker}
                                        is24hourSource='device'
                                        textColor={Colors.purple}
                                        onDateChange={(time) => {
                                            console.log(time)
                                            chnageTime(time)
                                        }}
                                    //  style={!showTimePicker?styleSheet.unVisibleDateTimePicker:null}
                                    ></DatePicker>

                                </View>

                                <View>
                                    <DropDown header={'Select Indentifier Mode'} setSelected={chnageIndetifier} data={['WIFI', 'LOCATION']}></DropDown>
                                </View>

                                <View>
                                    <TextInput
                                        mode='flat'
                                        placeholder='Radius in meter(default is 5)'
                                        inputMode='numeric'                                
                                        textColor={Colors.purple}
                                        placeholderTextColor={Colors.indianRed}
                                        onChangeText={(radius) => {
                                            chnageRadius(radius)
                                        }}
                                        style={styleSheet.textStyle}
                                    ></TextInput>
                                </View>

                                <View style={uniqueIndetifier != "LOCATION" ? { display: 'none' } : null}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text >Latitude : </Text>
                                        <Text>{latitude}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text>Longitude : </Text>
                                        <Text>{longitude}</Text>
                                    </View>
                                </View>


                                <View style={uniqueIndetifier != 'WIFI' ? { display: 'none' } : null}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text >WIFI Name : </Text>
                                        <Text>{wifiSSID}</Text>
                                    </View>

                                    <View>
                                        <Text>MAC Address : </Text>
                                        <Text>{wifiBSSID}</Text>
                                    </View>
                                </View>

                                <Button mode="contained"
                                    buttonColor={Colors.purple}
                                    style={styleSheet.button}
                                    onPress={() => {
                                        create()
                                    }}
                                >Create</Button>

                            </View>
                        </ScrollView>
                    </View>
                    </>}
                </BottomSheet>
        </>
    )
}


const styleSheet = StyleSheet.create({

    fabButtonStyle: {
        position: 'absolute',
        right: 0,
        backgroundColor: Colors.purple,
        marginBottom: '18%',
        bottom: 0,
    },
    fabHeaderStyle: {
        fontSize: 30,
        alignSelf: 'center',
        color: Colors.purple,
        fontWeight: 'bold'
    },
    textStyle: {
        backgroundColor: 'white',
        textAlign: 'center',
        color: Colors.purple,
    },
    bottomSheetMainContainer: {
        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: '30%',
    },
    eachViewStyle: {
        width: '100%'
    },
    button: {
        borderRadius: 20,
        marginTop: '5%'
    },
    text: {
        fontSize: 22,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: "center",
        color: Colors.purple
    },
    unVisibleDateTimePicker: {
        display: "none"
    },
    visibleDateTimePicker: {
        display: 'flex'
    }
})