import { StyleSheet } from 'react-native';

const containers = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerSettings: {
        flex: 1,
        alignItems: 'center',
    },
    settingsProps: {
        flex: 1,
        alignItems: 'center',
        marginTop: 40
    },
    containerHome: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 360,
        borderTopColor: 'black',
        backgroundColor: 'white'
    },
    containerBasketRequest: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center'
    },
    containerLoadingClose: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsFlex: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 200,
        marginTop: 5
    },
    containerAddToBasket: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'black',
        padding: 20,
        backgroundColor: 'white',
    },
    shadow: {
        position: 'absolute',
        top: 0,
        zIndex: 2
    },
    containerSearcher: {
        flexDirection: 'column',
        position: 'absolute',
        alignItems: 'center',
        borderWidth: 2,
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 6,
        height: 45,
        position: 'absolute',
        bottom: 0,
        zIndex: 100,
        borderTopWidth: 1,
        borderTopColor: 'gray'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: '#000',
        elevation: 10,
        height: 300,
        width: 300
    },
    sliderContainer: {
        width: 180,
        flex: 0,
        justifyContent: 'center',
        marginTop: 10,
    },
    addViewContainer: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-around',
        marginTop: 10
    },
    contentContainer: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        top: 45,
        zIndex: 10
    },
    fixedContainer: {
        position: 'absolute',
        top: '25%',
        zIndex: 100,
    }
});

export default containers;
