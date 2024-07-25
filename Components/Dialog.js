import { Dialog, Portal, Provider } from 'react-native-paper'
export const Dialog = (props) => {
    <Provider>
        <View style={{ position: 'absolute', justifyContent: 'center', alignContent: 'center' }}>

            <Portal>
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>

                    <Dialog
                        style={styleSheet.dialog}
                        visible={visibleModal}
                        dismissable={false}
                        dismissableBackButton={false}
                        onDismiss={() => { setVisibleModal(false) }}
                    >
                        <Dialog.Title>
                            <Text>{props.title}</Text>
                        </Dialog.Title>

                        <Dialog.Content>
                            {/* <View style={{height : '100%'}}> */}
                            {/* <View style={styleSheet.lottieStyle}>
                <LottieView
                    style={{ height: '80%' }}
                    autoPlay
                    loop
                    source={require('../LottieAnimations/turnOnLocation.json')}
                    ></LottieView>
                </View> */}
                            {/* </View> */}
                        </Dialog.Content>

                        <Dialog.Actions>
                            <Button mode="contained" onPress={() => { setVisibleModal(false) }}>{props.okButton}</Button>
                        </Dialog.Actions>

                    </Dialog>
                </View>
            </Portal>
        </View>
    </Provider>

}