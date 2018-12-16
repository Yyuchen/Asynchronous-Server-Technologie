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
const db = LevelDB.open('./db/users')
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
//req.body.username
authRouter.post('/login', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
      if (err) {
        console.log("00")
        res.status(401).send("Error de login")
        next(err)
      }
      else if (result === undefined || !result.validatePassword(req.body.password)) {
        console.log("0")
        res.send(req.body.username + "aaa")
        //res.redirect('/login')
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

authRouter.use(function (req:any,res:any,next:any){
    console.log("called authRouter router")
    next()
})

//Récupérer les metrics d'un user
authRouter.get('/getMet',(req:any, res:any)=>{
  dbMetrics.getUserMetrics(req.session.user.username, (err:Error | null, result?: Metric[])=>{
      if(err) throw err
      if(result == undefined){
          res.write('no result')
          res.send()
      }else {
        res.json(result)
        // console.log(result)
      }
  
  })
})


app.use(authRouter)
app.use('/getMet',authRouter)

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
    res.render('index', { name: req.session.user.username })
    
})

/*
  Users
*/ 

//récupéré les metrics d'utilisateur par url
userRouter.get('/:username',function( req:any , res:any , next:any){
    var userName=req.originalUrl.substr(6)
    if(req.session.user.username === userName)
    {
        dbMetrics.getUserMetrics(req.session.user.username,(err:Error | null, result?: Metric[])=>{
            if(err || result === undefined){
                res.status(404).send("Metrics not founde")
            }
            else{
                console.log("bon")
                res.status(200).json(result)
            }
        })
    }else{
        res.status(403).send("accès refusé")
    }
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

// 
authRouter.post('/modif', (req, res) =>
{
    console.log(req.body);
    console.log('gggggggggggggggggggggggggggggggggggggggggg');
});

userRouter.delete('/:username',function(req:any, res:any, next:any){
    dbUser.get(req.parames.username, function (err:Error | null){
        if(err) next(err)
        res.status(200).send()
    })
})

app.use('/user',authCheck,userRouter)
/*
 Metrics
*/

// metricsRouter.use(function (req:any,res:any,next:any){
//     console.log("called metrics router")
//     next()
// })

//Récupérer le metrics d'un utilisateur par url
metricsRouter.get('/:id',(req:any, res:any)=>{
    console.log("rea", req.session.user.username)
    console.log("req",req.params.id)
    
    dbMetrics.getMetriByID(req.params.id,req.session.user.username,(err:Error | null, result?: Metric[])=>{
            if(err || result === undefined){
                res.status(404).send("Metrics not founde")
            }
            else{
                console.log("bon")
                res.status(200).json(result)
            }
        })
    // }else{
    //     res.status(403).send("accès refusé")
    // }
})



metricsRouter.post('/test/test',(req:any,res:any)=>{
    console.log("BB")
    dbMetrics.save(req.parames.id,req.body,(err:Error|null)=>{
        if(err){
            res.status(500).send(err)
        }throw err
    })
})

// metricsRouter.post('/metrics/:id',(req:any,res:any)=>{
//     console.log("BB")
//     dbMetrics.save(req.parames.id,req.body,(err:Error|null)=>{
//         if(err){
//             res.status(500).send(err)
//         }throw err
//     })
// })

metricsRouter.delete('/:id',(req:any,res:any,next:any)=>{
    console.log("CC")
    dbMetrics.remove(req.parames.id,(err:Error|null)=>{
        if(err) next(err)
        res.status(200).send()
    })
})

app.use('/metrics',authCheck,metricsRouter)
app.use('/',authCheck,metricsRouter)



/*
    Error handling
*/ 
app.use(function (err: Error, req: any, res: any, next: any) {
    console.log('got an error')
    console.error(err.stack)
    // res.status(500).send('Something broke!')
    res.status(500).send(err)
  })

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
})




