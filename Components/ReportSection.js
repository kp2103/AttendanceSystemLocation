import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native'
import { Button } from "react-native-paper";
import CircularProgress from 'react-native-circular-progress-indicator'
import Colors from "../Color/Colors";
import DropDown from "./DropDown";
import LottieView from 'lottie-react-native'
import { UserInfo } from "../App";
import { useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import firestore from '@react-native-firebase/firestore'
import { BarChart } from 'react-native-chart-kit'
// import DateTimePicker from 'react-native-ui-datepicker'
// import EmptyComponent from "./EmptyComponent";
// import {Calendar} from 'react-native-calendars'
import { Calendar } from "react-native-calendars";
import LoadingComponent from "./Loading";
// import { FlatList } from "react-native-gesture-handler";

const Tab = createMaterialTopTabNavigator()

const ReportSection = () => {

    const [groupId, setGroupId] = useState("")
    const [subject, setSubject] = useState("")
    const groupsId = []
    const [subjects, setSubjects] = useState([])
    const context = useContext(UserInfo)
    // const [isdataVisible,setIsDateVisible] = useState(false)
    const [totalDays, setTotalDays] = useState(0)
    const [disableSubjectOption, setDisableSubjectOption] = useState(false)
    const [ScheduleInfo, setScheduleInfo] = useState([])
    const [markedDates, setmarkedDates] = useState([])
    const [reload, setReload] = useState(false)
    const [calendar_markedDates, setCalendar_markedDates] = useState({})
    const [isNoData, setIsNoData] = useState(undefined)
    const [datas,setData] = useState({labels: [],
        datasets: [
          {
            data: []
          }
        ]})
    const [animationSource, setAnimationSource] = useState(require('../LottieAnimations/no_data_found.json'))
    let startDate, lastDate

    const chnageCalendarMarkedDates = useCallback((value) => { }, [setCalendar_markedDates])
    const changeGroup = useCallback((value) => { setGroupId(value) }, [groupId])
    const chnageTotalDays = useCallback((value) => { setTotalDays(value) }, [totalDays])
    const chnageSubject = useCallback((value) => { setSubject(value) }, [subject])
    const changeReload = useCallback((value) => { setReload(true) }, [reload])

    function countSpecificDays(startDate, endDate, dayOfWeek) {
        let count = 0;
        let currentDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0); // Normalize start date time to midnight

        while (currentDate <= endDate) {
            if (currentDate.getDay() === dayOfWeek) {
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return count;
    }


    async function search(subject, isReturn) {
        let scheduleType, dayOfWeek;
        console.log(groupId + "_" + subject)
        const documentReference = await firestore().collection('UserInfo').doc(context.name).collection('Attendance').doc(groupId + "_" + subject).get()

        ScheduleInfo.forEach((value) => {
            if (value.subject === subject) {
                scheduleType = value.scheduleType
                startDate = value.time.toDate()
                lastDate = value.lastDate.toDate()
                dayOfWeek = value.time.toDate().getDay()
            }
        })
        // console.log(ScheduleInfo)
        console.log(startDate + " " + lastDate)
        console.log(Math.abs(lastDate - startDate))
        if (documentReference.exists) {
            const differenceInMs = Math.abs(lastDate - startDate);

            // Convert milliseconds to days
            const millisecondsPerDay = 1000 * 60 * 60 * 24;
            const differenceInDays = Math.ceil(differenceInMs / millisecondsPerDay) + 1;

            let days = 0
            if (scheduleType == "Every Week") {

                const fullWeeks = Math.floor(differenceInDays / 7);
                // Calculate starting point and adjust for start day of week
                let current = new Date(startDate);
                current.setDate(current.getDate() + (dayOfWeek - current.getDay() + 7) % 7);

                // Count occurrences of dayOfWeek between startDate and endDate
                let count = fullWeeks + (current <= lastDate);
                // chnageTotalDays(((documentReference.get('attendedDays').length) * 100)/count)
                days = ((documentReference.get('attendedDays').length) * 100) / count
                if(!isReturn)
                    setTotalDays((prev) => ((documentReference.get('attendedDays').length) * 100) / count)
                // chnageTotalDays(countSpecificDays(startDate, lastDate, dayOfWeek))
            }
            else {
                console.log(differenceInDays)
                days = ((documentReference.get('attendedDays').length) * 100) / differenceInDays
                if(!isReturn)
                    setTotalDays((prev) => ((documentReference.get('attendedDays').length) * 100) / differenceInDays)
                // chnageTotalDays(((documentReference.get('attendedDays').length) * 100) / differenceInDays)
                // setmarkedDates((documentReference.get('attendedDays')))
            }
            setIsNoData(false)
            console.log("TOtal : " + days)
            if (isReturn)
                return days
            const newMarkedDates = {};
            documentReference.get('attendedDays').forEach((value) => {
                markedDates.push(value.date)

                const date = value.date.toDate()
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1

                const v = date.getFullYear() + "-" + month + "-" + day
                newMarkedDates[v] = { selected: true, marked: true, selectedColor: '#7CFC00' };

            })
            setCalendar_markedDates(newMarkedDates)
            changeReload()

        }
        else {
            // console.warn('No data Found')
            setIsNoData(true)
            setAnimationSource(require('../LottieAnimations/no_data_found.json'))
            chnageTotalDays(0)
        }
    }
    useEffect(() => {
        context.userGroupInfo.forEach((object) => {
            groupsId.push(object.groupId)
        })
    })

    useEffect(() => {
        firestore().collection('GroupInfo').doc(groupId).collection('ScheduleInfo').onSnapshot((querySnapshot) => {
            subjects.splice(0, subjects.length)
            ScheduleInfo.splice(0, ScheduleInfo.length)
            querySnapshot.forEach((document) => {
                subjects.push(document.get('subject'))
                ScheduleInfo.push(document.data())
            })
        })
    }, [groupId])

    // make sure group is selected
    async function getAllSubjectResult() {
        const startAt = groupId
        const endAt = groupId + '\uf8ff';
        const documentReference = firestore().collection('UserInfo').doc(context.name).collection('Attendance')
            .where(firestore.FieldPath.documentId(), '>=', startAt)
            .where(firestore.FieldPath.documentId(), '<=', endAt)
            .onSnapshot(async(documentSnapshot) => {
                console.log('Empty : ' + documentSnapshot.empty)
                if (!documentSnapshot.empty) {
                    attendedSubjects = []
                    attendedDays = []
                    const promises = []
                    documentSnapshot.forEach((document) => {
                        const id = document.id.split('_')
                        // setSubject((prevSubject)=> id[id.length - 1])
                        // chnageSubject(id[(id.length) - 1])
                        const s = id[id.length - 1];
                        attendedSubjects.push(s);
                        // attendedDays.push(search(subject,t))
                        promises.push(search(s, true));
                        // search(s,true).then((days)=>{
                        //     attendedDays.push(days)
                        // })

                    })
                    const results = await Promise.all(promises);
                    results.forEach((result) => attendedDays.push(result));
              
                    console.log(attendedDays)
                    setData({labels : attendedSubjects,datasets : [{data : attendedDays}]})
                    setIsNoData(false)
                    // return {
                    //     labels: attendedSubjects, datasets: [{
                    //         data: attendedDays
                    //     }]
                    // }
                } else {
                    setIsNoData(true)
                    // return {message : 'No Data Found'}
                }
            })
    }

    const generateMarkedDates = (dates) => {
        const calendar_markedDates = {};
        dates.forEach((date) => {
            setCalendar_markedDates({ ...calendar_markedDates, [date]: { selected: true, selectedColor: 'green' } })
            //   markedDates[date] = { selected: true, selectedColor: 'green' };
        });
        console.log("marked dates : " + JSON.stringify(calendar_markedDates))
        return calendar_markedDates;
    };

    return (

        <View style={styleSheet.mainContainer}>
            <View>
                <DropDown header='Select Group' setSelected={changeGroup} data={groupsId}></DropDown>
            </View>

            <View>
                {!disableSubjectOption ?
                    <DropDown header="Select Subject" setSelected={chnageSubject} data={subjects}></DropDown> : null}
            </View>

            <View style={styleSheet.buttonView}>
                <Button mode="contained" textColor="white" buttonColor={Colors.purple}
                    labelStyle={{ fontSize: 20 }} onPress={() => {
                        setIsNoData(true)
                        setAnimationSource(require('../LottieAnimations/loading.json'))
                        search(subject, false)
                        getAllSubjectResult()
                    }} >Search</Button>
            </View>

            {isNoData ?
                <View style={isNoData ? { height: 200, marginTop: 30 } : { display: 'none' }}>
                    <LottieView
                        loop
                        autoPlay
                        source={animationSource}
                        style={{ height: '100%' }}
                    ></LottieView>
                </View>
                :
                (
                    <ScrollView>
                    <View style={!isNoData ? styleSheet.progressBar : { display: "none" }}>
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
                        {!isNoData ? (<Calendar
                            markingType="multi-period"
                            firstDay={1}
                            style={{ backgroundColor: 'transparent' }}
                            enableSwipeMonths={false}
                            disableMonthChange={false}
                            theme={{
                                dayTextColor: '#2d4150',
                            }}
                            hideArrows={false}
                            markedDates={calendar_markedDates}

                        ></Calendar>) : null}
                    </View>            
                    <View>
                        <BarChart
                        data={datas}
                        yAxisLabel="%"
                        height={250}
                        fromZero
                        width={Dimensions.get('window').width}
                        style={{flex : 1,marginBottom : '25%'}}
                        chartConfig={{
                            // backgroundColor : 'white',
                            backgroundGradientFrom: 'transparent',
                            // backgroundGradientFromOpacity: 0,
                            backgroundGradientTo: "transparent",
                            backgroundGradientToOpacity: 1,
                            color: (opacity = 1, index) => {
                                if (index % 5 == 0) {
                                    //yellow
                                  return `rgba(255, 206, 86, ${opacity})`; // Tomato color for values greater than 50
                                }
                                else if(index % 2 == 0)
                                {
                                    //blue
                                    return `rgba(54, 162, 235, ${opacity})`;
                                } 
                                else if(index % 2 == 1)
                                {
                                    //green
                                    return `rgba(75, 192, 192, ${opacity})`
                                }
                                else {
                                  return `rgba(54, 162, 235, ${opacity})`; // Light blue color for values less than or equal to 50
                                }
                              },
                            strokeWidth: 20, // optional, default 3
                            barPercentage: 0.8,
                                                        useShadowColorFromDataset: false, // optional
                              fillShadowGradientOpacity : 1,
                            }}
                        //   style={{
                        //     marginVertical: 8,
                        //     borderRadius: 16,
                        //   }}
                    ></BarChart>

                        </View>

                </ScrollView>
        
                    // <View style={{flex : 1,height : '100%'}}>
                    //     <Tab.Navigator>
                    //         <Tab.Screen name="Report"
                    //             children={() => (
                    //                 <CalendarSectionTab totalDays={totalDays} calendar_markedDates={calendar_markedDates} isNoData={isNoData}
                    //                     setDisableSubjectOption={setDisableSubjectOption}
                    //                 />
                    //             )}
                    //         />

                    //         <Tab.Screen name="Visualization"
                    //             children={() => (
                    //                 <DataVisualizationTab
                    //                     groupId={groupId}
                    //                     getAllSubjectResult={getAllSubjectResult}
                    //                     setDisableSubjectOption={setDisableSubjectOption}
                    //                 />
                    //             )}
                    //         />
                    //     </Tab.Navigator>
                    // </View>
                )}
        </View>

    )
}


const DataVisualizationTab = ({ groupId, getAllSubjectResult, setDisableSubjectOption }) => {

    const isFocused = useIsFocused();
    //states
    const [isLoading, setShowLoading] = useState(false)
    // const [data, setData] = useState({
    //     labels: ['kp', 'sp', 'jp'],
    //     datasets: [
    //         {
    //             data: [30, 20, 40]
    //         }
    //     ]
    // })

    //calbacks
    const chnageShowLoading = useCallback((value) => { setShowLoading(value) }, [setShowLoading])

    useEffect(() => {
        if (isFocused) {
            // setDisableSubjectOption(true)
            chnageShowLoading(true)
            getAllSubjectResult().then((response) => {
                setData((prev) => response)
                chnageShowLoading(false)
            }).catch(() => {
                chnageShowLoading(false)
            })
        }
    }, [groupId])
    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43]
            }
        ]
    };
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };
    return (
        <View>
            {isLoading
                ?
                <View>
                    <LoadingComponent></LoadingComponent>
                </View>
                :
                // null
                <View>
                    <Button mode="contained" onPress={() => {
                        getAllSubjectResult().then((response) => {
                            setData((prev) => response)
                            chnageShowLoading(false)
                        })
                    }}>Show</Button>
                    <BarChart
                        data={data}
                        yAxisLabel="%"
                        height={200}
                        width={Dimensions.get('window').width}
                        style={{ flex: 1, margin: '5%' }}
                        chartConfig={chartConfig}
                    //   style={{
                    //     marginVertical: 8,
                    //     borderRadius: 16,
                    //   }}
                    ></BarChart>
                </View>
            }
        </View>)
}

const CalendarSectionTab = ({ isNoData, totalDays, calendar_markedDates, setDisableSubjectOption }) => {

    const isFocused = useIsFocused();


    useEffect(() => {
        if (isFocused)
            setDisableSubjectOption((prev) => false)
    }, [isFocused])

    return (
        <ScrollView>
            <View style={!isNoData ? styleSheet.progressBar : { display: "none" }}>
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
                {!isNoData ? (<Calendar
                    markingType="multi-period"
                    firstDay={1}
                    style={{ backgroundColor: 'transparent' }}
                    enableSwipeMonths={false}
                    disableMonthChange={false}
                    theme={{
                        dayTextColor: '#2d4150',
                    }}
                    hideArrows={false}
                    markedDates={calendar_markedDates}

                ></Calendar>) : null}
            </View>
        </ScrollView>
    )

}

const styleSheet = StyleSheet.create({
    mainContainer: {
        height: '100%',
        marginLeft: 15,
        marginRight: 15,
    },
    progressBar: {
        alignItems: 'center',
        marginTop: 10,
    },
    buttonView: {
        marginTop: 10,
    },
    calendarView: {
        marginBottom: '25%',
    }
})
export default ReportSection