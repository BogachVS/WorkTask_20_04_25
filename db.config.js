import { Sequelize } from 'sequelize';
const sequelize = new Sequelize("TestDatabase", "user","1111",
    {
        host: "WIN-V4EP2AJOER1",
        dialect: "mssql",
        dialectOptions: {
            options: {
                trustServerCertificate: true,
                trustedConnection: true
            }
        },
        logging: false
    });

export default sequelize;