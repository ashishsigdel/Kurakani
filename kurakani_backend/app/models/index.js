import { Sequelize, DataTypes, Op, sequelize } from "../database/dbConfig.js";
import associations from "./associations/index.js";

import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";
import Connection from "./connection.model.js";
import ConnectionRequest from "./connectionRequest.model.js";
import Conversation from "./conversation.model.js";
import Message from "./message.model.js";

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.DataTypes = DataTypes;
db.Op = Op;

db.User = User(sequelize, Sequelize, DataTypes);
db.RefreshToken = RefreshToken(sequelize, Sequelize, DataTypes);
db.Connection = Connection(sequelize, Sequelize, DataTypes);
db.ConnectionRequest = ConnectionRequest(sequelize, Sequelize, DataTypes);
db.Conversation = Conversation(sequelize, Sequelize, DataTypes);
db.Message = Message(sequelize, Sequelize, DataTypes);

associations(db);
export default db;
