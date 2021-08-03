const firebase = require('firebase');

// 그 데이터를 아래와 같이 변환한다.
  var firebaseConfig = {
      apiKey: "AIzaSyD1aadf-znXuZnDcXV82uhde2GpT7xqwGU",
      authDomain: "procoding-mui.firebaseapp.com",
      projectId: "procoding-mui",
      storageBucket: "procoding-mui.appspot.com",
      messagingSenderId: "363471687026",
      appId: "1:363471687026:web:f68918ee694c6cc35961eb"
    };
  
//
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;


