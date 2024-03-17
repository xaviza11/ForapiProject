import log from '../utils/coolog'
import { Text, Pressable, View, Image, ScrollView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import saveItem from '../utils/storage.saveItem.native';
import secretPassGen from '../utils/secretPassGen';
import retrieveItem from '../utils/storage.retrieveItem.native';
import { Dimensions } from 'react-native';

import Menu from '../components/Menu';
import ImageCache from '../components/ImageCache';
import Likes from '../components/Likes';
import Carousel from '../components/Carousel'
import Searcher from '../components/Searcher'

import retrieveUser from '../middlewares/retrieveUser';
import createRandomSearch from '../middlewares/createRandomSearch';
import retrieveSearch from '../middlewares/retrieveSearch';

import { useDispatch, useSelector } from 'react-redux';
import { setUser, setWindowWidth, setWindowHeight, pushContentList, selectItem, selectStore, selectProps, toggleAlert, isRetrieveLikes } from '../actions/actions';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';

import containers from '../styles/containers';
import texts from '../styles/texts'
import buttons from '../styles/buttons';

const Home = () => {

    log.pc('<--- Home --->')

    const [items, setItems] = useState<{ furniture?: any }>()
    const [numberLoads, setNumberLoads] = useState<number>(0)
    const [searchIndex, setSearchIndex] = useState<number>(0)
    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const contentList = useSelector((state: any) => state.contentList)

    const scrollViewRef = useRef(null);

    const language = useSelector((state: any) => state.language)
    const host = useSelector((state: {host:string}) => state.host)
    const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
    const user = useSelector((state: any) => state.user)
    const windowWidth = useSelector((state: {windowWidth:number}) => state.windowWidth)
    const windowHeight = useSelector((state: {windowHeight:number}) => state.windowHeight)
    const isOnSearcher = useSelector((state: {isOnSearcher:boolean}) => state.isOnSearcher)
    const isAlertOpen = useSelector((state: {isAlertOpen:boolean}) => state.isAlertOpen)

    const dispatch = useDispatch()
    const navigation = useNavigation()

    if (windowWidth === 0) {
        const newWindowWidth = Dimensions.get('window').width;
        dispatch(setWindowWidth(newWindowWidth))
    }

    if (windowHeight === 0) {
        const newWindowHeight = Dimensions.get('window').height;
        dispatch(setWindowHeight(newWindowHeight))
    }

    useEffect(() => {
        if (Object.keys(user).length === 0) {
            handlerRetrieveUser();
        }
        if (!items) handlerCreateRandomSearch()
        else drawContent(items)
    }, [items])

    const handlerRetrieveUser = async () => {

        log.info('Home -> handlerRetrieveUser')

        const retrieveToken = await retrieveItem('token')
        const retrieveEmail = await retrieveItem('email')
        const secretPass = secretPassGen(retrieveToken, retrieveEmail)

        try {
            retrieveUser(retrieveToken, language, host, secretPass)
                .then(result => {
                    if (result.user.isBanned) {
                        setStatus('error')
                        setMessage('user is banned')
                        dispatch(toggleAlert(true))
                    }
                    else {
                        saveItem('token', result.token);
                        saveItem('basket', result.user.basketId)

                        const {  user: { basketId, ...userWithoutSensitiveData } } = result;
                        dispatch(setUser(userWithoutSensitiveData));
                    }
                })
        } catch (error) {
            setStatus('warn')
            setMessage(error.message)
            dispatch(toggleAlert(true))
        }
    }

    const handlerCreateRandomSearch = async () => {
        log.info('Home -> handlerCreateRandomSearch')

        try {
            const retrieveToken = await retrieveItem('token')
            const retrieveEmail = await retrieveItem('email')
            const secretPass = secretPassGen(retrieveToken, retrieveEmail)
            const locationLat = await retrieveItem('locationLat')
            const locationLon = await retrieveItem('locationLon')

            if (locationLat === null || locationLon === null) return

            createRandomSearch(retrieveToken, locationLat, locationLon, language, host, secretPass)
                .then(response => handlerRetrieveSearch(response))
                .catch(error => {
                    setStatus('warn')
                    setMessage(error)
                    dispatch(toggleAlert(true))
                })
        } catch (error) {
            setStatus('warn')
            setMessage(error.message)
            dispatch(toggleAlert(true))
        }
    }

    const handlerRetrieveSearch = async (response: { search: string, collection: string }) => {

        log.info('Home -> handlerRetrieveSearch')

        const retrieveToken = await retrieveItem('token')
        const retrieveEmail = await retrieveItem('email')
        const secretPass = secretPassGen(retrieveToken, retrieveEmail)
        const locationLat = await retrieveItem('locationLat')
        const locationLon = await retrieveItem('locationLon')
        const id = response.search
        const collection = response.collection

        if (locationLat === null || locationLon === null) return

        try {
            retrieveSearch(retrieveToken, id, language, host, collection, secretPass)
                .then(result => {
                    setNumberLoads(0)
                    dispatch(isRetrieveLikes(false))
                    handlerSetFurnitureList(result)
                })
                .catch(error => {
                    setStatus('warn')
                    setMessage(error)
                    dispatch(toggleAlert(true))
                })
        } catch (error) {
            setStatus('warn')
            setMessage(error.message)
            dispatch(toggleAlert(true))
        }
    }

    const handlerSetFurnitureList = (items: {}) => {
        log.info('Home -> handlerSetFurnitureList')
        setItems(items)
    }

    const navigateAddBasket = (value: any) => {
        log.navigate('Home -> navigateAddBasket')

        dispatch(selectItem(value))
        navigation.navigate('AddToBasket' as never)
    }

    const navigateStorePage = async (value: any) => {
        log.navigate('Home -> navigateStorePage')

        dispatch(selectStore(value))
        navigation.navigate('StorePage' as never)
    }

    const navigateProps = (value: any) => {
        log.navigate('Home -> navigateProps')

        dispatch(selectProps(value))
        navigation.navigate('Props' as never)
    }

    const handlerDisplayLikes = (result: { token: string, furniture: [] }) => {
        log.info('Home -> handlerDisplayLikes')
        setNumberLoads(0)
        handlerSetFurnitureList({ furniture: result.furniture })
    }

    const drawContent = (items: any) => {

        log.info('Home -> drawContent')

        if (items.furniture[numberLoads]) {
            if (items.furniture[numberLoads] && items.furniture[numberLoads + 1]) {
                const newContent = <View style={[containers.containerHome, { backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
                    <View style={[containers.contentContainer, { width: windowWidth - 10 }]}>
                        <Text style={texts.contentText}></Text>
                    </View>
                    <View style={[{ height: windowWidth, width: windowWidth }]}>
                        <Carousel img={items.furniture[numberLoads].img}></Carousel>
                    </View>
                    <Pressable onPress={() => navigateStorePage(items.furniture[numberLoads].storeInfo)} hitSlop={{ top: 40, bottom: 40, left: 100, right: 100 }} style={[buttons.storePageButton, { width: windowWidth - 10 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ImageCache uri={items.furniture[numberLoads].storeInfo[0].image} width={25} height={25} radius={100}></ImageCache>
                            <Text style={[{ color: colorScheme === 'light' ? 'black' : 'white', fontFamily: 'MontserratBold', fontSize: 14, marginLeft: 2 }]}>{items.furniture[numberLoads].storeInfo[0].name}</Text>
                        </View>
                        <Text style={{ color: colorScheme === 'light' ? 'black' : 'white', fontWeight: 'bold', fontSize: 14 }}>{items.furniture[numberLoads].storeInfo[0].rating}⭐</Text>
                    </Pressable>
                    <View style={[{ backgroundColor: colorScheme === 'light' ? 'white' : 'black', flex: 1, flexDirection: 'row', width: windowWidth - 20, justifyContent: 'space-evenly', marginTop: 1 }]}>
                        <Likes furnitureId={items.furniture[numberLoads]._id} collection={items.furniture[numberLoads].collectionName} numberLikes={items.furniture[numberLoads].numberLikes}></Likes>

                        <Pressable onPress={() => navigateProps(items.furniture[numberLoads])}>
                            {colorScheme === 'light' && <Image source={require('../../assets/info.png')} style={[buttons.navigatePropsButton]} />}{colorScheme === 'dark' && <Image source={require('../../assets/info-white.png')} style={[buttons.navigatePropsButton]} />}</Pressable>
                    </View>
                    <View style={[{ width: windowWidth - 20, height: 45, }]}>
                        <Text style={[{ fontFamily: 'MontserratBold', color: colorScheme === 'light' ? 'black' : 'white' }]}>{items.furniture[numberLoads].title}</Text>
                        <Text style={{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white' }}>{items.furniture[numberLoads].description}</Text>
                    </View>
                    <Pressable style={buttons.navigateAddBasketButton } onPress={() => navigateAddBasket(items.furniture[numberLoads])}><Text style={ texts.navigateAddBasket }>{items.furniture[numberLoads].price}{items.furniture[numberLoads].currency}</Text>
                        <Image source={require('../../assets/carrito-de-compras-green.png')} style={[{ width: 20, height: 20, marginBottom: 66 }]} /></Pressable>
                </View>

                const newContentB = <View style={[containers.containerHome, { backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
                    <View style={[containers.contentContainer, { width: windowWidth - 10 }]}>
                        <Text style={texts.contentText}></Text>
                    </View>
                    <View style={[{ height: windowWidth, width: windowWidth }]}>
                        <Carousel img={items.furniture[numberLoads + 1].img}></Carousel>
                    </View>
                    <Pressable hitSlop={{ top: 40, bottom: 40, left: 100, right: 100 }} style={[buttons.storePageButton, { width: windowWidth - 10 }]} onPress={() => navigateStorePage(items.furniture[numberLoads + 1].storeInfo)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ImageCache uri={items.furniture[numberLoads + 1].storeInfo[0].image} width={25} height={25} radius={100}></ImageCache>
                            <Text style={[{ color: colorScheme === 'light' ? 'black' : 'white', fontFamily: 'MontserratBold', fontSize: 14, marginLeft: 2 }]}>{items.furniture[numberLoads + 1].storeInfo[0].name}</Text>
                        </View>
                        <Text style={{ color: colorScheme === 'light' ? 'black' : 'white', fontWeight: 'bold', fontSize: 14 }}>{items.furniture[numberLoads + 1].storeInfo[0].rating}⭐</Text>
                    </Pressable>
                    <View style={[{ backgroundColor: colorScheme === 'light' ? 'white' : 'black', flex: 1, flexDirection: 'row', width: windowWidth - 20, justifyContent: 'space-evenly', marginTop: 1 }]}>
                        <Likes furnitureId={items.furniture[numberLoads]._id} collection={items.furniture[numberLoads + 1].collectionName} numberLikes={items.furniture[numberLoads].numberLikes}></Likes>
                        <Pressable onPress={() => navigateProps(items.furniture[numberLoads + 1])}>
                            {colorScheme === 'light' && <Image source={require('../../assets/info.png')} style={[buttons.navigatePropsButton]} />}{colorScheme === 'dark' && <Image source={require('../../assets/info-white.png')} style={[buttons.navigatePropsButton]} />}</Pressable>
                    </View>
                    <View style={[{ width: windowWidth - 20, height: 45, }]}>
                        <Text style={[{ fontFamily: 'MontserratBold', color: colorScheme === 'light' ? 'black' : 'white' }]}>{items.furniture[numberLoads + 1].title}</Text>
                        <Text style={{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white' }}>{items.furniture[numberLoads + 1].description}</Text>
                    </View>
                    <Pressable style={buttons.navigateAddBasketButton} onPress={() => navigateAddBasket(items.furniture[numberLoads + 1])}><Text style={ texts.navigateAddBasket }>{items.furniture[numberLoads + 1].price}{items.furniture[numberLoads + 1].currency}</Text>
                        <Image source={require('../../assets/carrito-de-compras-green.png')} style={[{ width: 20, height: 20, marginBottom: 66 }]} /></Pressable>
                </View>

                const payload = [newContent, newContentB]

                setNumberLoads(numberLoads + 2)
                dispatch(pushContentList(payload))

            } else {
                const newContent = <View style={[containers.containerHome, { backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
                    <View style={[containers.contentContainer, { width: windowWidth - 10 }]}>
                        <Text style={texts.contentText}></Text>
                    </View>
                    <View style={[{ height: windowWidth, width: windowWidth }]}>
                        <Carousel img={items.furniture[numberLoads].img}></Carousel>
                    </View>
                    <Pressable hitSlop={{ top: 40, bottom: 40, left: 100, right: 100 }} style={[buttons.storePageButton, { width: windowWidth - 10 }]} onPress={() => navigateStorePage(items.furniture[numberLoads].storeInfo)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ImageCache uri={items.furniture[numberLoads].storeInfo[0].image} width={25} height={25} radius={100}></ImageCache>
                            <Text style={[{ color: colorScheme === 'light' ? 'black' : 'white', fontFamily: 'MontserratBold', fontSize: 14, marginLeft: 2 }]}>{items.furniture[numberLoads].storeInfo[0].name}</Text>
                        </View>
                        <Text style={{ color: colorScheme === 'light' ? 'black' : 'white', fontWeight: 'bold', fontSize: 14 }}>{items.furniture[numberLoads].storeInfo[0].rating}⭐</Text>
                    </Pressable>
                    <View style={[{ backgroundColor: colorScheme === 'light' ? 'white' : 'black', flex: 1, flexDirection: 'row', width: windowWidth - 20, justifyContent: 'space-evenly', marginTop: 1 }]}>
                        <Likes furnitureId={items.furniture[numberLoads]._id} collection={items.furniture[numberLoads].collectionName} numberLikes={items.furniture[numberLoads].numberLikes}></Likes>

                        <Pressable onPress={() => navigateProps(items.furniture[numberLoads])}>
                            {colorScheme === 'light' && <Image source={require('../../assets/info.png')} style={[buttons.navigatePropsButton]} />}{colorScheme === 'dark' && <Image source={require('../../assets/info-white.png')} style={[buttons.navigatePropsButton]} />}</Pressable>
                    </View>
                    <View style={[{ width: windowWidth - 20, height: 45, }]}>
                        <Text style={[{ fontFamily: 'MontserratBold', color: colorScheme === 'light' ? 'black' : 'white' }]}>{items.furniture[numberLoads].title}</Text>
                        <Text style={{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white' }}>{items.furniture[numberLoads].description}</Text>
                    </View>
                    <Pressable style={buttons.navigateAddBasketButton} onPress={() => navigateAddBasket(items.furniture[numberLoads])}><Text style={ texts.navigateAddBasket }>{items.furniture[numberLoads].price}{items.furniture[numberLoads].currency}</Text>
                        <Image source={require('../../assets/carrito-de-compras-green.png')} style={[{ width: 20, height: 20, marginBottom: 66 }]} /></Pressable>
                </View>

                const payload = [newContent]

                setNumberLoads(numberLoads + 1)
                dispatch(pushContentList(payload))
            }
        }
    }

    const handleScroll = (nativeEvent: any) => {
        const yOffset = nativeEvent.contentOffset.y;
        const contentHeight = nativeEvent.contentSize.height;
        const windowHeight = nativeEvent.layoutMeasurement.height;

        if (yOffset + windowHeight >= contentHeight) {
            handlerMoreItems();
        }
    };

    const handlerMoreItems = () => {
        log.info('Home -> handlerMoreItems')
        setSearchIndex(searchIndex + 1)
        if (items === undefined) return
        if (items.furniture.length < numberLoads) {
            alert(language.noMoreItems)
            setSearchIndex(0)
        }
        else if (numberLoads < 10) {
            drawContent(items)
        }
    }

    return (
        <View style={[containers.containerHome, { backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
            <View style={{position: 'absolute', top: '25%', zIndex: 100}}>
                {isAlertOpen && <CustomAlert message={message} status={status} />}
            </View>
            {isOnSearcher && <Searcher handlerRetrieveSearch={handlerRetrieveSearch}></Searcher>}
            <View style={[{ height: windowHeight, backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
                {items !== undefined && <ScrollView showsVerticalScrollIndicator={false} style={[{ height: windowHeight, backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]} ref={scrollViewRef} onScroll={({nativeEvent}) => handleScroll(nativeEvent)}>
                    {contentList}
                </ScrollView>}
            </View>
            <Menu isOnHome={true} handlerDisplayLikes={handlerDisplayLikes}></Menu>
        </View>
    );
}

export default Home