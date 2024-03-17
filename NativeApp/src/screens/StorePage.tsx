import log from '../utils/coolog'
import React, {useState } from 'react';
import {Text, View, Pressable, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Linking } from 'react-native';
import ImageCache from '../components/ImageCache';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import CustomAlert from '../components/CustomAlert';

import { toggleAlert } from '../actions/actions';


import containers from '../styles/containers';

const StorePage = () => {

    log.pc('<--- StorePage --->')

    const dispatch = useDispatch()

    const navigation = useNavigation()

    const language = useSelector((state: any) => state.language)
    const colorScheme = useSelector((state: {colorScheme: string}) => state.colorScheme)
    const windowHeight = useSelector((state: {windowHeight:number}) => state.windowHeight)
    const windowWidth = useSelector((state: {windowWidth:number}) => state.windowWidth)
    const selectedStore = useSelector((state: any) => state.storeSelected[0])
    const isAlertOpen = useSelector((state: {isAlertOpen: boolean}) => state.isAlertOpen)

    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<string>('') 

    const handlerOpenMaps = async (adress: string) => {
        try {
            log.info('InfoScreen -> handlerOpenMaps')
            await Linking.openURL('https://www.google.es/maps/search/' + adress)
                .catch(err => console.error(language.openLinkError, err));
        } catch (error) {
            setStatus('warn')
            setMessage(language.errorOnMaps)
            dispatch(toggleAlert(true))
        }
    }

    const openGmail = async (destiny: string) => {
        try {
            log.info('InfoScreen -> openGmail')
            const uri = `mailto:${destiny}`;
            await Linking.openURL(uri)
                .catch(err => console.error(language.errorOpenMailApp, err));
        } catch (error) {
            setStatus('warn')
            setMessage(language.errorOnEmail)
            dispatch(toggleAlert(true))
        }
    };

    const openPhone = async (phone: string) => {
        log.info('InfoScreen -> openPhone')
        try {
            const uri = `tel:${phone}`
            await Linking.openURL(uri)
                .catch(err => console.error(language.phone, err));
        } catch (error) {
            setStatus('warn')
            setMessage(language.errorOnPhone)
            dispatch(toggleAlert(true))
        }
    }

    const openStore = async (link: string) => {
        try {
            log.info('InfoScreen -> openStore')
            const uri = `${link}`
            await Linking.openURL(uri)
                .catch(err => console.error(language.openLinkError, err));
        } catch (error) {
            setStatus('warn')
            setMessage(language.errorOnNavigator)
            dispatch(toggleAlert(true))
        }
    }

    return (<View style={{ width: windowWidth, height: windowHeight, backgroundColor: colorScheme === 'light' ? 'white' : 'black' }}>
        <Text style={{ zIndex: 100, position: 'absolute', top: 0, color: 'white', backgroundColor: colorScheme === 'light' ? 'black' : 'gray', width: windowWidth, fontFamily: 'GreatVibes', fontSize: 35, textAlign: 'center' }}>{language.storeTitle}</Text>
        {selectedStore !== undefined &&
            <View style={[containers.container, {marginTop: 20, backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
                <View style={{
                    position: 'absolute',
                    top: '25%',
                    zIndex: 100,
                }}>
                    {isAlertOpen && <CustomAlert message={message} status={status} />}
                </View>
                <View style={[{ flex: 0, flexDirection: 'column', alignItems: 'center', justifyContent: "space-between", width: 240 }]}>
                    <Text style={[{ margin: 0, fontFamily: 'MontserratBold', color: colorScheme === 'light' ? 'black' : 'white' }]}>{selectedStore.name}</Text>
                    <Text style={{ fontFamily: 'MontserratBold', marginBottom: 4, color: colorScheme === 'light' ? 'black' : 'white' }}>{selectedStore.rating}⭐Google</Text>
                    <Text style={{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white' }}>{selectedStore.totalReviews} {language.googleReviews}</Text>
                </View>
                <View style={{ width: 150, height: 150, marginRight: 6, marginTop: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <ImageCache uri={selectedStore.image} width={150} height={150} radius={100} ></ImageCache>
                </View>
                <View style={[{ flex: 0, flexDirection: "row", marginTop: 40 }]}>
                    <Text style={{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white' }}>{selectedStore.city}</Text>
                </View>
                <View style={[{ flex: 0, flexDirection: "row", justifyContent: "space-between", width: 150, marginTop: 15 }]}>
                    <Pressable onPress={() => openGmail(selectedStore.email)}><Text style={[{ height: 20 }]}>✉️</Text></Pressable>
                    <Pressable onPress={() => openPhone(selectedStore.phone)}><Text style={[{ height: 20 }]}>📞</Text></Pressable>
                    <Pressable onPress={() => openStore(selectedStore.webSide)}><Text style={[{ height: 20 }]}>🌐</Text></Pressable>
                    <Pressable onPress={() => handlerOpenMaps(selectedStore.adress)}><Text style={[{ height: 20 }]}>📍</Text></Pressable>
                </View>
                <TouchableOpacity style={{ marginBottom: 20, marginTop: 20 }} onPress={() => navigation.navigate('Home' as never)}>
                    <Button title={language.exit} colorDark='white' colorLight='white' backgroundColorDark='rgb(60, 60, 60)' backgroundColorLight='rgb(60, 60, 60)'></Button>
                </TouchableOpacity>
            </View>
        }
    </View>
    )
};

export default StorePage;