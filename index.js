const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '',
  database : 'clasenodefinal'
});

//Conectarnos a la base de datos
connection.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send("Bienvenido a la API de Liliana Escobar Pacheco");
});

app.get('/videojuegos', (req, res) => {
  //Consultar los personajes
  connection.query('SELECT * FROM videojuegos', function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
    }
    //Regresar un objeto json con el listado de los personajes.
    res.status(200).json(results);
  });
});


app.get('/videojuegos/:id', (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) {
    res.status(400).json({ error: 'parametros no validos.'});
    return;
  }
  //Consultar los personajes
  connection.query(`SELECT * FROM videojuegos WHERE id=?`, [id] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    if(results.length === 0) {
      res.status(404).json({ error: 'videojuegos no existente.'});
      return;
    }
    //Regresar un objeto json con el listado de los personajes.
    res.status(200).json(results);
  });
});

app.post('/videojuegos', (req, res) => {
  console.log("req", req.body);
  const nombre = req.body.nombre;
  const genero = req.body.genero;
  const precio = req.body.precio;
  connection.query(`INSERT INTO videojuegos (nombre, genero, precio) VALUES (?,?,?)`, [nombre,genero,precio] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});