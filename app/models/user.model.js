const User = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      profilePic: {
        type: DataTypes.STRING(300),
        allowNull: false,
        default: "https:www.google.com",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default User;
