import { CHANNEL_ACTION } from "../../shared/constants/socket.constant.js";


export const channelHandler = (io, socket) =>{

    socket.on(CHANNEL_ACTION.CHANNEL_JOIN,({channelId})=>{
      socket.join(`CHANNEL:${channelId}`);    
      console.log(socket.user.name,' has join channel ',channelId);
    });
    
    socket.on(CHANNEL_ACTION.CHANNEL_LEAVE, ({channelId})=>{
      socket.leave(`CHANNEL:${channelId}`); 
      console.log(socket.user.name,' has leave channel ',channelId);
    })
};