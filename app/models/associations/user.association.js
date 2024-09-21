const userAssociation = (db) => {
  // one-to-many between User and RefreshToken
  db.User.hasMany(db.RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default userAssociation;
