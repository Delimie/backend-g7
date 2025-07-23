// Use for announce status
export const CHAT_EVENT = {
  NEW_MESSAGE: 'newMessage',
  SYNC_MESSAGE: 'syncMessage',
  CHAT_STATUS: 'chatStatus',
  CHAT_ERROR: 'chatError',
}

// Use for emit action
export const CHAT_ACTION = {
  CHAT_SEND: 'chat:message',
  CHAT_EDIT: 'chat:edit',
  CHAT_DELETE: 'chat:delete',
  CHAT_TYPING: 'chat:typing', // send when user start typing
  CHAT_REACTION: 'chat:reaction', // reaction to other or self chat
  CHAT_SYNC: 'chat:sync', // call for sync old chat when reconnect
}

export const USER_ACTION = {
  SET_STATUS: 'user:set-status', // online , away , ivisible
  UPDATE_PROFILE: 'user:update-profile', // update with the data user sending
  FRIEND_REQUEST: 'user:frend-request'
}

export const GROUP_ACTION = {
  GROUP_CREATE: 'group:create',
  GROUP_JOIN: 'group:join',
  GROUP_UPDATE: 'group:update',
  GROUP_LEAVE: 'group:leave',
  GROUP_DELETE: 'group:delete'
}

export const CHANNEL_ACTION = {
  CHANNEL_CREATE: 'channel:create',
  CHANNEL_JOIN: 'channel:join', // by default user access to all channel except private channel
  CHANNEL_UPDATE: 'channel:update',
  CHANNEL_LEAVE: 'channel:leave',
  CHANNEL_DELETE: 'channel:delete'
}

export const DM_ACTION = {
  DM_CREATE: 'dm:create', // user start message someone 1-1
  DM_READ: 'dm:read', //when user read the message
  DM_LEAVE: 'dm:leave', // leave dm room or when you block 
}

export const FILE_ACTION = {
  FILE_UPLOAD : 'file:upload', // show that file still uploading
  FILE_CANCEL : 'file:cancel', // cancel while still uploading
  FILE_COMPLETE : 'file:complete', // sending complete
  FILE_ERROR : 'file:error', // send update when error uploading file
}

export const MODERATOR_ACTION = {
  MODERATOR_KICK : 'mod:kick', // mod kick user out of channel or group
  MODERATOR_UPDATEROLE : 'mod:updaterole', // mod kick user out of channel or group
}

export const ADMIN_ACTION = {
  ADMIN_BAN : 'admin:ban', // Admin ban user
}

// Mostly on server side send to client
export const NOTI_ACTION = {
  NOTI_UPDATE: 'notification:update',
  NOTI_READ : 'notification:read', // remove red dot
  NOTI_CLEAR : 'notification:clear' // clear all notification alert
}

// Optional after this part
export const VOICE_ACTION = {
  VOICE_JOIN: 'voice:join', // join vioce room
  VOICE_LEAVE: 'voice:leave',
  VOICE_MUTE: 'voice:mute',
  SWITCH_CHANNEL: 'voice:switch-channel',
}
