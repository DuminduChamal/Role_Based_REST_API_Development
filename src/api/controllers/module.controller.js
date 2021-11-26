const jwt = require("jsonwebtoken");
const db = require("../models");
const constValues = require("../helpers/constant")

const Modules = db.module;


exports.getModules = async (req, res) => {
  if (req.user.userRole === constValues.userRoles.ADMIN || req.user.userRole === constValues.userRoles.INSTRUCTOR) {
    const result = await Modules.findAll({})
    const modules = result.map(res => {
        return res.moduleName
    })
    res.status(200).send({ 
        modules
    });
  } else {
     
    try {
        const result = await db.sequelize.query(`select moduleName from users 
        join classes on users.classID = classes.classID 
        join class_module on classes.classID = class_module.classID
        join modules on class_module.moduleID = modules.moduleID 
        where userID = ${req.user.id};`, null, { raw: true })
        const modules = result[0].map(res => {
            return res.moduleName
        })
        res.status(200).send({ 
            modules,
        });
    } catch (e) {
        res.status(500).send({ 
            success: false,
            message: e.toString()
        });
    }
    
  }
};

exports.executeModule = async (req, res) => {
    console.log(req.params.moduleName)
    const result = await Modules.findAll({})
    const modules = result.map(res => {
        return res.moduleName
    })
    for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        if(req.params.moduleName === module){
            res.status(200).send(`Hello Module ${req.params.moduleName}`);
        }
    }
    res.status(400).send("Module not found!");
    
};
