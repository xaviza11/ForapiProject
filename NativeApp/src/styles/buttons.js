import { StyleSheet } from 'react-native';

const buttons = StyleSheet.create({
    addButton: {
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'center',
        width: 20,
        borderRadius: 100,
        color: 'white',
    },
    button: {
        height: 25,
        width: 86,
        borderRadius: 24,
        justifyContent: 'center',
    },
    storePageButton: {
        flex: 0, 
        flexDirection: 'row', 
        marginTop: 2, 
        marginBottom: 2, 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    navigatePropsButton: {
        width: 20, 
        height: 20, 
        marginTop: 1,
    },
    navigateAddBasketButton: {
        flexDirection: 'row', 
        width: 80
    }
});

export default buttons;