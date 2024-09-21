const connectionRequestAssociation = (db) => {
  db.ConnectionRequest.belongsTo(db.User, {
    foreignKey: "senderId",
    as: "sender", // Alias for the association
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.ConnectionRequest.belongsTo(db.User, {
    foreignKey: "receiverId",
    as: "receiver", // Alias for the association
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default connectionRequestAssociation;
