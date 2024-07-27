// import { View, Text } from 'react-native'
// import React from 'react'
import firestore from '@react-native-firebase/firestore';
import { equiRectangularDistance } from '../Components/DistanceCalculate/equiRectangularDistance'
import {} from '../Components/DistanceCalculate/euclideanDistance'
import {haversineDistance } from '../Components/DistanceCalculate/haversineDistance'
 
const getScheduleInfo = async(groupId,subject)=>{
    return (await firestore().collection('GroupInfo').doc(groupId).collection('ScheduleInfo').doc(subject).get()).data()
}

const compareWIFI = (mainIdentifer,identifier)=>{
      if(mainIdentifer.bssid==identifier.bssid && mainIdentifer.ssid==identifier.ssid)
      {
        return true
      }
      return false  
} 

const compareLocation = (mainIdentifer,identifier,radius)=>{
          // latitude is vary about 0.0014  longitude is vary 0.000039/0.000899
        const minLatitude = mainIdentifer.latitude - 0.000018
        const maxLatitude = mainIdentifer.latitude + 0.000018
  
        const minLongitude = mainIdentifer.longitude - 0.000025
        const maxLongitude = mainIdentifer.longitude + 0.000025

        if((identifier.latitude>minLatitude && identifier.latitude<maxLatitude) && (identifier.longitude>minLongitude && identifier.longitude<maxLongitude))
        {
          console.info(identifier)
          console.info(mainIdentifer)
          return true
        }
        console.info(identifier)
        console.info(mainIdentifer)
        console.log((identifier.latitude>minLatitude && identifier.latitude<maxLatitude))
        console.log((identifier.longitude>minLongitude && identifier.longitude<maxLongitude)
        )
       
        return false
}

const compareIdentifier = async(scheduleInfo,identifier)=>{
     try{
       if(scheduleInfo.indetifierType=='WIFI')
       {
          return compareWIFI(scheduleInfo.identifier,identifier)
       }
       else{
         const {latitude,longitude} = scheduleInfo.identifier
         console.log(latitude + ' ' + longitude)
         console.log('user : ' +identifier.latitude + ' ' + identifier.longitude)
          // const distance  = await haversineDistance(latitude,longitude,identifier.latitude,identifier.longitude)
          // console.log('distance : ' + distance)
          // if(distance<=scheduleInfo.radius)
          //   return true
          // return false
          return compareLocation(scheduleInfo.identifier,identifier,scheduleInfo.radius)
       }
     }
     catch(error)
     {
        console.log(error)
     }
}

const giveAttendance = async(user,groupId,subject,identifier)=>{
    const scheduleInfo = await getScheduleInfo(groupId,subject)
    if(await compareIdentifier(scheduleInfo,identifier))
    {
        console.log('verified')
        // console.info('verified')        
        return true
    }
    else{
      console.log('could not uniquely identify indetifier')
      return false
    }
}

export {giveAttendance};