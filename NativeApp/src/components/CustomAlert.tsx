import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';
import { toggleAlert } from '../actions/actions';
import { useNavigation } from '@react-navigation/native';
import log from '../utils/coolog';
import containers from '../styles/containers';
import texts from '../styles/texts';

const CustomAlert = (props: { message: any, status: string }) => {

    log.pc('<--- CustomAlert --->')

    const { message, status } = props;
    const language = useSelector((state: any) => state.language)

    const dispatch = useDispatch()
    const navigation = useNavigation()

    if (status === 'error') {
        setTimeout(() => {
            navigation.navigate('CloseApp' as never)
        }, 2000)
    }

    const closeAlert = () => {

        log.info('CustomAlert -> closeAlert')

        if(status === 'error') navigation.navigate('CloseApp' as never)
        dispatch(toggleAlert(false))
    }

    return (
        <View style={containers.container}>
            {status === 'ok' &&
                <View style={containers.modalView}>
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/cheque.png')}></Image>
                    <Text style={texts.textCustomAlert}>{message}</Text>
                    <View style={{justifyContent: 'space-around',}}>
                        <TouchableOpacity onPress={() => closeAlert()}>
                            <Button title={language.exit} colorLight={'white'} colorDark={'white'} backgroundColorLight={'green'} backgroundColorDark={'green'}></Button>
                        </TouchableOpacity>
                    </View>
                </View>}
            {status === 'warn' &&
                <View style={containers.modalView}>
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/peligro.png')}></Image>
                    <Text style={texts.textCustomAlert}>{message}</Text>
                    <View style={{justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={() => closeAlert()}>
                            <Button title={language.exit} colorLight={'white'} colorDark={'white'} backgroundColorLight={'orange'} backgroundColorDark={'orange'}></Button>
                        </TouchableOpacity>
                    </View>
                </View>}
            {status === 'error' &&
                <View style={containers.modalView}>
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/cerrar.png')}></Image>
                    <Text style={texts.textCustomAlert}>{message}</Text>
                    <View style={{justifyContent: 'space-around',}}>
                        <TouchableOpacity onPress={() => closeAlert()}>
                            <Button title={language.exit} colorLight={'white'} colorDark={'white'} backgroundColorLight={'red'} backgroundColorDark={'red'}></Button>
                        </TouchableOpacity>
                        <Text style={texts.underButton}>Closing App...</Text>
                    </View>
                </View>}
        </View>
    );
};

export default CustomAlert;
