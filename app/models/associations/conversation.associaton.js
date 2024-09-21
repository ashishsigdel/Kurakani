const conversationAssociation = (db) => {
  // Conversation can have multiple Connections
  db.Conversation.hasMany(db.Connection, {
    foreignKey: "conversationId",
    as: "connections",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default conversationAssociation;
