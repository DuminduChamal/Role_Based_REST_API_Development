const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const db = require("../models");
const User = db.user;
const constValues = require("../helpers/constant")

let userType;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    // const user = await User.findOne({username: })
    req.user=decoded;
    next();
  });
};

VerifyPermission = async (req, res, next) => {
    if (req.user.userRole === constValues.userRoles.ADMIN || req.user.userRole === constValues.userRoles.INSTRUCTOR){
        next();
        return;
    }
	try {
        var flag = false;
        const result = await db.sequelize.query(`select moduleName from users 
        join classes on users.classID = classes.classID 
        join class_module on classes.classID = class_module.classID
        join modules on class_module.moduleID = modules.moduleID 
        where userID = ${req.user.id};`, null, { raw: true })
        const modules = result[0].map(res => {
            return res.moduleName
        })
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            if(req.params.moduleName === module){
                flag = true;
                break;
            }
        };
        if (!flag) {
            res.status(401).send({
              message: "Unauthorized!"
            });
          }
        next()
    }catch(e) {
        res.status(500).send({ 
            success: false,
            message: e.toString()
        });
    }
};

isAdmin = (req, res,next) => {
	if(req.user.userRole!=="admin"){
		res.status(401).send({
			message: "Unauthorized Access"
		});
		return;
	}
	next();
	return;	
};

isInstuctor = (req, res,next) => {
	if(req.user.userRole!=="instructor"){
		res.status(401).send({
			message: "Unauthorized Access"
		});
		return;
	}
	next();
	return;	
};


const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isInstuctor: isInstuctor,
  VerifyPermission: VerifyPermission
};

module.exports = authJwt;