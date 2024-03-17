import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import log from '../utils/coolog'
import retrieveItem from '../utils/storage.retrieveItem.native';
import secretPassGen from '../utils/secretPassGen';

import { useSelector } from 'react-redux';

import updateLikes from '../middlewares/updateLikes'

import saveItem from '../utils/storage.saveItem.native';
import { useNavigation } from '@react-navigation/native';

export default function Likes(props: { furnitureId: string, numberLikes: number, collection: string }) {

    log.pc('<--- Likes --->')

    const { furnitureId, numberLikes, collection } = props

    const navigation = useNavigation()

    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isUnLiked, setIsUnLiked] = useState<boolean>(false)
    const [number, setNumber] = useState<number>(numberLikes)

    const language = useSelector((state: any) => state.language)
    const host = useSelector((state: {host:string}) => state.host)
    const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
    const isRetrieveLikes = useSelector((state: any) => state.isRetrieveLikes)

    const handlerUpdateLikes = async () => {

        log.info('Likes -> handlerUpdateLikes')


        let value = 0

        if (!isRetrieveLikes && isLiked){
            value = -1
            setNumber(number - 1)
            setIsLiked(!isLiked)
        }
        if (!isRetrieveLikes && !isLiked){
            value = + 1
            setNumber(number + 1)
            setIsLiked(!isLiked)
        }
        if (isRetrieveLikes && isUnLiked){
            setIsUnLiked(!isUnLiked)
            setNumber(number + 1) 
            value = + 1
        }
        if (isRetrieveLikes && !isUnLiked){
            setIsUnLiked(!isUnLiked)
            setNumber(number - 1)  
            value = - 1
        }

        try {
            const retrieveToken = await retrieveItem('token')
            const retrieveEmail = await retrieveItem('email')
            const secretPass = secretPassGen(retrieveToken, retrieveEmail)
            updateLikes(retrieveToken, furnitureId, value, language, host, secretPass, collection)
                .then((token) => {
                    handlerUpdate(token)
                })
                .catch(error => {
                    if (error === 'jwt expired') {
                        alert(error.message)
                        setTimeout(() => {
                            navigation.navigate('CloseApp' as never)
                          }, 1000)
                    }
                    else {
                        alert(error)
                    }
                })
        } catch (error: any) {
            alert(error)
        }
    }

    const handlerUpdate = async (token: string) => {

        log.info('Likes -> handlerUpdate')

        if (!number) return

        saveItem('token', token)
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginLeft: 0 }}>
            <View style={[{ flex: 1, flexDirection: 'row', }]}>
                {isLiked === false && isRetrieveLikes === false && <TouchableOpacity onPress={() => handlerUpdateLikes()}>{colorScheme === 'dark' && <Text >🤍</Text>}{colorScheme === 'light' && <Text>🖤</Text>}</TouchableOpacity>}
                {isLiked === true && isRetrieveLikes === false && <TouchableOpacity onPress={() => handlerUpdateLikes()}><Text >💚</Text></TouchableOpacity>}
                {isUnLiked === false && isRetrieveLikes === true && <TouchableOpacity onPress={() => handlerUpdateLikes()}>{colorScheme === 'dark' && <Text >🤍</Text>}{colorScheme === 'light' && <Text>🖤</Text>}</TouchableOpacity>}
                {isUnLiked === true && isRetrieveLikes === true && <TouchableOpacity onPress={() => handlerUpdateLikes()}><Text >❤️</Text></TouchableOpacity>}
                <Text style={[{ color: colorScheme === 'light' ? 'black' : 'white' }]}>{number}</Text>
            </View>
        </View>
    );
}