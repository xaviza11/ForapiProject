/*import log from '../utils/coolog';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, Pressable, View, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import retrieveItem from '../utils/storage.retrieveItem.native';
import saveItem from '../utils/storage.saveItem.native';

import ChatComp from '../components/ChatComp';
import ImageCache from '../components/ImageCache';
import { useSelector } from 'react-redux';

const Chat = () => {
    log.pc('<--- Chat --->');

    const language = useSelector((state: any) => state.language);
    const host = useSelector((state: {host:string}) => state.host);
    const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme);
    const user = useSelector((state: any) => state.user);
    const windowWidth = useSelector((state: {windowWidth:number}) => state.windowWidth);
    const windowHeight = useSelector((state: {windowHeight:number}) => state.windowHeight);
    const isOnSearcher = useSelector((state: {isOnSearcher:boolean}) => state.isOnSearcher);
    const isAlertOpen = useSelector((state: {isAlertOpen:boolean}) => state.isAlertOpen);
    const socket = useSelector((state: any) => state.socket); //! not exist

    const [data, setData] = useState<Array<{
        storeImage: string;
        storeName: string;
        messages: Array<{ author: string; date: string }>;
        userName: string;
        chatIsReadingUser: boolean;
    }> | null>(null);

    const [name, setName] = useState<string | undefined>();
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<{
        storeImage: string;
        storeName: string;
        messages: Array<{ author: string; date: string }>;
        userName: string;
        chatIsReadingUser: boolean;
    } | null>(null);
    const [refresher, setRefresher] = useState<number>(0);

    useEffect(() => {
        useEffectActions();
    }, [refresher]);

    const useEffectActions = async () => {
        const token = await retrieveItem('token');
        const retrieveName = await retrieveItem('name');
        setName(retrieveName);

        const gender = await retrieveItem('gender');

        socket.on('newToken', async (response: any) => {
            await saveItem('token', response);
        });

        socket.emit('searchChats', { _id: token, gender: gender, socket: 'none' });

        socket.on('response', (response: any) => {
            response.sort((a:any, b:any) => a.chatIsReadingUser ? -1 : 1);
            setData(response);
        });

        socket.on('disconnect', () => {
            console.log(language.socketDisconnect);
        });

        return () => {
            socket.disconnect();
        };
    };

    const handlerOpenChat = (index: number) => {
        if (data) {
            setSelectedItem(data[index]);
            setIsChatOpen(!isChatOpen);
            setRefresher(refresher + 1);
        }
    };

    const updateSelectedItem = (data: any) => {
        setSelectedItem(data);
    };

    return (
        <View style={{ width: windowWidth, height: windowHeight, position: 'absolute', top: 0, zIndex: 2, alignItems: 'center', backgroundColor: colorScheme === 'light' ? 'white' : 'black' }}>
            <ScrollView style={{ position: 'absolute', top: 0, height: windowHeight, width: windowWidth }}>
                <View style={{ alignItems: 'center' }}>
                {!isChatOpen && <Text style={{ zIndex: 100, position: 'absolute', top: 0, backgroundColor: colorScheme === 'light' ? 'black' : 'gray', width: windowWidth, fontFamily: 'GreatVibes', fontSize: 35, textAlign: 'center', color: colorScheme === 'light' ? 'black' : 'white' }}>{language.chats}</Text>}
                    <View style={{ marginTop: 50, width: windowWidth - 100 }}>
                        {data !== null && !isChatOpen && data.map((item, index) => (
                            <Pressable style={{ borderBottomColor: colorScheme === 'light' ? 'black' : 'white', borderBottomWidth: 1, padding: 4, marginBottom: 10 }} onPress={() => handlerOpenChat(index)} key={index}>
                                <View style={[{ marginTop: 10, flexDirection: 'row', alignItems: 'center', width: 250 }]}>
                                    <ImageCache
                                        uri={item.storeImage}
                                        width={30}
                                        height={30}
                                        radius={100}
                                    />
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        {item.messages[0].author === name && <Text style={{ fontFamily: 'Montserrat', fontWeight: 'bold', color: colorScheme === 'light' ? 'black' : 'white' }}> {item.storeName}</Text>}
                                        {item.messages[0].author !== name && <Text style={{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white' }}> {item.userName}</Text>}
                                        <Text style={[{ marginLeft: 4, fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'gray' }]}>{item.messages[item.messages.length - 1].date}</Text>
                                    </View>
                                    {item.chatIsReadingUser === false && <Text style={[{ backgroundColor: 'green', width: 10, height: 10, textAlign: 'center', borderRadius: 10 }]}></Text>}
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {isChatOpen && <ChatComp selectedItem={selectedItem!} updateSelectedItem={updateSelectedItem} language={language} windowWidth={windowWidth} windowHeight={windowHeight} handlerOpenChat={handlerOpenChat} socket={socket} colorScheme={colorScheme}></ChatComp>}
        </View>
    );
};

export default Chat;*/
