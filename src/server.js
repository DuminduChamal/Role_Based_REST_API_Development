const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var bcrypt = require("bcryptjs");
const constValues = require("./api/helpers/constant")


const app = express();

var corsOptions = {
  origin: "http://localhost:4000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/test", (req, res) => {
  res.json({ message: "Testing run" });
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


const db = require("../src/api/models");
const User = db.user;
const Module = db.module;
const Class = db.class;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

require('./api/routes/auth.routes')(app);


async function initial() {
  await User.create({
    userID: 1,
    username: "admin",
    password: bcrypt.hashSync('1234',8),
    // userType: userRole.ADMIN
    userType: constValues.userRoles.ADMIN
  });

 

  const createdClass =  await Class.create({
    className: "a",
  })

  await User.create({
    userID: 2,
    username: "dumi",
    password: bcrypt.hashSync('1234',8),
    // userType: userRole.ADMIN
    userType: constValues.userRoles.STUDENT,
    classID: createdClass.classID
  });

  const mod1 = await Module.create({moduleName: constValues.modules.FACE_DETECT})
  
  const mod2 = await Module.create({moduleName: constValues.modules.IMAGE_PROCESSING})
  
  const mod3 =  await Module.create({moduleName: constValues.modules.VOICE_REC})

  await createdClass.addModule(mod1)
  await createdClass.addModule(mod2)
  // const router = require('./api/routes');
  // app.use('/',router);

}