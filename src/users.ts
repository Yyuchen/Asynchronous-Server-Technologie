import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import { userInfo } from "os";

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
  const[password,email] = value.split(":")
  return new User(username,email,password)
  }

  //Hash et set password
  public setPassword(toSet: string): void {
  this.password = toSet
  this.passwordHashed=true
  }
    
  public getPassword(): string {
  return this.password
  }

  // return comparison with hashed password
  public validatePassword(toValidate: String): boolean {
  return this.password === toValidate
  }
}


export class UserHandler {
  
  public db: any

  constructor(db: any) {
    this.db = db
  }
  
    public get(username: string, callback: (err: Error | null, result?: User) => void) {
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