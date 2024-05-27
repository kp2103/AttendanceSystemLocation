import React from 'react'
import firestore from '@react-native-firebase/firestore'


const UserData = async (userId)=>{
    try
    {
        let document =  firestore().collection("UserInfo").doc(userId).get()
        return document
    }
    catch(e)
    {
        console.log("Sorry")
    }
}
const UserReference = (userId)=>{
    return (firestore().collection("UserInfo").doc(userId))
}
export default UserData