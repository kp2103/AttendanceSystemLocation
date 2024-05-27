import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View ,ScrollView} from 'react-native'
import {Button } from "react-native-paper";
import CircularProgress from 'react-native-circular-progress-indicator'
import Colors from "../Color/Colors";
import DropDown from "./DropDown";
import LottieView from 'lottie-react-native'
import { UserInfo } from "../App";
import firestore from '@react-native-firebase/firestore'
import DateTimePicker from 'react-native-ui-datepicker'
import EmptyComponent from "./EmptyComponent";
// import {Calendar} from 'react-native-calendars'
const ReportSection = () => {

    const [groupId,setGroupId] = useState("")
    const [subject,setSubject] = useState("")
    const groupsId = []
    const [subjects,setSubjects] = useState([])
    const context = useContext(UserInfo)
    // const [isdataVisible,setIsDateVisible] = useState(false)
    const [totalDays,setTotalDays] = useState(0)
    const [ScheduleInfo,setScheduleInfo] = useState([])
    const [markedDates,setmarkedDates] = useState([])
    const [reload,setReload] = useState(false)
    const [isNoData,setIsNoData] = useState(undefined)
    let startDate,lastDate


    const changeGroup = useCallback((value)=>{setGroupId(value)},[groupId])
    const chnageTotalDays = useCallback((value)=>{setTotalDays(value)},[totalDays])
    const chnageSubject = useCallback((value)=>{setSubject(value)},[subject])
    const changeReload = useCallback((value)=>{setReload(true)},[reload])

    

    async function search()
    {
        console.log(context.name)
        console.log(groupId +"_" + subject)
        const documentReference = await firestore().collection('UserInfo').doc(context.name).collection('Attendance').doc(groupId+"_"+subject).get()
        
        ScheduleInfo.forEach((value)=>{
            if(value.subject===subject)
            {
                startDate = value.time.toDate()
                lastDate  = value.lastDate.toDate()
            }
        })
        // console.log(ScheduleInfo)
        console.log(startDate + " " + lastDate)
        console.log(Math.abs(lastDate - startDate))
        if(documentReference.exists)
        {
            const differenceInMs = Math.abs(lastDate - startDate);

            // Convert milliseconds to days
            const millisecondsPerDay = 1000 * 60 * 60 * 24;
            const differenceInDays = Math.ceil(differenceInMs / millisecondsPerDay) + 1;
            console.log(differenceInDays)
            chnageTotalDays(((documentReference.get('attendedDays').length)*100)/differenceInDays)
            // setmarkedDates((documentReference.get('attendedDays')))
            documentReference.get('attendedDays').forEach((value)=>{
                markedDates.push(value.date)
            })
            changeReload()
            setIsNoData(false)
        }
        else{
            console.warn('No data Found')
            setIsNoData(true)
            chnageTotalDays(0)
        }
    }
    useEffect(()=>{
        context.userGroupInfo.forEach((object) => {
            groupsId.push(object.groupId)
        })
    })

    useEffect(()=>{
        firestore().collection('GroupInfo').doc(groupId).collection('ScheduleInfo').onSnapshot((querySnapshot)=>{
            subjects.splice(0,subjects.length)
            ScheduleInfo.splice(0,ScheduleInfo.length)
            querySnapshot.forEach((document)=>{
                subjects.push(document.get('subject'))
                ScheduleInfo.push(document.data())
            })
        })
    },[groupId])

    return (
        <View style={styleSheet.mainContainer}> 
            <View>
                <DropDown header='Select Group' setSelected={changeGroup} data={groupsId}></DropDown>
            </View>

            <View>
                <DropDown header="Select Subject" setSelected={chnageSubject} data={subjects}></DropDown>
            </View>

            <View style={styleSheet.buttonView}>
                <Button mode="contained" textColor="white" buttonColor={Colors.purple}
                labelStyle={{fontSize : 20}} onPress={()=>{search()}} >Search</Button>
            </View>

            <View style={isNoData?{height : 200,marginTop : 30}:{display:'none'}}>
                <LottieView
                    loop
                    autoPlay
                    source={require('../LottieAnimations/no_data_found.json')}
                    style={{height : '100%'}}
                ></LottieView>
            </View>

            <View style={!isNoData?styleSheet.progressBar:{display : "none"}}>
                <CircularProgress
                    value={totalDays}
                    activeStrokeWidth={28}
                    duration={1500}
                    progressValueColor={Colors.purple}
                    radius={120}
                    allowFontScaling={true}
                    initialValue={0}
                    activeStrokeColor={'#2465FD'}
                    activeStrokeSecondaryColor={'#C25AFF'}
                ></CircularProgress>
            </View>
            <View style={styleSheet.calendarView}>
                {/* <DateTimePicker
                    mode="multiple"
                    
                    // selectedItemColor={Colors.purple}
                    headerButtonColor={Colors.purple}
                    headerTextStyle={Colors.purple}
                    // dates={markedDates}
                    dates={markedDates}
                    // selectedDates={markedDates}

                    
                ></DateTimePicker> */}
                {/* <Calendar
                    markingType="dot"
                    markedDates={{markedDates}}
                
                ></Calendar> */}
            </View>
        </View>
    )
}

const styleSheet = StyleSheet.create({
    mainContainer : {
        height : '100%',
        marginLeft : 15,
        marginRight : 15,
    },
    progressBar : {
        alignItems : 'center',
        marginTop : 10,
    },
    buttonView : {
        marginTop : 10,
    },
    calendarView : {
        marginBottom : '20%',
    }
})
export default ReportSection