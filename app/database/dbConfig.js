import dbData from "./dbData.js";
import EnvType from "../enums/envType.js";

const dbConfig = dbData[process.env.NODE_ENV || EnvType.DEV];

import { Sequelize, DataTypes, Op } from "sequelize";

/**
 * Sequelize instance
 */
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    // logging: process.env.NODE_ENV === EnvType.DEV ? console.log : false,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+00:00",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

export { sequelize, DataTypes, Op, Sequelize };
