"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyparser = require("body-parser");
var morgan = require("morgan");
var session = require("express-session");
var levelSession = require("level-session-store");
var path = require("path");
var leveldb_1 = require("./leveldb");
var users_1 = require("./users");
var metrics_1 = require("./metrics");
var LevelStore = levelSession(session);
//initialisation des routers
var port = process.env.PORT || '8080';
var app = express();
var authRouter = express.Router();
var userRouter = express.Router();
var metricsRouter = express.Router();
///instanciation les connextion des bases
var db = leveldb_1.LevelDB.open('./db/users');
var dbMetrics = new metrics_1.MetricsHandler(db); //ouverture de connextion au base
var dbUser = new users_1.UserHandler(db);
///configuration du main app
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(morgan('dev'));
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
///Authentication
//login
authRouter.get('/login', function (req, res) {
    res.render('login');
});
//req.body.username
authRouter.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err) {
            console.log("00");
            res.status(401).send("Error de login");
            next(err);
        }
        else if (result === undefined || !result.validatePassword(req.body.password)) {
            console.log("0");
            res.send(req.body.username + "aaa");
            //res.redirect('/login')
            next(err);
        }
        else {
            console.log("1");
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
            console.log("2");
        }
    });
});
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
authRouter.get('/logout', function (req, res) {
    if (req.session.loggedIn) {
        delete req.session.loggedIn;
        delete req.session.user;
    }
    res.redirect('/login');
});
authRouter.use(function (req, res, next) {
    console.log("called authRouter router");
    next();
});
//Récupérer les 
authRouter.get('/getMet', function (req, res) {
    dbMetrics.getUserMetrics(req.session.user.username, function (err, result) {
        console.log("AAB");
        if (err)
            throw err;
        if (result == undefined) {
            res.write('no result');
            res.send();
        }
        else {
            res.json(result);
            // console.log(result)
        }
    });
});
app.use(authRouter);
app.use('/getMet', authRouter);
//authCheck = authMiddleware
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
/*
  Root
*/
app.get('/', authCheck, function (req, res) {
    res.render('index', { name: req.session.user.username });
});
/*
  Users
*/
//récupéré les metrics d'utilisateur 
// userRouter.get('/:username',function( req:any , res:any , next:any){
//     console.log("aaaa")
//     if(req.session.user.username === req.parames.username)
//     {
//         dbMetrics.get(req.parames.username,(err:Error | null, result?: Metric[])=>{
//             if(err || result === undefined){
//                 res.status(404).send("Metrics not founde")
//             }
//             else{
//                 console.log("bon")
//                 res.status(200).json(result)
//             }
//         })
//     }
// })
userRouter.post('/signup', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exist");
        }
        else {
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).send("user persisted");
            });
        }
    });
});
// 
authRouter.post('/modif', function (req, res) {
    console.log(req.body);
    console.log('gggggggggggggggggggggggggggggggggggggggggg');
});
userRouter.delete('/:username', function (req, res, next) {
    dbUser.get(req.parames.username, function (err) {
        if (err)
            next(err);
        res.status(200).send();
    });
});
app.use('/user', userRouter);
/*
 Metrics
*/
// metricsRouter.use(function (req:any,res:any,next:any){
//     console.log("called metrics router")
//     next()
// })
// //Récupérer les 
// metricsRouter.get('/:id',(req:any, res:any)=>{
//     console.log("AAc");
//     // console.log(req);
//     console.log(req.parames);
//     req.parames = 'test';
//     console.log(req.parames.id);
//   dbMetrics.get(req.parames.id, (err:Error | null, result?: Metric[])=>{
//       console.log("AAB")
//       if(err) throw err
//       if(result == undefined){
//           res.write('no result')
//           res.send()
//       }else res.json(result)
//   })
// })
metricsRouter.post('/test/test', function (req, res) {
    console.log("BB");
    dbMetrics.save(req.parames.id, req.body, function (err) {
        if (err) {
            res.status(500).send(err);
        }
        throw err;
    });
});
// metricsRouter.post('/metrics/:id',(req:any,res:any)=>{
//     console.log("BB")
//     dbMetrics.save(req.parames.id,req.body,(err:Error|null)=>{
//         if(err){
//             res.status(500).send(err)
//         }throw err
//     })
// })
metricsRouter.delete('/:id', function (req, res, next) {
    console.log("CC");
    dbMetrics.remove(req.parames.id, function (err) {
        if (err)
            next(err);
        res.status(200).send();
    });
});
app.use('/metrics', authCheck, metricsRouter);
app.use('/', authCheck, metricsRouter);
/*
    Error handling
*/
app.use(function (err, req, res, next) {
    console.log('got an error');
    console.error(err.stack);
    // res.status(500).send('Something broke!')
    res.status(500).send(err);
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
