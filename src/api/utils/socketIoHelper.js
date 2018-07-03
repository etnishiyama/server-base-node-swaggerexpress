/*
import jwt from 'jsonwebtoken';
import constants from './constants';
import * as chat from '../controllers/chat';

const CHAT_IDENTIFIER = 'chat_server';
const sockets = {};
const users = [];

function socketCallbacks(io, socket) {
  const userToken = socket.handshake.query.token;
  const currentUser = jwt.decode(userToken);
  currentUser._socket = socket.id;

  const user = users.find(u => u._id === currentUser._id);
  if (user) {
    console.log('[INFO] User ID is already connected, kicking.');
    sockets[user._socket].disconnect();
    delete sockets[user._socket];
    users.splice(users.indexOf(user), 1);
  }

  console.log(`[INFO] User ${currentUser._id} connected!`);
  sockets[currentUser._socket] = socket;
  users.push(currentUser);
  console.log(`[INFO] Total users: ${users.length}`);

  if (currentUser.role === constants.ROLE_USER) {
    io.emit(currentUser._company, { userId: currentUser._id, isConnected: true });
  }

  socket.on('disconnect', () => {
    console.log(`[INFO] User ${currentUser._id} disconnected!`);
    io.emit(currentUser._company, { userId: currentUser._id, isConnected: false });
    users.splice(users.indexOf(user), 1);
    delete sockets[currentUser.id];
  });

  socket.on(CHAT_IDENTIFIER, (data) => {
    const newData = data.message ? data : JSON.parse(data);
    const messageReceived = newData.message;
    const time = new Date().toISOString();

    console.log(`[CHAT] [${time}] ${currentUser._id}: ${messageReceived}`);
    if (currentUser.role === constants.ROLE_USER) {
      const newMessage = {
        _from: currentUser._id,
        message: messageReceived,
        receivedAt: time,
        _to: currentUser._company,
        _company: currentUser._company,
      };

      chat.newChatMessage(newMessage, currentUser._id);
      io.emit(newMessage._company, newMessage);
    } else if (currentUser.role === constants.ROLE_FRANCHISE) {
      const newMessage = {
        _from: currentUser._company,
        message: messageReceived,
        receivedAt: time,
        _to: newData.userId,
        _company: currentUser._company,
      };

      chat.newChatMessage(newMessage, newData.userId);
      io.emit(newData.userId, newMessage);
    }
  });
}

export default {
  socketCallbacks,
};
*/
