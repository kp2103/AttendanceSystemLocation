import React from "react";
import {} from 'react-native'
import firestore from '@react-native-firebase/firestore'
const GroupInfo = (groupId)=>{
    const groupReference = firestore().collection('GroupInfo').doc(groupId)
    return groupReference
}

export default GroupInfo