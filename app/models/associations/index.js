import userAssociation from "./user.association.js";
import refreshTokenAssociation from "./refreshToken.association.js";

export default function assotiations(db) {
  userAssociation(db);
  refreshTokenAssociation(db);
}
