import React ,{useContext} from "react";
import {StyleSheet,View,Text, Image} from 'react-native'
import { Avatar, RadioButton } from 'react-native-paper'
//    "react-native-gesture-handler": "^2.13.4",
//        "react-native-reanimated": "^3.5.4",
import { UserInfo } from "../App";
import * as Animatable from 'react-native-animatable'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
// import { Icon } from "react-native-vector-icons/Icon";
// import { View } from "react-native-reanimated/lib/typescript/Animated";

const DrawerContent = (props)=>{
    const context = useContext(UserInfo)
    return(
        
        <DrawerContentScrollView style={{flex:1,backgroundColor:'rgb(100,100,100)',opacity:0.7}}>
            <Animatable.View animation={'fadeIn'} duration={1000}>
            <View style={styleSheet.header}>
                <Avatar.Text style={styleSheet.avatarText} label={context.name.toUpperCase().charAt(0)}
                    size={68} 
                ></Avatar.Text>
                <Text style={{fontSize:33,marginLeft : 10,color:'dodgerblue',marginBottom:10}}>{context.name}</Text>
            </View>
            
            <View style={styleSheet.body}>  
                <DrawerItem  allowFontScaling={true}
                    labelStyle={{fontSize:18,color:'dodgerblue'}}
                    style={styleSheet.drawerItem}
                    pressColor="dodgerblue"
                    activeBackgroundColor="dodgerblue"
                    label={'Home'} onPress={()=>{
                        props.navigation.navigate('BottomLayout')
                    }}
                    icon={(focused,size)=>{
                        return <Image source={require('../Images/icons8-home-48.png')} style={focused ? styleSheet.iconFocused  : styleSheet.iconUnFocused}></Image>
                    }}
                ></DrawerItem>
                <DrawerItem 
                    pressColor="dodgerblue"
                    labelStyle={{fontSize:18,color:'dodgerblue'}}
                    style={styleSheet.drawerItem}
                    activeBackgroundColor="dodgerblue"
                    label={'SignUp'} onPress={()=>{
                        props.navigation.navigate('SignUp')
                    }}
                // icon={(focused,size)=><Icon name="notification" size={size} color={focused ? '#7cc' :  "#ccc"}></Icon>}
                ></DrawerItem>
            </View>
            </Animatable.View>
        </DrawerContentScrollView>
    )
}

const styleSheet = StyleSheet.create({
    drawerHeader :{

    },
    avatarText : {
        margin : 10,
        backgroundColor : 'dodgerblue'
    },
    header:{
        backgroundColor:'floralwhite',
        border:'solid',
        borderRadius:20,
        margin:8
    },
    body:{
        backgroundColor:'white',
        border:'solid',
        borderRadius:20,
        margin:8
    },
    drawerItem : {
        backgroundColor:'white',
        border:'solid',
        borderRadius:20, 
        padding:0
    },
    iconFocused  :{
        height : 45,
        width : 45,
    },
    iconUnFocused :{
        height : 28,
        width  : 28,
    }
})

export default DrawerContent
