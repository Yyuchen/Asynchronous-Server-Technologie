import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import { userInfo } from "os";
import { callbackify } from "util";
const bcrypt = require('bcrypt')


export class User {
  public username: string
  public email: string
  private password: string = ""
  private passwordHashed: boolean =false
  
  constructor(username: string, email: string, password: string,) {
    this.username = username
    this.email = email
    if (!this.passwordHashed) {
    this.setPassword(password)
    } 
    else this.password = password
  }

  // Parse db result and return a User  
  static fromDb(username:string, value: any): User {
    console.log("3")
  const[password,email] = value.split(":")
  return new User(username,email,password)
  }

  //Hash et set password
  public setPassword(plaintextpwd: string): void {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    this.password = bcrypt.hashSync(plaintextpwd, salt)
    this.passwordHashed=true
  }
    
  public getPassword(): string {
  return this.password
  }



  //Check si le mot de pass est correct
  validatePassword(inputPwd : string) : boolean{
      return bcrypt.compare(inputPwd,this.password)
  }
}


export class UserHandler {
  
  public db: any

  constructor(db : any) {
    this.db = db
  }
  
    public get(username: string, callback: (err: Error | null, result?: User) => void) {
      this.db.get(`user:${username}`, function (err: Error, data: any) {
        if (err) throw err
        if (data===undefined) {callback(null,data)}
        else callback(null, User.fromDb(username,data)) 
      })

    }



    public save(user: User, callback: (err: Error | null) => void) {
      this.db.put(
        `user:${user.username}`,
        `${user.getPassword()}:${user.email}`,
        (err: Error | null) => {
          callback(err);
        })
    }
  
    public delete(username: string, callback: (err: Error | null) => void) {
      // TODO
    }
  }