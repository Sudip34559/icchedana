const admin = require("firebase-admin");
const initializeSettings = require("../index");
const {privateKey} = require("../setting");

const initFirebase = async () => {
  try {
    // console.log(privateKey)
    await initializeSettings;
    admin.initializeApp({
      credential: admin.credential.cert(privateKey),
    });
    console.log("Firebase Admin SDK initialized successfully");
    return admin;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
};

module.exports = initFirebase();
