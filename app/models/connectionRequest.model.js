import RequestStatus from "../enums/requestStatus.js";

const ConnectionRequest = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "ConnectionRequest",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      senderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(Object.values(RequestStatus)),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default ConnectionRequest;
