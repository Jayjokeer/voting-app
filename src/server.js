const { urlencoded } = require('body-parser');
const express= require('express');
const mysql= require('mysql');
const ejs= require('ejs');
const bodyParser = require('body-parser');

PORT=7000;
const app= express()
//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.engine('html',require('ejs').renderFile)
app.set('view engine','ejs')
app.use(express.json())
//connecting mysql to express
const db = mysql.createConnection({
    host:'sql7.freesqldatabase.com',
    user:'sql7603391',
    password:'tNnQhbYpVE',
    database:'sql7603391'
})
//connecting the database
db.connect(err=>{
    if(err){
        throw err
    }
    console.log('connected')
})

app.get('/',async(req,res)=>{
    let sql= 'SELECT party_abbreviation AS party,party_score AS score FROM announced_pu_results WHERE polling_unit_uniqueid= 8;'
    db.query(sql,(err,result)=>{
        if(err){
            throw err
        }

        const data= result
        
        res.render('home',{data:data})
    })
})

app.get('/summed',(req,res)=>{
    let sql= 'SELECT SUM(party_score) AS allres FROM `announced_pu_results` WHERE polling_unit_uniqueid IN (8,5,6,7)'
    db.query(sql,(err,result)=>{
        if(err){
            throw err
        }
        let data = result
        
        res.render('summed',{data:data})
    })
})

app.get('/last',(req,res)=>{
    res.render('last')
})
app.post('/last',(req,res)=>{
    var pdp=req.body.pdp;
    var apc=req.body.apc;
    var dpp=req.body.dpp;
    var nnp=req.body.nnp;
    var cdc=req.body.cdc;

   let sql=`INSERT INTO new_polling_unit(pdp,apc,nnp,cdc,dpp) VALUES ("${pdp}","${apc}","${nnp}","${cdc}","${dpp}")`
    db.query(sql,(err,result)=>{
        if(err){
            throw err
        }
        
        res.redirect('/')
    })
})

app.listen(PORT,()=>{
    console.log(`app running on http://localhost:${PORT}`)
})