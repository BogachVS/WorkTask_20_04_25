import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("bogach", "postgres", "root", {
    host: "localhost",
    dialect: "postgres",
    logging: false
});

export default sequelize;
