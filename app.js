var express = require('express');
const logger = require('morgan');
const axios = require('axios');
const list = require('./data');
const firebase = require('./firebase');

var app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({'extended' : true}));
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

app.get('/music_list', (req,res) => {
  res.json(list);
})
app.get('/searchByArtist/:art', async (req, res) => {//id=549055025,366264156&entity=song&limit=5
  const params = {
    id : req.params.art,
    entity : 'song',
    limit : 5
  }
  var response = await axios.get('https://itunes.apple.com/lookup', {params : params}).catch(e => console.log(e));
  console.log(response.data);
  res.json(response.data);
})

app.get('/getCollectionId'), async(req,res)=>{
    var db = firebase.firestore();
    const snapshot = await db.collection('likes').get().catch(e => console.log(e));
    var response = [];

    if (snapshot.empty) {
        console.log("No result");
        res.json([]);
        return;
        }
    else {
        snapshot.forEach(doc => {
            if(doc.data().like==true){
                response.push(doc.id)
                console.log(doc.id, '=>', doc.data());
            }
        })
    }
    res.send(response.data);
}

app.get('/searchByLikes', async (req, res) => {
    var db = firebase.firestore();
        const snapshot = await db.collection('likes').get().catch(e => console.log(e));
    var result = [];

    if (snapshot.empty) {
        console.log("No result");
        res.json([]);
        return;
        }
        else {
            snapshot.forEach(doc => {
                if(doc.data().like==true){
                    result.push(doc.id)
                    console.log(result);
                    console.log(doc.id, '=>', doc.data());
                }
            })
        }

    const id_Params = result.join();

    const params = {
       id :  id_Params,
       entity : 'song',
       limit : 0
    }

    var response = await axios.get('https://itunes.apple.com/lookup',{params : params}).catch(e => console.log(e));
    console.log(response.data);
    res.json(response.data);

})

app.get('/musicSearch/:term', async (req, res) => {
  const params = {
    term : req.params.term,
    entity : "album",
  }
  var response = await axios.get('https://itunes.apple.com/search', {params : params}).catch(e => console.log(e));
  console.log(response.data);
  res.json(response.data);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
