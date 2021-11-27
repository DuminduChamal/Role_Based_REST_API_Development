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
   * components:
   *  schemas:
   *    User:
   *      type: object
   *      required:
   *        - username
   *        - password
   *      properties:
   *        username:
   *          type: string
   *          description: Username of the user
   *        password:
   *          type: string
   *          description: Password of the user 
   *      example:
   *        username: admin
   *        password: '1234'
   *    
   *    Instructor:
   *      type: object
   *      required:
   *        - username
   *      properties:
   *        username:
   *          type: string
   *          description: Username of the user
   *      example:
   *        username: instructor
   * 
   *    Class:
   *      type: object
   *      required:
   *        - className
   *        - moduleList
   *        - studentNameList
   *      properties:
   *        username:
   *          type: string
   *          description: Username of the user
   *        moduleList:
   *          type: Array
   *          description: Array of selected modules
   *        studentNameList:
   *          type: Array
   *          description: Array of student names
   *      example:
   *        className: class1
   *        moduleList: [IMAGE_PROCESSING, VOICE_REC]
   *        studentNameList: [Nimal, Kamal, Hashan]
   *    
   */ 

  
   
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Returning the access token
 *       500:
 *         description: Some server error
 */
  app.post("/api/auth/login", controller.login);


  /**
   * @swagger
   * /api/instructors:
   *  post:
   *    summary: Create instructor
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Instructor'
   *    parameters:
   *      - name: x-access-token
   *        description: x-access-token of the admin
   *        in: header
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: Successfully added an Instructor and returning the username and password for the instructor
   *      500:
   *        description: Some server error
   */
  app.post("/api/instructors", authGuard.verifyToken, authGuard.isAdmin, adminController.createInstructor);


   /**
   * @swagger
   * /api/classes:
   *  post:
   *    summary: Create class
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Class'
   *    parameters:
   *      - name: x-access-token
   *        description: x-access-token of the instructor
   *        in: header
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: Successfully added a class and returning the password for all the inserted students
   *      500:
   *         description: Some server error
   */
  app.post("/api/classes", authGuard.verifyToken, authGuard.isInstuctor, classController.createClass);


  
  /**
   * @swagger
   * /api/modules:
   *  get:
   *    summary: Get modules by the user role
   *    parameters:
   *      - name: x-access-token
   *        description: x-access-token of the user
   *        in: header
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: Success and returning the modules of the user
   */
  app.get("/api/modules", authGuard.verifyToken, moduleController.getModules);


  /**
   * @swagger
   * /api/modules/{moduleName}:
   *  get:
   *    summary: Executes modules by the user role
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
   *        description: Success and executing the relevent module as per user access to modules
   */
  app.get("/api/modules/:moduleName", authGuard.verifyToken, authGuard.VerifyPermission, moduleController.executeModule);
};