// const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const adminController = require("../controllers/admin.controller");
const classController = require("../controllers/class.controller");
const moduleController = require("../controllers/module.controller");
const authGuard = require("../middleware/auth.guard")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/login", controller.login);
  app.post("/api/instructors", authGuard.verifyToken, authGuard.isAdmin, adminController.createInstructor);
  app.post("/api/classes", authGuard.verifyToken, authGuard.isInstuctor, classController.createClass);
  app.get("/api/modules", authGuard.verifyToken, moduleController.getModules);
  app.get("/api/modules/:moduleName", authGuard.verifyToken, authGuard.VerifyPermission, moduleController.executeModule)
};