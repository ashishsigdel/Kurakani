const userAssociation = (db) => {
  // one-to-many between User and RefreshToken
  db.User.hasMany(db.RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Many Users to Many Connection
  db.User.belongsToMany(db.Connection, {
    through: "user_connection", // The name of the intermediate table
    foreignKey: "userId", // The foreign key in the "user_roles" table that references users
    otherKey: "connectionId", // The foreign key in the "user_roles" table that references roles
    as: "connections", // An alias for the association
    onDelete: "CASCADE", // If a user is deleted, delete the user role as well
    onUpdate: "CASCADE", // If a user is updated, update the user role as well
  });

  db.User.hasMany(db.ConnectionRequest, {
    foreignKey: "senderId",
    as: "sentRequests",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.User.hasMany(db.ConnectionRequest, {
    foreignKey: "receiverId",
    as: "receivedRequests",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default userAssociation;
