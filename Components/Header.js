import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserInfo } from "../App";
import {Avatar} from 'react-native-paper'

const Header = (props)=>{
    const context = useContext(UserInfo)
    return(
        <View style={{}}>
            <View style={{marginLeft:8,marginTop:10}}>
                <Avatar.Text  label={context.name.toUpperCase().charAt(0)} 
                    color="white" style={{backgroundColor:'dodgerblue'}}
                    size={38} onTouchStart={()=>{
                        props.navigation.openDrawer()
                    }}></Avatar.Text>
            </View>
        </View>
    )
}
export default Header