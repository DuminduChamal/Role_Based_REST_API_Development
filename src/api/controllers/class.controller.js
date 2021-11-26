const db = require("../models");

const User = db.user;
const Class = db.class;
const Modules = db.module;
const constValues = require("../helpers/constant")

var generator = require('generate-password');
var bcrypt = require("bcryptjs");


exports.createClass = async (req, res) => {
  // get all students f// Username
  // compare with your req.students 
  // if srudent exists => return error, send unique student names
  try {
    const users = await User.findAll({
        where: {
            userType: "student"
        },
        // attributes : username,
        })
    
        // console.log(users);
        const similarStudents = users.filter(value => {
            return req.body.studentNameList.includes(value.username)
        });
        console.log(similarStudents)
        if (similarStudents.length !== 0) {
            res.status(400).send({
                message: "Send unique student names!",
                users: users,
                list: req.body.studentNameList
            });
            return;
        }
        
        // get class by the req.name
        // if class exists send already exists
        const className = await Class.findOne({
            where: {
              className: req.body.className
            }
          })
    
        console.log(className)
        if (className) {
            res.status(400).send({
              message: "Class name already exists!"
            });
            return;
        }
    
        // const class = create class
        // create class_modules // inserting many to many
        // gen password
        // create students (when creating set class -> above created class) -> loop , createAll 
        // success 
        const createdClass = await  Class.create({
            className: req.body.className,
            // moduleList: req.body.moduleList,
            // studentNameList: req.body.studentNameList
        })

        // TODO: genereate correctly
        const password = generator.generate({
            length: 10,
            numbers: true
        });


        for (let i = 0; i < req.body.studentNameList.length; i++) {
            const student = req.body.studentNameList[i];
            await User.create({
                username: student,
                password: bcrypt.hashSync(password, 8),
                userType: constValues.userRoles.STUDENT,
                classID: createdClass.classID
            })
        }

        const modules = await Modules.findAll({
            where: {
                moduleName: [req.body.moduleList]
            },
        })
        
        for (let i = 0; i < modules.length; i++) {
            const mod = modules[i];
            await createdClass.addModule(mod)
        }

        res.status(200).send({ 
            password: password,
        });
  } catch (e) {
        res.status(500).send({ 
                success: false,
                message: e.toString()
        });
  }
  
        
};