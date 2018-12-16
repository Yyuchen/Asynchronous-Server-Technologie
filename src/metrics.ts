import  WriteStream from "level-ws";
import { cpus } from "os";

export class  Metric
{
  public timestamp:string
  public value:number
  public owner:string

  constructor(ts: string, v:number, own:string)
  {
    this.timestamp = ts
    this.value = v
    this.owner = own
  }
}


export class MetricsHandler{
  public db : any

  constructor (db: any){
    this.db = db
  }

  public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m : Metric) =>
    {
      stream.write({ key: `metric:${key}:${m.timestamp}:${m.owner}`, value: m.value })
      console.log('m -------------------', m);
  });
    stream.end()
  }

  public getUserMetrics(username:string, callback: (err:Error | null, result?: Metric[]) => void) {
    console.log("jijiji")
    const stream = this.db.createReadStream() //fonction provient de leveldb
    var metrics : Metric[] = []

    stream.on('error',callback)
    stream.on('end',(err:Error)=>callback(null,metrics))
    stream.on('data',(data:any)=>{
      const [_, k, timestamp,owner] = data.key.split(":")
      var value = data.value;

      if(username.localeCompare(owner)==0)
      {
        metrics.push(new Metric (timestamp,value,owner))
      }
    })
  }


  public getMetriByID(key: string, username :string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var metrics: Metric[] = []

    stream.on('error',callback)
    stream.on('end',(err:Error)=>callback(null,metrics))
    stream.on('data',(data:any)=>{
      const [_, k, timestamp,owner] = data.key.split(":")
      var value = data.value;
      console.log('k',k)
      console.log('key',key)
      console.log('username',username)
      console.log('owner',owner)
   
      if(username.localeCompare(owner)==0 && key.localeCompare(k)==0)
      {
        console.log("sss")
        metrics.push(new Metric (timestamp,value,owner))
      }
      })
  }

  public remove(key: string, callback:(err:Error|null)=>void){
    //TODO
    callback(null)
  }
}





  /*static get(calllback: (err:Error | null, result?: Metric[] ) => void){
    calllback(null,[
      new Metric('2013-11-04 14:00 UTC',12),
      new Metric('2013-11-04 14:30 UTG',15)    
    
    ])
  }*/
