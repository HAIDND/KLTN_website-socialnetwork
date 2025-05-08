import socket from "./SocketInitial";

export const initialChatState = {
  unreadMessages: 0, // { senderEmail, message }
  messages: [], // { senderEmail, message }
};

export const chatReducer = (state, action) => {
  switch (action.type) {
    case "chat/receive":
      return {
        ...state,

        messages: [...state.messages, action.payload],
      };
    case "chat/send":
      socket.emit("personalChat", action.payload);
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};
