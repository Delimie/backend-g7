import { GROUP_ACTION } from "../../shared/constants/socket.constant.js";


export const groupHandler = (io, socket) =>{

    // Handle Join Group
    socket.on(GROUP_ACTION.GROUP_JOIN, ({ groupId }) => {
        socket.join(`GROUP:${groupId}`);
        console.log(socket.user.name,' has join group ',groupId);
    });

}