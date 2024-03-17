// ChatComp.js
/*import { useEffect, useState, useRef } from 'react';
import { React, ScrollView, } from 'react-native';
import { Image, View, Text, TextInput, Pressable } from 'react-native';
import secretPassGen from '../utils/secretPassGen';
import retrieveItem from '../utils/storage.retrieveItem.native';
import ImageCacher from './ImageCache';

const ChatComp = (props) => {

  const { selectedItem, updateSelectedItem, language, windowWidth, windowHeight, handlerOpenChat, socket, colorScheme } = props

  const scrollViewRef = useRef();
  const [refresher, setRefresher] = useState(0)
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    useEffectActions()
  }, [refresher])

  const useEffectActions = () => {
    const chatId = selectedItem._id
    socket.emit('joinChat', chatId)

    handlerUpdateChats()

    socket.on('retrieveNewMessage', (data) => {
      try {
        const id = selectedItem._id
        const chatIsReading = data.chatIsReadingUser
        const messages = data.messages
        const userId = selectedItem.userId
        const storeId = selectedItem.storeId
        const storeName = selectedItem.storeName
        const userName = selectedItem.userName
        const item = selectedItem.item
        const date = selectedItem.date
        const storeImage = selectedItem.storeImage
        const userImage = selectedItem.userImage


        updateSelectedItem({ _id: id, chatIsReading: chatIsReading, messages: messages, userId: userId, storeId: storeId, storeName: storeName, userName: userName, item: item, date: date, storeImage: storeImage, userImage: userImage })

          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
          }

      } catch (error) { console.log(error, 'retrieve') }
    })
  }

  const handlerUpdateChats = async () => {

    const name = await retrieveItem('name')

    if (selectedItem === null) { setRefresher(refresher + 1) }
    else if (name === selectedItem.userName) {
      socket.emit('updateChats', { _id: selectedItem._id, changerId: selectedItem.userId })
    }
    else if (name !== selectedItem.userName) {
      socket.emit('updateChats', { _id: selectedItem._id, changerId: selectedItem.storeId })
    }
  }

  const handlerSecretPass = (email, token) => {
    return secretPassGen(token, email)
  }

  const handleSendMessage = async () => {
    try {
      const retrieveToken = await retrieveItem('token')
      const retrieveEmail = await retrieveItem('email')
      const retrieveName = await retrieveItem('name')
      const date = new Date()

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

      const formattedDateA = formattedDate.replace('T', ' ')

      await socket.emit('addMessage', { retrieveName, _id: selectedItem._id, newMessage, formattedDateA, })

      setNewMessage('')
    } catch (error) { console.log(error) }
  }

  return (
    <View style={{ height: windowHeight, alignItems: 'center', }}>
      <View style={[{ width: windowWidth, alignItems: 'center', backgroundColor: colorScheme === 'light' ? 'white' : 'black', height: windowHeight - 50 }]}>
        <View style={[{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: windowWidth, backgroundColor: colorScheme === 'light' ? 'black' : 'gray', height: 60, alignItems: 'center', }]}>
          <Pressable style={{ backgroundColor: colorScheme === 'light' ? 'white' : 'black', borderRadius: 100, width: 25, height: 25, justifyContent: 'center', alignItems: 'center', paddingBottom: 2, marginLeft: 10 }} onPress={handlerOpenChat}>
            <Text style={{color: colorScheme === 'light' ? 'black' : 'white'}}>{'<'}</Text>
          </Pressable>
          <Text style={{ color: colorScheme === 'light' ? 'white' : 'white', fontSize: 25, fontFamily: 'GreatVibes' }}> {selectedItem.storeName}</Text>
          <Text style={{width: 25, marginLeft: 10}}></Text>
        </View>
        <ScrollView  ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
         style={{ height: windowHeight - 170, width: windowWidth, }} showsVerticalScrolllIndicator={true}>
          <View style={{marginBottom: 60, marginTop: 20}}>
          {selectedItem !== null && selectedItem.messages.map((message, index) => (
            <View style={{ width: windowWidth - 30, marginBottom: 6 }} key={index}>
              {message.author !== selectedItem.storeName && <View style={{ position: 'relative', left: 25, alignItems: 'flex-end', borderColor: 'green', borderWidth: 1, padding: 4, borderRadius: 10, width: 170, backgroundColor: colorScheme === 'light' ? 'white' : 'white', }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: 187, }}>
                  <ImageCacher uri={selectedItem.userImage} width={20} height={20} radius={20}></ImageCacher>
                  <Text style={{ fontFamily: 'Montserrat', fontSize: 12, marginLeft: 6 }}>{message.author}</Text>
                </View>
                <Text style={{ fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold' }}>{message.message}</Text>

                <Text style={{ fontFamily: 'Montserrat', fontSize: 10 }}>{message.date}</Text>
              </View>
              }
              {message.author === selectedItem.storeName && <View style={{ position: 'relative', left: 165, alignItems: 'flex-start', borderColor: 'black', borderWidth: 1, padding: 4, borderRadius: 10, width: 170, backgroundColor: colorScheme === 'light' ? 'white' : 'white' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: 187, }}>
                  <Text style={{ fontFamily: 'Montserrat', fontSize: 12, marginRight: 6, textAlign: 'right' }}>{message.author}</Text>
                  <ImageCacher uri={selectedItem.storeImage} width={20} height={20} radius={20}></ImageCacher>
                </View>
                <Text style={{ fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold' }}>{message.message}</Text>

                <Text style={{ fontFamily: 'Montserrat', fontSize: 10 }}>{message.date}</Text>
              </View>
              }
            </View>
          ))}
          </View>
        </ScrollView>
      </View>
      <View style={{ position: 'absolute', bottom: 80, flexDirection: 'row' }}>
        <TextInput
          style={{ borderColor: 'black', borderWidth: 1, width: windowWidth - 100, borderRadius: 100, height: 25, paddingLeft: 8, fontFamily: 'Montserrat', backgroundColor: colorScheme === 'light' ? 'white' : 'white' }}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder={language.writeYoutMessage}
        />
        <Pressable onPress={handleSendMessage} style={{ backgroundColor: 'green', borderRadius: 100, width: 25, height: 25, alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
          <Text style={{color: colorScheme === 'light' ? 'white' : 'white'}}>➤</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ChatComp*/