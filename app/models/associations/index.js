import userAssociation from "./user.association.js";
import refreshTokenAssociation from "./refreshToken.association.js";
import connectionAssociation from "./connection.association.js";
import connectionRequestAssociation from "./connectionRequest.association.js";
import conversationAssociation from "./conversation.associaton.js";

export default function assotiations(db) {
  userAssociation(db);
  refreshTokenAssociation(db);
  connectionAssociation(db);
  connectionRequestAssociation(db);
  conversationAssociation(db);
}
