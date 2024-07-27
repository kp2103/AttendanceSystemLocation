import { useState } from 'react'
import { Snackbar} from 'react-native-paper'
import Colors from '../Color/Colors'
import { StyleSheet } from 'react-native'

export const BottomInfo = ({visible,info})=>{
    // const [visible,setVisible] = useState()
    return(
        <View style={styleSheet.mainContainer}>
            <Snackbar
                visible={visible}
                duration={3000}
                style={{backgroundColor : 'white'}}
                rippleColor={Colors.purple}
            >{info}</Snackbar>
        </View>
    )
}

const styleSheet = StyleSheet.create({
    mainContainer : {
        flex : 1,
    },
    snackbarStyle : {

    }
})