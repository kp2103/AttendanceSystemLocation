// import { View, Text } from 'react-native'
// import React from 'react'
import firestore from '@react-native-firebase/firestore';
import { equiRectangularDistance } from '../Components/DistanceCalculate/equiRectangularDistance'
import { euclideanDistance} from '../Components/DistanceCalculate/euclideanDistance'
import { haversineDistance } from '../Components/DistanceCalculate/haversineDistance'
import { ToastAndroid } from 'react-native';


const getScheduleInfo = async (groupId, subject) => {
  return (await firestore().collection('GroupInfo').doc(groupId).collection('ScheduleInfo').doc(subject).get()).data()
}

const compareWIFI = (mainIdentifer, identifier) => {
  if (mainIdentifer.bssid == identifier.bssid && mainIdentifer.ssid == identifier.ssid) {
    return true
  }
  return false
}

const compareLocation = async(mainIdentifer, identifier, radius) => {


  const R = 6371000; // Earth's radius in meters

  const distanceInMeters = radius; // Replace with the desired distance in meters

  const latitude = mainIdentifer.latitude;
  const longitude = mainIdentifer.longitude;

  // Convert latitude to radians
  const latitudeInRadians = latitude * (Math.PI / 180);

  // Calculate latitude and longitude offsets
  const latitudeOffset = distanceInMeters / R * (180 / Math.PI);
  const longitudeOffset = distanceInMeters / (R * Math.cos(latitudeInRadians)) * (180 / Math.PI);

  // Calculate min and max latitude and longitude
  const minLatitude = latitude - latitudeOffset;
  const maxLatitude = latitude + latitudeOffset;
  const minLongitude = longitude - longitudeOffset;
  const maxLongitude = longitude + longitudeOffset;



  // latitude is vary about 0.0014  longitude is vary 0.000039/0.000899
    // const minLatitude = mainIdentifer.latitude - 0.000039
    // const maxLatitude = mainIdentifer.latitude + 0.000899

    // const minLongitude = mainIdentifer.longitude - 0.000025
    // const maxLongitude = mainIdentifer.longitude + 0.000025
    console.info("Main identifier : " + JSON.stringify(mainIdentifer))
    console.info("User identifier : " + JSON.stringify(identifier))
    console.log((identifier.latitude > minLatitude && identifier.latitude < maxLatitude))
    console.log((identifier.longitude > minLongitude && identifier.longitude < maxLongitude))

  if ((identifier.latitude >= minLatitude && identifier.latitude <= maxLatitude) && (identifier.longitude >= minLongitude && identifier.longitude <= maxLongitude)) {
    console.info(identifier)
    console.info(mainIdentifer)
    return true
  }

  return false
}

const compareIdentifier = async (scheduleInfo, identifier) => {
  try {
    if (scheduleInfo.indetifierType == 'WIFI') {
      return compareWIFI(scheduleInfo.identifier, identifier)
    }
    else {
      const { latitude, longitude } = scheduleInfo.identifier
      console.log(latitude + ' ' + longitude)
      console.log('user : ' + identifier.latitude + ' ' + identifier.longitude)
      const distance  = await equiRectangularDistance(parseFloat(latitude),parseFloat(longitude),parseFloat(identifier.latitude),parseFloat(identifier.longitude))
      // const distance  = await equiRectangularDistance(parseFloat(latitude),parseFloat(longitude),23.0857324,72.5522523)

      console.log('distance : ' + distance)
      ToastAndroid.show('Distance : ' + distance,ToastAndroid.SHORT)
      if(parseInt(distance)<=scheduleInfo.radius)
        return true
      return false
      // return await compareLocation(scheduleInfo.identifier, identifier, scheduleInfo.radius)
    }
  }
  catch (error) {
    console.log(error)
  }
}

const giveAttendance = async (user, groupId, subject, identifier) => {
  const scheduleInfo = await getScheduleInfo(groupId, subject)
  if (await compareIdentifier(scheduleInfo, identifier)) {
    console.log('verified')
    // console.info('verified')        
    return true
  }
  else {
    console.log('could not uniquely identify indetifier')
    ToastAndroid.show('could not uniquely identify indetifier', ToastAndroid.SHORT);
    return false
  }
}

export { giveAttendance };