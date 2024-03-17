const { Chats, } = require('../models')
/*const passwordValidator = require('../utils/passwordValidator')*/
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

const storesConnected = new Map()

module.exports = (io) => {
  io.on('connection', (socket) => {

    storesConnected.set(socket.handshake.auth.userId, socket.id);

    console.log('connected');

    /*socket.on('secretPass', (data) => {
      passwordValidator(data.token, data.email, data.secretPass)
      const token = jwt.sign({ sub: data._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
      socket.emit('newToken', token)
    })*/

    socket.on('disconnect', () => {
      storesConnected.delete(socket.handshake.auth);
      console.log('disconnected');
    });

    //warn -------------------------------------------------------------------------------------------------------

    //chats 

    socket.on('joinChat', (data) => {
      socket.join(data)
      roomName = data
    })

    socket.on('leaveChat', (roomName) => {
      socket.leave(roomName);
      roomName = 'none'
    });

    socket.on('done', () => { })

    socket.on('updateChats', (data) => {

      return Chats.findById({ _id: data._id })
        .then(item => {
          if (item.userId === data.isReading) item.chatIsReadingUser = true
          if (item.storeId === data.isReading) item.chatIsReadingStore = true
          item.save()
          io.to(data._id).emit('updateOneChat', item)
        })
    })

    socket.on('searchChats', (data) => {

      const decodedToken = jwt.decode(token, JWT_SECRET);
      const userId = decodedToken.sub

      if (data.gender === 'Personal' || data.gender === 'personal')
        return Chats.find({ userId: userId })
          .then(response => {
            socket.emit('response', response)
          })
      else if (data.gender === 'Store' || data.gender === 'store')
        return Chats.find({ storeId: userId })
          .then(response => {
            socket.emit('response', response)
          })
    });

    socket.on('retrieveNewChat', (response) => {

      return Chats.findById({ _id: response.chatId })
        .then(item => {
          const id = storesConnected.get(item.storeId);
          io.to(id).emit('userHasNewChat', item)
        })
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