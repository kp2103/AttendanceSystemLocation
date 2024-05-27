import { View, Text } from 'react-native'
import React from 'react'
import firestore from '@react-native-firebase/firestore';

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

const compareLocation = (mainIdentifer,identifier)=>{
          // latitude is vary about 0.0014  longitude is vary 0.000039/0.000899
        const minLatitude = mainIdentifer.latitude - 0.0014
        const maxLatitude = mainIdentifer.latitude + 0.0014

        const minLongitude = mainIdentifer.longitude - 0.000899
        const maxLongitude = mainIdentifer.longitude + 0.000899

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

const compareIdentifier = (scheduleInfo,identifier)=>{
     try{
       if(scheduleInfo.indetifierType=='WIFI')
       {
          return compareWIFI(scheduleInfo.identifier,identifier)
       }
       else{
          return compareLocation(scheduleInfo.identifier,identifier)
       }
     }
     catch(error)
     {
        console.log(error)
     }
}

const giveAttendance = async(user,groupId,subject,identifier)=>{
    const scheduleInfo = await getScheduleInfo(groupId,subject)
    if(compareIdentifier(scheduleInfo,identifier))
    {
        console.info('verified')        
        return true
    }
    else{
      console.log('could not uniquely identify indetifier')
      return false
    }
}

export {giveAttendance};