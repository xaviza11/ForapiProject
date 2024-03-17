import {View, Image, Pressable } from 'react-native';
import ImageCache from './ImageCache';
import React, { useEffect, useState } from 'react';
import retrieveItem from '../utils/storage.retrieveItem.native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { resetContentList, toggleSearcher } from '../actions/actions';
import log from '../utils/coolog';
import retrieveLikes from '../middlewares/retrieveLikes';
import secretPassGen from '../utils/secretPassGen';
import {isRetrieveLikes} from '../actions/actions';
import saveItem from '../utils/storage.saveItem.native';
import containers from '../styles/containers';
import icons from '../styles/icons'

const Menu = (props: { isOnHome: boolean, handlerDisplayLikes: any }) => {

  log.pc(' <-- Menu --> ')

  const { isOnHome, handlerDisplayLikes } = props

  const dispatch = useDispatch()

  const navigation = useNavigation()

  const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
  const windowWidth = useSelector((state: {windowWidth:number}) => state.windowWidth)
  const user = useSelector((state: any) => state.user)
  const searcher = useSelector((state: {isOnSearcher:boolean}) => state.isOnSearcher)
  const language = useSelector((state: any) => state.language)
  const host = useSelector((state: {host:string}) => state.host)

  const [image, setImage] = useState()

  useEffect(() => {
    setImage(user.image)
  }, [user])

  const navigateSettings = () => {

    log.navigate('Menu -> navigateSettings')

    if (isOnHome) navigation.navigate('Settings' as never)
    else navigation.navigate('Home' as never)
  }

  const toggleSearcherComp = () => {

    log.navigate('Menu -> toggleSearchComponent')

    dispatch(toggleSearcher(!searcher))
  }

  const navigateBasketOrHome = () => {
    log.navigate('Menu -> navigateBasketOrHome')

    if (isOnHome) navigation.navigate('Basket' as never)
    else navigation.navigate('Home' as never)
  }

  const handlerRetrieveLikes = async () => {

    log.info('Home -> handlerRetrieveLikes')

    try {
      const retrieveToken = await retrieveItem('token')
      const retrieveEmail = await retrieveItem('email')
      const secretPass = secretPassGen(retrieveToken, retrieveEmail)
      retrieveLikes(retrieveToken, language, host, secretPass)
        .then(result => {
          saveItem('token', result.token)
          handlerDisplayLikes(result)
          dispatch(resetContentList())
          dispatch(isRetrieveLikes(true))
        })
        .catch(error => {
          if (error === 'jwt expired') {
            alert(language.sessionExpired)
            setTimeout(() => {
              navigation.navigate('CloseApp' as never)
            }, 1000)
          }
          else {
            alert(error)
          }
        })
    } catch (error) {
      alert(language.emptyData)
    }
  }

  return (
    <View style={[containers.containerMenu, { width: windowWidth, backgroundColor: colorScheme === 'light' ? 'white' : 'gray' }]}>
      <Pressable onPress={toggleSearcherComp}><Image source={require('../../assets/1689334391610061660-128.png')} style={icons.icon} /></Pressable>
      {handlerDisplayLikes !== 'none' && <Pressable onPress={() => handlerRetrieveLikes()}><Image source={require('../../assets/624003691610061658-128.png')} style={icons.icon} /></Pressable>}
      {handlerDisplayLikes === 'none' && <Pressable><Image source={require('../../assets/624003691610061658-128.png')} style={icons.icon} /></Pressable>}
      {/*<Pressable onPress={handlerChat}><Image source={require('../../assets/charla.png')} style={styles.icon}></Image></Pressable>*/}
      <Pressable onPress={() => navigateBasketOrHome()}><Image source={require('../../assets/carrito-de-compras.png')} style={icons.icon}></Image></Pressable>
      {image && <Pressable onPress={navigateSettings} style={{ borderColor: 'black', borderWidth: 1, borderRadius: 100 }}><ImageCache width={30} height={30} uri={image} radius={100} /></Pressable>}
      {!image && <Pressable onPress={navigateSettings}><ImageCache width={30} height={30} uri={'none'} radius={100} /></Pressable>}
    </View>
  );
}

export default Menu