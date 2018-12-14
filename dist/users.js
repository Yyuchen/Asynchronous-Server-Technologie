"use strict";
var __importDefault = (this&&this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod:{"default":mod};
}
Object.defineProperty(exports, "__esModule", { value: true });
const leveldb_1 = require("./leveldb");
const level_ws_1 = __importDefault(require("level-ws"));
const bcrypt = require("bcrypt");

class User  {

    constructor(username, email, password, passwordHashed=false) {
        this.username = username
        this.email = email
        if (!passwordHashed) {
        this.setPassword(password)
        } 
        else this.password = password
      }

    // Parse db result and return a User  
    static fromDb(username, value){
    const[password,email] = value.split(":")
    return new User(username,email,password)
    }

    //hacher le pwd
    setPassword(plaintextPwd){
        const saltRounds = 10
        this.password = bcrypt.hash(plaintextpwd,saltRounds)
    }

    //Check si le mot de pass est correct
    checkPassword(inputPwd){
        return bcrypt.compare(inputPwd,this.password,function(err,res){
            if(err){
                res.send("Mot de passe erreur")
            }
        })
    }
}
exports.Metric = Metric;

class UserHandler{
    constructor (path) {
        this.db = leveldb_1.LevelDb.open(path);
    }
    getUserHandler(username, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
          if (err) throw callback(err)
          else if (data===undefined) callback(null,data)
          else callback(null, User.fromDb(username,data))
        })
      }
    
      public save(user: User, callback: (err: Error | null) => void) {
        this.db.put(
          `user:${user.username}`,
          `${user.getPassword()}:${user.email}`,
          (err:Error|null)=>{
            callback(err)
          }
        )
      }
    
      public delete(username: string, callback: (err: Error | null) => void) {
        // TODO
      }


}