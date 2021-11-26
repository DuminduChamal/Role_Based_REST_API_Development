module.exports = (sequelize, Sequelize) => {
    const Class = sequelize.define("classes", {
        classID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        className: {
            type: Sequelize.STRING
        }
    });
  
    return Class;
  };