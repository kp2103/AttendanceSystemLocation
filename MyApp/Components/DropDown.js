import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { memo, useState } from 'react'

const DropDown = (props) => {

    const [isOpen, setIsOpen] = useState(false)
    const [selectedData, setSelectedData] = useState("")

    return (
        <View >
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' ,width : '100%'}} onPress={() => { setIsOpen(!isOpen) }}>

                <View style={styleSheet.header}>
                    <Text style={{fontSize : 18}}>{selectedData.length > 0 ? selectedData : props.header}</Text>
                    <Image style={styleSheet.image} source={isOpen ? require('../Images/icons8-collapse-arrow-50.png') : require('../Images/icons8-down-arrow-50.png')}></Image>

                </View>
            </TouchableOpacity>

            <View style={isOpen ? styleSheet.container : styleSheet.unVisibleContainer}>
                <FlatList
                    style={styleSheet.flatlist}
                    // scrollEnabled
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    data={props.data}
                    renderItem={({ item }) => {
                        return (
                                <Text style={styleSheet.items}
                                    onPress={() => {
                                        setSelectedData(item)
                                        props.setSelected(item)
                                        setIsOpen(false)
                                    }}
                                >{item}</Text>
                        )
                    }}
                ></FlatList>
            </View>
        </View>
    )
}

const styleSheet = StyleSheet.create({
    header: {
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        width : '100%',
        flexDirection : 'row',
        paddingLeft : '5%',
        paddingRight : '5%',
        fontWeight  : 'bold',
        marginTop   : 10
    },
    image: {
        height: 20,
        width: 20,
    },
    visibleContainer: {
        borderBottomWidth: 1,
        margin: '5%',
        height: '40%',
        width: '80%',
        borderWidth: 1,
    },
    items: {
        marginLeft: '5%',
        height: 40,
        textAlign : 'center',
        fontSize : 20,
        marginRight: '5%',
        borderBottomWidth : 0.5,
    },
    unVisibleContainer: {
        display: 'none',
    },
    flatlist : {
        height : 150,
    }
})

export default memo(DropDown)