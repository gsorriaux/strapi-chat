'use strict';

const fs = require("fs");
const path = require("path");

const {
  findChatuser, 
  createChatuser,
  userExists
} = require('./utils/database');

const {
  categories,
  products
} = require("../../data/data");

const findPublicRole = async () => {
  const result = await strapi
    .query("role", "users-permissions")
    .findOne({
      type: "public"
    });
  return result;
};

const setDefaultPermissions = async () => {
  const role = await findPublicRole();
  const permissions_applications = await strapi
    .query("permission", "users-permissions")
    .find({
      type: "application",
      role: role.id
    });
  await Promise.all(
    permissions_applications.map(p =>
      strapi
      .query("permission", "users-permissions")
      .update({
        id: p.id
      }, {
        enabled: true
      })
    )
  );
};

const isFirstRun = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup"
  });
  const initHasRun = await pluginStore.get({
    key: "initHasRun"
  });
  await pluginStore.set({
    key: "initHasRun",
    value: true
  });
  return !initHasRun;
};

const getFilesizeInBytes = filepath => {
  var stats = fs.statSync(filepath);
  var fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
};

const createSeedData = async (files) => {

  const handleFiles = (data) => {

    var file = files.find(x => x.includes(data.slug));
    file = `./data/uploads/${file}`;

    const size = getFilesizeInBytes(file);
    const array = file.split(".");
    const ext = array[array.length - 1]
    const mimeType = `image/.${ext}`;
    const image = {
      path: file,
      name: `${data.slug}.${ext}`,
      size,
      type: mimeType
    };
    return image
  }


  const categoriesPromises = categories.map(({
    ...rest
  }) => {
    return strapi.services.category.create({
      ...rest
    });
  });


  const productsPromises = products.map(async product => {
    const image = handleFiles(product)

    const files = {
      image
    };

    try {
      const entry = await strapi.query('product').create(product);

      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'product'
        });
      }
    } catch (e) {
      console.log(e);
    }

  });

  await Promise.all(categoriesPromises);
  await Promise.all(productsPromises);
};

module.exports = async () => {
  const shouldSetDefaultPermissions = await isFirstRun();
  if (shouldSetDefaultPermissions) {
    try {
      console.log("Setting up your starter...");
      const files = fs.readdirSync(`./data/uploads`);
      await setDefaultPermissions();
      await createSeedData(files);
      console.log("Ready to go");
    } catch (e) {
      console.log(e);
    }
  }
  var io = require('socket.io')(strapi.server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on('connection', function(socket) {
    socket.on('join', async({ username, room }, callback) => {
        try {
            const userExists = await findChatuser(username, room);

            if(userExists.length > 0) {
                callback(`User ${username} already exists in room no${room}. Please select a different name or room`);
            } else {
                const user = await createChatuser({
                    username: username,
                    room: room,
                    status: "ONLINE",
                    socketid: socket.id
                });

                if(user) {
                    console.log("user.room", user.room);
                    socket.join(user.room);
                    socket.emit('welcome', {
                        user: 'bot',
                        text: `${user.username}, Welcome to room ${user.room}.`,
                        userData: user
                    }); 
                    socket.broadcast.to(user.room).emit('message', {
                        user: 'bot',
                        text: `${user.username} has joined`,
                    });

                } else {
                    callback(`user could not be created. Try again!`)
                }
            }
            callback();
        } catch(err) {
            console.log("Err occured, Try again!", err);
        }
    })
    socket.on('sendMessage', async(data) => {
      try {
          console.log(data);
          const user = await userExists(data.user.userData.id);
          if(user) {
              io.to(user.room).emit('message', {
                  user: user.username,
                  text: data.message,
              });
          }
      } catch(err) {
          console.log("err inside catch block", err);
      }
    });
  });
};
