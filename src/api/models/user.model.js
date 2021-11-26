module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        userID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        userType: {
            type: Sequelize.STRING
        }
    });
  
    return User;
  };