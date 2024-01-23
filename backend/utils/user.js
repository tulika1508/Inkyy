const users = [];

// add user to list
const addUser = ({name,userId,roomId,host,presenter,socketId}) => {
  const user = { name,userId,roomId,host,presenter,socketId};

  users.push(user);
  return users.filter((user)=>user.roomId===roomId);
};
// remove user from list
const removeUser = (id) => {
  const index = users.findIndex((user) => user.socketId === id);

  if (index !== -1) {
    users.splice(index, 1);
    return users;
  }
};

//get user from list
const getUser = (id) => {
  return users.find((user)=>user.socketId===id);
  
};

//get all user from room
const getUsersInRoom=(id)=>{
  return users.filter((user)=>user.socketId===id);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};