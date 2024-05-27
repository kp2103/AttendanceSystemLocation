import React  from "react";
import { Image, StyleSheet ,View} from 'react-native'
import {Button, Text} from 'react-native-paper'
import LottieView from "lottie-react-native";


const SplashScreen = (props)=>{
    setTimeout(()=>{
        props.navigation.replace('Login')
    },3000)    
    return(
        <View style={{height:'100%',backgroundColor:'dodgerblue',justifyContent:"center"}}>
        
        <View style={{height:'60%',marginLeft:60,marginRight:60}}>
            <LottieView
                // speed={0.7}
                source={require('../LottieAnimations/logo_type.json')}
                loop
                autoPlay
                style={{flex:2,width:"100%"}}
            >

            </LottieView>
        </View>
        <View> 
            <Text style={{textAlign: "center",color:'white',fontSize:40}}>Online Attendance System</Text>
        </View>
        </View>
    )
}

const style = StyleSheet.create({

    imagest:{
        height : undefined,
        width : "100%",
        aspectRatio : 2,
    }

    }
    )

export default SplashScreen
