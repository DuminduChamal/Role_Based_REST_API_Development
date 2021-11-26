module.exports = (sequelize, Sequelize) => {
    const Module = sequelize.define("modules", {
        moduleID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        moduleName: {
            type: Sequelize.STRING,
        }
    });

    return Module;
};