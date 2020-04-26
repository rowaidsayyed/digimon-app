'use strict';
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');
client.connect()
.then(() =>  app.listen(PORT,()=> console.log('Hello listing to ',PORT)));

let allDigimons =[];
/******************************************************************************************************* */
app.get('/',getIndex);
app.post('/addfavorite/:diId',getfavorite);
app.get('/favorite',allfavorite);
app.post('/details/:diId',detailsfunc);
app.delete('/delete/:diId',deletedunc);
app.put('/update/:diId',updatefunc);

/******************************************************************************************************* */
function updatefunc(req,res){
  let {name,level,img}=req.body;
  let sql = 'UPDATE digimonsTable SET name=$1,image=$2,level=$3 WHERE id=$4;';
  let values = [name,img,level,req.params.diId];
  client.query(sql,values)
    .then(data =>{
      res.redirect('/favorite')
    });
}


function deletedunc(req,res){
  let sql = 'DELETE FROM digimonsTable WHERE id=$1;';
  let values = [req.params.diId];
  client.query(sql,values)
    .then(data => {
      res.redirect('/');
    });

}

function getIndex(req,res){
  allDigimons =[];
  let url = 'https://digimon-api.herokuapp.com/api/digimon';
  superagent.get(url)
    .then(data => {
      let renderData = data.body.map(e => {
        return new Digimon(e);
      });
      res.render('pages/index',{data:renderData});
    });
}

function getfavorite(req,res){
  let favoritedigimonID = req.params.diId;
  let {name,img,level} = allDigimons[favoritedigimonID];
  let sql = 'INSERT INTO digimonsTable (name,image,level) VALUES ($1,$2,$3);';
  let values = [name,img,level];
  client.query(sql,values)
    .then(() => {
      res.redirect('/favorite');
    });
}


function allfavorite(req,res){
  let sql = 'SELECT * FROM digimonsTable;';
  client.query(sql)
    .then(results => {
      res.render('pages/favorite',{data:results.rows});
    });
}


function detailsfunc(req,res){
  let values = [req.params.diId];
  let sql = 'SELECT * FROM digimonsTable WHERE id=$1;';
  client.query(sql,values)
    .then(results => {
      res.render('pages/details',{data:results.rows});
    });
}

function Digimon(digimonData){
this.name = digimonData.name;
this.img = digimonData.img;
this.level = digimonData.level;
allDigimons.push(this);
}





