///Cours

/*const path =require('path')
const express = require('express')
var app = require ('express')()
app.set('port',8080)


app.set('views',_dirname+'/views')
app.set('view engine','ejs')
app.use('/',express.static(path.join(_dirname,'node_modules/jquery/dist')))
app.use('/',express.static(path.join(_dirname,'node_modules/bootstrop/dist')))

app.get('/name',function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(require('./template').content);
    res.end()
})


app.get('/metrics.json', (req, res) => {
    metrics.get((err, data) => {
      if(err) throw err
      res.status(200).json(data)
    })
  })*/
///TP
express = require('express')
app = express()

app.set('port', 1337)

app.listen(
  app.get('port'), 
  () => console.log(`server listening on ${app.get('port')}`)
)



app.get('/', function (req, res) {
  res.send('Bonjour! Ma présentation est caché sous mon prénom :). Avce url /hello/MonPrenom')
})

app.get('/hello/:name',function (req, res){
  if(req.params.name ==='yuchen'){
    res.send("Hello " + req.params.name +" Je suis Yuchen, 23ans, Je vie a Paris dans le 19eme et je suis une etudiante Ingenieur.")
  }else
  {
    res.send("Hello "+ req.params.name)
  }
  }
)
app.use(function (req,res){
  res.send("Error 404. Url non trouvé, esseyer encord :)")
}
)
