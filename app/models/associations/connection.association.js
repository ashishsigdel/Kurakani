const connectionAssociation = (db) => {
  // Many Users to Many Roles
  db.Connection.belongsToMany(db.User, {
    through: "user_connection", // The name of the intermediate table
    foreignKey: "connectionId", // The foreign key in the "user_roles" table that references roles
    otherKey: "userId", // The foreign key in the "user_roles" table that references users
    as: "users", // An alias for the association
    onDelete: "CASCADE", // If a role is deleted, delete the user role as well
    onUpdate: "CASCADE", // If a role is updated, update the user role as well
  });

  db.Connection.belongsTo(db.Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default connectionAssociation;
