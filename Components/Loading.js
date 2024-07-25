import React from 'react'
import { View ,Text} from 'react-native'
import LottieView from 'lottie-react-native'

export default function LoadingComponent() {
  return (
    <View style={{justifyContent : 'center'}}>
        <LottieView
            source={require('../LottieAnimations/loading.json')}
            loop
            autoPlay
            style={{height : 200}}
        ></LottieView>
    </View>
  )
}
