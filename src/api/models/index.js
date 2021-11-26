const config = require("../../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model")(sequelize, Sequelize);
db.class = require("../models/class.model")(sequelize, Sequelize);
db.module = require("../models/module.model")(sequelize, Sequelize);

db.class.hasMany(db.user, {
    foreignKey: "classID",
});

db.class.belongsToMany(db.module, {
    through: "class_module",
    foreignKey: "classID"
});

db.module.belongsToMany(db.class, {
    through: "class_module",
    foreignKey: "moduleID"
});

module.exports = db;