// const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const adminController = require("../controllers/admin.controller");
const classController = require("../controllers/class.controller");
const moduleController = require("../controllers/module.controller");
const authGuard = require("../middleware/auth.guard")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
 
   
  /** 
   * @swagger
   * /api/auth/login:
   *  post:
   *    description: Login
   *    parameters:
   *      - name: Requesed body
   *        description: username and password
   *        in: body
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: Success
   */
  app.post("/api/auth/login", controller.login);


  /**
   * @swagger
   * /api/instructors:
   *  post:
   *    description: Create instructor
   *    parameters:
   *      - name: x-access-token
   *        description: x-access-token of the admin
   *        in: header
   *        required: true
   *        type: string
   *      - name: Requested body
   *        description: Instructor name as username
   *        in: body
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: Success
   */
  app.post("/api/instructors", authGuard.verifyToken, authGuard.isAdmin, adminController.createInstructor);


  /**
   * @swagger
   * /api/classes:
   *  post:
   *    description: Create class
   *    parameters:
   *      - name: x-access-token
   *        description: x-access-token of the user
   *        in: header
   *        required: true
   *        type: string
   *      - name: Requsted body
   *        description: Class details as className, moduleList, and studentNameList
   *        in: body
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: Success
   */
  app.post("/api/classes", authGuard.verifyToken, authGuard.isInstuctor, classController.createClass);

  /**
   * @swagger
   * /api/modules:
   *  get:
   *    description: Get modules by the user role
   *    parameters:
   *      - name: x-access-token
   *        description: x-access-token of the useR
   *        in: header
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: Success
   */
  app.get("/api/modules", authGuard.verifyToken, moduleController.getModules);


  /**
   * @swagger
   * /api/modules/{moduleName}:
   *  get:
   *    description: Executes modules by the user role
   *    parameters:
   *      - name: x-access-token
   *        description: x-access-token of the user
   *        in: header
   *        required: true
   *        type: string
   *      - name: moduleName
   *        description: Module name that want to execute
   *        in: path
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: Success
   */
  app.get("/api/modules/:moduleName", authGuard.verifyToken, authGuard.VerifyPermission, moduleController.executeModule);
};