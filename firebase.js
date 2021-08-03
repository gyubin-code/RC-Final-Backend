var firebase = require('firebase-admin');
var serviceAccount = require("D:/아주대학교/실전코딩/token/pr-coding-b3f2e-firebase-adminsdk-sxqht-cf343be446");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

module.exports = firebase;