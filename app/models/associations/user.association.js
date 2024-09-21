const userAssociation = (db) => {
  // one-to-many between User and RefreshToken
  db.User.hasMany(db.RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.User.hasMany(db.Connection, {
    foreignKey: "friendId",
    as: "friends",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
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

  db.User.hasMany(db.Message, {
    foreignKey: "senderId",
    as: "sender",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.User.hasMany(db.Message, {
    foreignKey: "receiverId",
    as: "receiver",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default userAssociation;
