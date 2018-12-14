import express = require('express')
import bodyparser = require('body-parser')
import morgan = require('morgan')
import session = require('express-session')
import levelSession = require('level-session-store')
import path = require('path')
import { LevelDB } from "./leveldb";
import { UserHandler, User } from './users'
import { MetricsHandler, Metric } from './metrics'

const LevelStore = levelSession(session)

//initialisation des routers
const port: string = process.env.PORT || '8080'
const app = express()
const authRouter = express.Router()
const userRouter = express.Router()
const metricsRouter = express.Router()

///instanciation les connextion des bases
const db = LevelDB.open('./db/app')
const dbMetrics = new MetricsHandler(db) //ouverture de connextion au base
const dbUser = new UserHandler(db)

///configuration du main app
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.use(morgan('dev'))
app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))
app.set('views',__dirname+'/../views')
app.set('view engine','ejs')
app.use('/',express.static(path.join(__dirname,'../node_modules/jquery/dist')))
app.use('/',express.static(path.join(__dirname,'../node_modules/bootstrap/dist')))


///Authentication

//login


authRouter.get('/login',function(req:any,res:any){
    res.render('login');
})

authRouter.post('/login', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
      if (err) {
        console.log("00")
        res.status(401).send("Error de login")
        next(err)
      }
      else if (result === undefined || !result.validatePassword(req.body.username)) {
        console.log("0")
        res.redirect('/login')
        next(err)
      } else {
        console.log("1")
        req.session.loggedIn = true
        req.session.user = result
        res.redirect('/')
        console.log("2")
      }
    })
})

authRouter.get('/signup',function(req:any,res:any){
    res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
    if(req.session.loggedIn){
        delete req.session.loggedIn
        delete req.session.user
    }
    res.redirect('/login')
})


app.use(authRouter)

 //authCheck = authMiddleware
  const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
      next()
    } else res.redirect('/login')
  } 

/*
  Root
*/

app.get('/', authCheck, (req: any, res: any) => {
    console.log("3")
    res.render('index', { name: req.session.username })
    
})

/*
  Users
*/ 



userRouter.get('/:username',function( req:any , res:any , next:any){
    dbUser.get(req.parames.username,function(err:Error|null,result?:User){
        if(err || result === undefined){
            res.status(404).send("user not found")
        }
        else{
            res.status(200).json(result)
        }
    })
})


userRouter.post('/signup',function(req:any , res:any , next:any){
    dbUser.get(req.body.username, function(err:Error| null,result?:User){
        if(!err||result !== undefined){
            res.status(409).send("user already exist")
        }else{
            dbUser.save(req.body,function(err:Error|null){
                if(err)next(err)
                else res.status(201).send("user persisted")
            })
        }
    })
})

userRouter.delete('/:username',function(req:any, res:any, next:any){
    dbUser.get(req.parames.username, function (err:Error | null){
        if(err) next(err)
        res.status(200).send()
    })
})

app.use('/user', userRouter)
/*
 Metrics
*/

metricsRouter.use(function (req:any,res:any,next:any){
    console.log("called metrics router")
})

metricsRouter.get('/:id',(req:any, res:any)=>{
  dbMetrics.get(req.parames.id,(err:Error | null, result?: Metric[])=>{
      if(err) throw err
      if(result == undefined){
          res.write('no result')
          res.send()
      }else res.json(result)
  })
})

metricsRouter.post('/metrics/:id',(req:any,res:any)=>{
    dbMetrics.save(req.parames.id,req.body,(err:Error|null)=>{
        if(err){
            res.status(500).send(err)
        }throw err
    })
})

metricsRouter.delete('/:id',(req:any,res:any,next:any)=>{
    dbMetrics.remove(req.parames.id,(err:Error|null)=>{
        if(err) next(err)
        res.status(200).send()
    })
})

app.use('/metrics',authCheck,metricsRouter)


/*
    Error handling
*/ 
app.use(function (err: Error, req: any, res: any, next: any) {
    console.log('got an error')
    console.error(err.stack)
    // res.status(500).send('Something broke!')
    res.status(500).send(err+"aaaa")
  })

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
})




