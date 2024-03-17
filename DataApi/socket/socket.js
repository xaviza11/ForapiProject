const { Chats, } = require('../models')
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

const storesConnected = new Map()

module.exports = (io) => {
  io.on('connection', (socket) => {

    storesConnected.set(socket.handshake.auth.userId, socket.id);
    console.log('connected');

    socket.on('secretPass', (data) => {
      try{
      passwordValidator(data.token, data.email, data.secretPass)
      const token = jwt.sign({ sub: data._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
      socket.emit('newToken', token)
    }catch(error){console.log(error)}
    })

    socket.on('disconnect', () => {
      try{
      storesConnected.delete(socket.handshake.auth);
      console.log('disconnected');
    }catch(error){console.log(error)}
    });

    //warn -------------------------------------------------------------------------------------------------------

    //chats 

    socket.on('joinChat', (data) => {
      try{
      socket.join(data)
      roomName = data
    }catch(error){console.log(error)}
    })

    socket.on('leaveChat', (roomName) => {
      try{
      socket.leave(roomName);
      roomName = 'none'
    }catch(error){console.log(error)}
    });

    socket.on('done', () => { })

    socket.on('updateChats', (data) => {
      try{
      return Chats.findById({ _id: data._id })
        .then(item => {
          if (item.userId === data.changerId) item.chatIsReadingUser = true
          if (item.storeId === data.changerId) item.chatIsReadingStore = true
          item.save()
          io.to(data._id).emit('updateOneChat', item)
        })
      }catch(error){console.log(error)}
    })

    socket.on('searchChats', (data) => {
      try{
      if (data.gender === 'Personal' || data.gender === 'personal')
        return Chats.find({ userId: data._id })
          .then(response => {
            socket.emit('response', response)
          })
      else if (data.gender === 'Store' || data.gender === 'store')
        return Chats.find({ storeId: data._id })
          .then(response => {
            socket.emit('response', response)
          })
        }catch(error){console.log(error)}
    });

    socket.on('retrieveNewChat', (response) => {
      try{
      return Chats.findById({ _id: response.chatId })
        .then(item => {
          const id = storesConnected.get(item.storeId);
          io.to(id).emit('userHasNewChat', item)
        })
      }catch(error){console.log(error)}
    })

    socket.on('addMessage', async (data) => {
      try {

        const item = await Chats.findById({ _id: data._id });

        if (data.retrieveName === item.storeName)
          item.chatIsReadingUser = false
        if (data.retrieveName === item.userName)
          item.chatIsReadingStore = false

        item.messages.push({ author: data.retrieveName, message: data.newMessage, date: data.formattedDateA });
        await item.save();

        const updatedItem = await Chats.findById({ _id: data._id });
        io.to(data._id).emit('retrieveNewMessage', updatedItem);
      } catch (error) {
        console.error(error);
      }
    });
  });
};