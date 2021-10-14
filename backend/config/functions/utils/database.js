async function findChatuser(username, room) {
    // try {
    //     const userExists = await strapi.services.users.find({ username, room });
    //     return userExists;
    // } catch(err) {
    //     console.log("error while fetching", err);
    // }
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

module.exports = {
    findChatuser,
    createChatuser,
    userExists
}