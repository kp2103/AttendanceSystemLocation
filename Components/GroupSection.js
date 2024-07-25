import React, { useContext, useState } from "react";
import { FlatList, Pressable, StyleSheet, View,Image, TouchableOpacity, ScrollView } from 'react-native'
import { Text,Button,Card,Avatar } from "react-native-paper";
import * as Animatable from 'react-native-animatable'
import Colors from "../Color/Colors";
import { UserInfo } from "../App";
import EmptyComponent from "./EmptyComponent";
import Share from 'react-native-share'
// import LottieView from 'lottie-react-native'
// import { TurboModuleRegistry } from "react-native";
const GroupSection = (props)=>{
    const context = useContext(UserInfo)
    const [isRefereshed,setIsRefereshed] = useState(false)
    const [groupList,setGroupList] = useState(Array.from(context.userGroupInfo))


    function share(title,message)   
    {
        Share.open({title : title ,message : message,subject : "Request To Join Group"})
        .catch((error)=>{
            console.log(error.toString())
        })
    }


    function goToCreateGroup()
    {
        props.navigation.navigate('CreateNewGroup',{
            groupList,
            setGroupList,
            setIsRefereshed
        })
    }

    function goToSearchGroup()
    {
        props.navigation.navigate('SearchGroup',{
            groupList,
            setGroupList
        })
    }

    return(
        <Animatable.View animation={'fadeInUp'}  duration={800} useNativeDriver={true}>
            <ScrollView>
            <View style={{height: '100%'}}>
                <View>
                    <Pressable>
                        <Button mode="text" style={context.userType=='Student' ?styleSheet.buttonUnVisible :styleSheet.buttonVisible } textColor={Colors.purple} labelStyle={{fontSize : 20}}
                        onPress={()=>{
                            goToCreateGroup()
                        }}
                        >Create A New Group</Button>


                        <Button mode="text" style={styleSheet.buttonStyle} labelStyle={{fontSize : 20}} textColor={Colors.purple}
                        onPress={()=>{
                            goToSearchGroup()
                        }}

                        >Search Group</Button>
                    </Pressable>
                </View>

                <View style={{height : '100%'}}>
                    <FlatList
                        scrollEnabled = {false}
                        ListEmptyComponent={<EmptyComponent/>}
                        
                        contentContainerStyle={{marginTop  : 20,flexGrow : 1,marginBottom : '25%'}}
                        // refreshing={isRefereshed}
                        ListFooterComponentStyle={{marginBottom : 60}}
                        data={groupList}
                        onRefresh={()=>{
                            setGroupList([{}])
                            setGroupList(Array.from(context.userGroupInfo))
                            setIsRefereshed(true)

                            setTimeout(() => {
                                setIsRefereshed(false)
                            }, 2000);
                        }}
                        refreshing={isRefereshed}

                        extraData={context.userGroupInfo}
                        renderItem={({item})=>{
                            return(
                            <Card mode="elevated" style={styleSheet.cardStyle}>
                                
                                <Card.Content style={{flexDirection : 'row',flex : 1,alignItems : 'center',justifyContent : 'space-between'}}>
                                    <View >
                                        <Avatar.Text color="white" label={item.name.charAt(0) + item.name.charAt(1)} 
                                        labelStyle={{fontSize:25}}
                                        style={styleSheet.cardCircleStyle} size={50}></Avatar.Text>
                                    </View>

                                    <View>
                                        <Text style={styleSheet.cardTextStyle}>{item.name}</Text>
                                        {context.userType=='Faculty'?<Text style={styleSheet.cardIdStyle}>{item.groupId}</Text>:null}
                                    </View>

                                    <View style={{alignItems : 'stretch'}}>
                                        {context.userType=='Faculty'?
                                        <TouchableOpacity onPress={()=>{share(item.name,item.groupId)}}>
                                        <Image 
                                            source={require('../Images/icons8-share-64.png')} 
                                            style={{height : 35,width : 35,marginRight : 'auto',alignSelf : 'stretch',alignItems : 'flex-end'}} 
                                        ></Image>
                                    </TouchableOpacity>
                                        :null}
                                        
                                    </View>

                                </Card.Content>
                            </Card>
                            )
                            console.info(item)
                        }}
                    >
                    </FlatList>
                </View>
                
            </View>
            </ScrollView>
        </Animatable.View>
    )
}

const styleSheet = StyleSheet.create({
    buttonVisible : {
        fontSize : 50,
    },
    buttonUnVisible : {
        display : "none",
    },
    cardStyle : {
        marginLeft : 20,
        marginRight : 20,
        marginTop : 5,
        marginBottom : 10,
        backgroundColor : 'white',
    },
    cardCircleStyle : {
        backgroundColor : Colors.purple,
    },
    cardTextStyle  : {
        color : Colors.purple,
        fontSize : 25,
        marginLeft : 10,
        alignItems: 'center'
    },
    cardIdStyle : {
        color : Colors.purple,
        fontSize : 15,
        marginLeft : 10,
    },
})


export default GroupSection
