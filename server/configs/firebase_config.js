
// Service account access granted via service key (generated by Firebase)

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://art-website-d34be-default-rtdb.europe-west1.firebasedatabase.app"
});

module.exports = admin

