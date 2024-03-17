import log from '../utils/coolog';
import React, { useState } from 'react';
import {Text, View, TouchableOpacity } from 'react-native';
import newOrder from '../middlewares/newOrder';
import secretPassGen from '../utils/secretPassGen';
import { useNavigation } from '@react-navigation/native';
import retrieveItem from '../utils/storage.retrieveItem.native';
import saveItem from '../utils/storage.saveItem.native';
import { Linking } from 'react-native';
import ImageCache from '../components/ImageCache'
import Button from '../components/Button'
import {toggleAlert } from '../actions/actions';
import CustomAlert from '../components/CustomAlert';

import { useDispatch, useSelector } from 'react-redux';
import containers from '../styles/containers';

const BasketRequest = () => {

    log.pc('<--- BasketRequest --->')

    const language = useSelector((state: any) => state.language)
    const host = useSelector((state: any) => state.host)
    const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
    const windowHeight = useSelector((state: {windowHeight:number}) => state.windowHeight)
    const windowWidth = useSelector((state: {windowWidth:number}) => state.windowWidth)
    const basketItems = useSelector((state: any) => state.basketItems)
    const isAlertOpen = useSelector((state: {isAlertOpen:boolean}) => state.isAlertOpen)

    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const openWhatsapp = (phone: any) => {

        log.info('BasketRequest -> openWhatsapp')

        const url = `whatsapp://send?phone=${phone}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    setStatus('warn')
                    setMessage(language.whatsappNotOpen)
                    dispatch(toggleAlert(true))
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(() => {setStatus('warn')
            setMessage(language.errorAtOpenWhatsapp)
            dispatch(toggleAlert(true))});
    };

    const handlerCreateNewOrder = async () => {

        log.info('BasketRequest -> createNewOrder')

        if (basketItems === undefined) return

        const retrieveToken = await retrieveItem('token')
        const retrieveEmail = await retrieveItem('email')
        const retrieveName = await retrieveItem('name')
        const secretPass = secretPassGen(retrieveToken, retrieveEmail)

        const date = new Date()

        const currentYear = date.getFullYear();
        const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
        const currentDay = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        let formattedDate = `${currentYear}-${currentMonth}-${currentDay}T${hours}:${minutes}`;
        const formattedDateA = formattedDate.replace('T', ' ');

        try {
            const storeId = basketItems[0].soldBy
            const deadLine = `${currentDay}/${currentMonth}/${currentYear}`;
            newOrder(retrieveToken, storeId, { author: retrieveName, message: '', date: formattedDateA }, basketItems, 'none', host, secretPass, language, deadLine)
                .then((response) => {
                    saveItem('token', response.token)
                    openWhatsapp(response.storePhone)
                    setStatus('ok')
                    setMessage(language.newChatCreated)
                    dispatch(toggleAlert(true))
                })
                .catch(error => {
                    if (error === 'jwt expired') {
                        setStatus('error')
                        setMessage(language.sessionExpired)
                        dispatch(toggleAlert(true))
                    } else {
                        setStatus('warn')
                        setMessage(error)
                        dispatch(toggleAlert(true))
                    }
                })
    } catch (error) {
            setStatus('warn')
            setMessage(error.message)
            dispatch(toggleAlert(true))
        }
    }

    return (
        <View style={{ width: windowWidth, height: windowHeight, zIndex: 2 }}>
            <View style={[containers.containerBasketRequest, { width: windowWidth, height: windowHeight, backgroundColor: colorScheme === 'light' ? 'white' : 'gray', padding: 20 }]}>
            <View style={containers.fixedContainer}>
                {isAlertOpen && <CustomAlert message={message} status={status} />}
            </View>

                <Text style={{ fontFamily: 'MontserratBold', fontSize: 15 }}>{basketItems[0].storeName}</Text>
                <View style={{ marginTop: 20 }}>
                    <ImageCache uri={basketItems[0].storeImage} width={120} height={120} radius={100}></ImageCache>
                </View>
                <View style={{justifyContent: 'center', alignContent: 'center', height: 140 }}>
                    <Text style={{ fontFamily: 'Montserrat', textAlign: 'center' }}>{language.openWhatsappMessage}</Text>
                    <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: 'MontserratBold', fontSize: 15 }}>{language.askWhatsapp}</Text>
                </View>

                <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => handlerCreateNewOrder()}>
                    <Button title={language.send} colorDark='white' colorLight='white' backgroundColorDark='green' backgroundColorLight='green'></Button>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => navigation.navigate('Basket' as never)}>
                    <Button title={language.exit} colorDark='white' colorLight='white' backgroundColorDark='rgb(60, 60, 60)' backgroundColorLight='rgb(60, 60, 60)'></Button>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BasketRequest;
