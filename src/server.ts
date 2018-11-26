import express = require('express')
import bodyparser = require('body-parser')
import morgan = require('morgan')
import session = require('express-session')
import levelSession = require('level-session-store')
import path = require('path')
import { UserHandler, User } from './users'
import { MetricsHandler, Metric } from './metrics'


const app = express()
const port: string = process.env.PORT || '8080'

const dbMetrics = new MetricsHandler('./db/metrics')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.use(morgan('dev'))
app.use(session({
    secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.set('view',__dirname+'../views')
app.set('view engine',ejs)
app.use('/',express.static(path.join(__dirname,'../node_modules/jquery/dist')))
app.use('/',express.static(path.join(__dirname,'../node_modules/bootstrap/dist')))

/*
    Authentication
*/
const authRouter = express.Router()
authRouter.get('/login',function(req:any,res:any){
    res.render('login')
})

app.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/login')
  })

  app.post('/login', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
      if (err) next(err)
      if (result === undefined || !result.validatePassword(req.body.username)) {
        res.redirect('/login')
      } else {
        req.session.loggedIn = true
        req.session.user = result
        res.redirect('/')
      }
    })
  }

  const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
      next()
    } else res.redirect('/login')
  }
  
  app.get('/', authCheck, (req: any, res: any) => {
    res.render('index', { name: req.session.username })
  })
/*
  Users
*/ 

const userRouter = express.Router()
userRouter.get('/:username',function(req:any,res:any,next:,any){
    dbUser.get('user:$')
})
userRouter.post('/',function(req:any,res:any, next:any){
    dbUser.get(req.body.username, function(err:Error| null,result?:User){
        if(!err||result !== undefined){
            res.status(409).send("user already exist")
        }
        dbUser.save(req.body,function(err:Error|null)){
            if(err)next(err)
            res.status(201).send("user persisted")
        }
    })
})

/* 
    Root
*/

app.use(function (req: any, res: any, next: any) {
    console.log(req.method + ' on ' req.url)
    next()
  })
  
const router =express.Router()

router.use(function (req:any,res:any,next:any){
    console.log("called metrics router")
})

router.get('/:id',(req:any, res:any)=>{
  dbMet.get(req.parames.id,(err:Error | null, result?: Metric[])=>{
      if(err) throw err
      if(result == undefined){
          res.write('no result')
          res.send()
      }else res.json(result)
  })
})

router.post('/metrics/:id',(req:any,res:any)=>{
    dbMetrics.save(req.parames.id,req.body,(err:Error|null)=>{
        if(err){
            res.status(500).send(err)
        }throw err
        res.status(200).send()
    })
})

app.use('/metrics',authCheck,router)

app.use(function (err: Error, req: any, res: any, next: any) {
    console.log('got an error')
    console error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log('server is listening on port ${port}')
})




