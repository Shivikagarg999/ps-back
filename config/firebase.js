const admin = require('firebase-admin');
const serviceAccount = require('../pretty-saheli-firebase-adminsdk.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

module.exports = admin;