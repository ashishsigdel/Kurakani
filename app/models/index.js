import { Sequelize, DataTypes, Op, sequelize } from "../database/dbConfig.js";
import User from "./user.model.js";
import RefreshToken from "./refreshtoken.model.js";

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.DataTypes = DataTypes;
db.Op = Op;

db.User = User(sequelize, Sequelize, DataTypes);
db.RefreshToken = User(sequelize, Sequelize, DataTypes);

export default db;
