var express = require('express');
const logger = require('morgan');
const axios = require('axios');
const list = require('./data');
const { json } = require('express');
const firebase = require('./firebase');



//var apikey =	"0a7bc5fbd01564c3dc7b96c77700eb53";
var app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ 'extended': true }));
app.use(logger('dev'));
app.use(express.static('public'));   // html, image 등 정적파일 제공 폴더 지정


app.get('/', (req, res) => {
  res.sendFile('index.html')
})


//curl localhost:3000/user/tommy
app.get('/user/:id', (req, res) => {
  res.send(`User id is ${req.params.id}`); // Or res.send('User id is ' + req.params.id); 
})

// In zsh, u should try curl "http://localhost:{port}/user?id={ur-id}" //curl "http://localhost:3000/user?id=tommy"
app.get('/user', (req, res) => {
  res.send(`User id is ${req.query.id}`);
})

// curl -X POST localhost:3000/user -d '{"id" : "jyc", "name" : "Jae Young"}' -H "Content-Type: application/json"
app.post('/user', (req, res) => {
  console.log(req.body.name);
  res.send(req.body);
})

app.get('/music_list', (req, res) => {
  res.json(list);
})

app.get('/getCollectionId', async (req, res) => {
  let db = firebase.firestore();
  const snapshot = await db.collection('likes_collection').get().catch(e => console.log(e));
  let response = {};

  if (snapshot.empty) {
    console.log("No result");
    res.json({});
    return;
  }
  else {
    snapshot.forEach(doc => {
      if (doc.data().like == true) {
        response[doc.id] = doc.data().like;
        console.log(doc.id, '=>', doc.data());
      }
    })
  }
  console.log(response);
  res.json(response);
})


app.get('/getTrackId', async (req, res) => {

  let db = firebase.firestore();
  const snapshot = await db.collection('likes_track').get().catch(e => console.log(e));
  let response = {};

  if (snapshot.empty) {
    console.log("No result");
    res.json({});
    return;
  }
  else {
    snapshot.forEach(doc => {
      if (doc.data().like == true) {
        response[doc.id] = doc.data().like;
        console.log(doc.id, '=>', doc.data());
      }
    })
  }
  console.log(response);
  res.json(response);
})

app.get('/getArtistId', async (req, res) => {

  let db = firebase.firestore();
  const snapshot = await db.collection('likes_artist').get().catch(e => console.log(e));
  let response = {};

  if (snapshot.empty) {
    console.log("No result");
    res.json({});
    return;
  }
  else {
    snapshot.forEach(doc => {
      if (doc.data().like == true) {
        response[doc.id] = doc.data().like;
        console.log(doc.id, '=>', doc.data());
      }
    })
  }
  console.log(response);
  res.json(response);
})

app.get('/getFeed', async (req, res) => {

  let db = firebase.firestore();
  const snapshot = await db.collection('likes_artist').get().catch(e => console.log(e));
  let result = [];

  if (snapshot.empty) {
    console.log("No result");
    res.json([]);
    return;
  }
  else {
    snapshot.forEach(doc => {
      if (doc.data().like == true) {
        result.push(doc.id)
        console.log(doc.id, '=>', doc.data());
      }
    })
  }
  const artists = result.join();
  console.log(artists);

  const params = {
    id: artists,
    entity: 'song',
    limit: 5
  }
  let response = await axios.get('https://itunes.apple.com/lookup', { params: params }).catch(e => console.log(e));
  console.log(response.data);
  res.json(response.data);
})


app.get('/searchByLikes', async (req, res) => {
  let db = firebase.firestore();
  const snapshot = await db.collection('likes_track').get().catch(e => console.log(e));
  let result = [];

  if (snapshot.empty) {
    console.log("No result");
    res.json([]);
    return;
  }
  else {
    snapshot.forEach(doc => {
      if (doc.data().like == true) {
        result.push(doc.id)
        console.log(result);
        console.log(doc.id, '=>', doc.data());
      }
    })
  }

  const id_Params = result.join();

  const params = {
    id: id_Params,
    entity: 'song',
    limit: 0
  }

  var response = await axios.get('https://itunes.apple.com/lookup', { params: params }).catch(e => console.log(e));
  console.log(response.data);
  res.json(response.data);

})

app.get('/searchByArtist/:art', async (req, res) => {//id=549055025,366264156&entity=song&limit=5
  const params = {
    id: req.params.art,
    entity: 'song',
    limit: 5
  }
  let response = await axios.get('https://itunes.apple.com/lookup', { params: params }).catch(e => console.log(e));
  console.log(response.data);
  res.json(response.data);
})




app.get('/musicSearch/:option/:term', async (req, res) => {
  let opt;
  switch (req.params.option) {
    case '1':
      opt = 'song';
      break;
    case '2':
      opt = 'musicArtist'
      break;
    case '3':
      opt = 'album'
      break;
  }

  const params = {
    term: req.params.term,
    entity: opt,
    limit: 50
  }
  let response = await axios.get('https://itunes.apple.com/search', { params: params }).catch(e => console.log(e));
  console.log(response.data);
  res.json(response.data);
})

app.get('/MusicRank', async (req, res) => {//?method=chart.gettoptracks&api_key=027928f67af091170f3707ec275b1d2e&format=json
  const params = {
    method: "chart.gettoptracks",
    page: 1,
    limit: 50,
    api_key: "027928f67af091170f3707ec275b1d2e",
    format: "json",
  } // api규칙

  let response = await axios.get('http://ws.audioscrobbler.com/2.0/', { params: params }).catch(e => console.log(e));
  console.log(response.data);
  res.json(response.data);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
