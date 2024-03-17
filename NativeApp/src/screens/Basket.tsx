import log from '../utils/coolog'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import secretPassGen from '../utils/secretPassGen';
import retrieveItem from '../utils/storage.retrieveItem.native';
import retrieveBasketItems from '../middlewares/retrieveBasketItems';
import deleteItemOnBasket from '../middlewares/deleteItemOnBasket';
import saveItem from '../utils/storage.saveItem.native';
import Menu from '../components/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { setBasketItems } from '../actions/actions';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { toggleAlert } from '../actions/actions';
import CustomAlert from '../components/CustomAlert';
import containers from '../styles/containers';

const Basket = () => {

    log.pc('<--- Basket --->')

    const navigation = useNavigation()

    const dispatch = useDispatch()

    const language = useSelector((state: any) => state.language)
    const host = useSelector((state: { host: string }) => state.host)
    const colorScheme = useSelector((state: { colorScheme: string }) => state.colorScheme)
    const windowWidth = useSelector((state: { windowWidth: number }) => state.windowWidth)
    const windowHeight = useSelector((state: { windowHeight: number }) => state.windowHeight)
    const isAlertOpen = useSelector((state: { isAlertOpen: boolean }) => state.isAlertOpen)

    const [items, setItems] = useState<any>([])
    const [hasItems, setHasItems] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    useEffect(() => {
        retrieveBasket()
    }, [])

    const deleteItemOnBasketHandler = async (index: number) => {

        log.info('Basket -> deleteItemOnBasket')

        const retrieveToken = await retrieveItem('token')
        const retrieveBasket = await retrieveItem('basket')
        const retrieveEmail = await retrieveItem('email')
        const secretPass = secretPassGen(retrieveToken, retrieveEmail)

        try {
            deleteItemOnBasket(retrieveBasket, index, secretPass, retrieveToken, host, language)
                .then(result => {
                    saveItem('token', result.token)
                    if (items.length - 1 < 1) setHasItems(false)
                    items.splice(index, 1)
                    setStatus('ok')
                    setMessage(language.deleteSuccess)
                    dispatch(toggleAlert(true))
                })
                .catch(error => {
                    if (error === 'jwt expired') {
                        setStatus('error')
                        setMessage(error.sessionExpired)
                        dispatch(toggleAlert(true))
                    } else {
                        setStatus('warn')
                        setMessage(error)
                        dispatch(toggleAlert(true))
                    }
                })
        } catch (error) {
            setStatus('warn')
            setMessage(error)
            dispatch(toggleAlert(true))
        }
    }

    const retrieveBasket = async () => {

        log.info('Basket -> retrieveBasket')

        const retrieveToken = await retrieveItem('token');
        const retrieveEmail = await retrieveItem('email');
        const secretPass = secretPassGen(retrieveToken, retrieveEmail);
        const retrieveBasket = await retrieveItem('basket');

        try {
            retrieveBasketItems(retrieveBasket, retrieveToken, secretPass, language, host)
                .then(result => {

                    if (result.items.length === 0) {
                        setStatus('warn')
                        setMessage(language.emptyData)
                        dispatch(toggleAlert(true))
                        setTimeout(() => {
                            navigation.navigate('Home' as never)
                        }, 1200)
                    }

                    const customSort = (a: any, b: any) => {
                        if (a.store < b.store) return -1;
                        if (a.store > b.store) return 1;
                        return 0;
                    };

                    if (result.items.length > 0) {
                        result.items.sort(customSort);

                        const groupedItems = result.items.reduce((acc: number, item: any) => {
                            if (!acc[item.soldBy]) {
                                acc[item.soldBy] = [];
                            }
                            acc[item.soldBy].push(item);
                            return acc;
                        }, {});

                        const groupedArrays = Object.values(groupedItems);
                        setItems(groupedArrays as never);
                        setHasItems(true);
                        saveItem('token', result.token)
                    }
                })
                .catch(error => {
                    if (error === 'jwt expired') {
                        setStatus('error')
                        setMessage(error.sessionExpired)
                        dispatch(toggleAlert(true))
                    } else {
                        setStatus('warn')
                        setMessage(error)
                        dispatch(toggleAlert(true))
                    }
                });
        } catch (error) {
            setStatus('warn')
            setMessage(error)
            dispatch(toggleAlert(true))
        }
    };

    const navigateItemRequest = (index: number) => {

        log.navigate('Basket -> navigateItemRequest')

        if (index === null) return

        const storeId = items[index][0].soldBy
        const itemsWithSameSoldBy = items[index].filter((item: any) => item.soldBy === storeId);
        const itemsArr = []
        for (let i = 0; i < itemsWithSameSoldBy.length; i++) {
            itemsArr.push({ id: itemsWithSameSoldBy[i]._id, name: itemsWithSameSoldBy[i].title, quantity: itemsWithSameSoldBy[i].quantity, description: itemsWithSameSoldBy[i].description, price: itemsWithSameSoldBy[i].price, collection: itemsWithSameSoldBy[i].collection, currency: itemsWithSameSoldBy[i].currency, props: itemsWithSameSoldBy[i].props, storeImage: itemsWithSameSoldBy[i].storeImage })
        }

        dispatch(setBasketItems(itemsWithSameSoldBy))

        navigation.navigate('BasketRequest' as never)
    }

    return (
        <View style={{ width: windowWidth, height: windowHeight, position: 'absolute', top: 0, zIndex: 2, alignItems: 'center', backgroundColor: colorScheme === 'light' ? 'white' : 'black' }}>
            <View style={containers.fixedContainer}>
                {isAlertOpen && <CustomAlert message={message} status={status} />}
            </View>
            <ScrollView style={{ flexDirection: 'column', position: 'absolute', top: 0, width: windowWidth, height: windowHeight}} showsVerticalScrollIndicator={true}>
                <Text style={{ zIndex: 100, position: 'absolute', top: 0, color: colorScheme === 'light' ? 'white' : 'white', backgroundColor: colorScheme === 'light' ? 'black' : 'gray', width: windowWidth, fontFamily: 'GreatVibes', fontSize: 35, textAlign: 'center' }}>{language.basket}</Text>
                {hasItems && items.length && items.map(((storeItems: any, storeIndex: number) => (

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                            position: 'absolute',
                            top: '25%',
                            zIndex: 100,
                        }}>
                            {isAlertOpen && <CustomAlert message={message} status={status} />}
                        </View>
                        <View style={{ width: windowWidth - 110, marginTop: 80 }}>
                            <Text style={{ marginBottom: 10, borderBottomColor: colorScheme === 'light' ? 'black' : 'white', borderBottomWidth: 2, fontFamily: 'MontserratBold' }}>{storeItems[0].storeName}</Text>
                            {storeItems.map((item: any, itemIndex: number) => (
                                <View style={{ marginBottom: 10, }} key={itemIndex}>
                                    <Text style={{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white', fontSize: 14 }}>{item.title}</Text>
                                    <Text style={{ fontFamily: 'Montserrat', color: 'gray' }}>{item.description}</Text>
                                    <View style={{ flex: 0, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                            <Text style={{ color: 'green', fontWeight: 'bold' }}>{item.price}</Text>
                                            <Text style={{ color: 'green', fontWeight: 'bold' }}>{item.currency}</Text>
                                        </View>
                                        <Text style={{ color: colorScheme === 'light' ? 'black' : 'white' }}>{language.quantity}: {item.quantity}</Text>
                                    </View>
                                    <View style={{ width: windowWidth - 110, alignItems: 'center', marginTop: 10 }}>
                                        <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => deleteItemOnBasketHandler(itemIndex)}>
                                            <Button title={language.delete} colorDark='white' colorLight='white' backgroundColorDark='red' backgroundColorLight='red'></Button>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            <View style={{ width: windowWidth - 110, alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigateItemRequest(storeIndex)}>
                                    <Button title={language.sendMessage} colorDark='white' colorLight='white' backgroundColorDark='green' backgroundColorLight='green'></Button>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )))}
            </ScrollView>
            <Menu handlerDisplayLikes={'none'} isOnHome={false}></Menu>
        </View>
    );
}

export default Basket;
