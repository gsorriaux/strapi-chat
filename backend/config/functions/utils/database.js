async function findChatuser(username, room) {
    console.log(username, room);
    const userExists = async () => {
        const result = await strapi
          .query("chatusers")
          .findOne({
            username,
            room,
            type: "public"
          });
        console.log(result);
        return result;
      };
      return userExists

}
async function createChatuser({ username, room, status, socketid }) {
    const entry = await strapi.query('chatusers').create({
        username,
        room,
        status,
        socketid
    });
    return entry;
}

async function userExists(id) {
    console.log("id",id)
    try {
        const user = await strapi
          .query("chatusers")
          .findOne({
              id: id
          });
        return user;
    } catch(err) {
        console.log("Error occured when fetching user", err);
    }
}

async function getUsersInRoom(room) {
    try {
        const usersInRoom = await strapi
        .query("chatusers")
        .find({ room })
        return usersInRoom;
    } catch(err) {
        console.log("Error.Try again!", err);
    }
}

async function deleteUser(socketid) {
    try {
        const user = await strapi
        .query("chatusers")
        .delete({socketid})
        return user;
    } catch(err) {
        console.log("Error while deleting the User", err);
    }
}

module.exports = {
    findChatuser,
    createChatuser,
    userExists,
    getUsersInRoom,
    deleteUser
}