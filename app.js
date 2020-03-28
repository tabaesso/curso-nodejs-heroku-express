var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var app = express();

app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('views', './views');
app.set('view engine', 'jade');

app.route('/')
    .get(function (req, resp) {
        listarCursos(resp);  
    })
    .post(function (req, resp) {
        var curso = {nome: req.body.nome, categoria: req.body.categoria};
        
        inserirCurso(curso, function () {
            listarCursos(resp);
        })
    })

app.get('/', function (req, resp) {
    resp.render('index', {nome: 'TreinaWeb'});
});

app.listen(process.env.PORT, function () {
    console.log('App rodando na porta 3000');
})

var connection = 'mongodb+srv://tabata:tabata123@ndstr-k8dbv.azure.mongodb.net/test?retryWrites=true&w=majority';

function listarCursos(resp){
    MongoClient.connect(connection, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,}, function (err, database) {
            const myDB = database.db('treinaweb');
            myDB.collection('cursos').find().sort({nome: 1}).toArray(function(err, result){
                console.log(333, result)
                resp.render('index', {data: result});
            })
   })
}

function inserirCurso(obj, callback) {

    MongoClient.connect(connection, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,}, function (err, database) {
            const myDB = database.db('treinaweb');
            myDB.collection('cursos').insertOne(obj, function (err, result) {
                callback();
            })
   })
}