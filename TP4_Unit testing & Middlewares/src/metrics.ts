import { LevelDb } from "./leveldb";
import WriteStream from "level-ws";

///Cours
export class  Metric {
  public timestamp:number
  public value:number

  constructor(ts: string, v:number){
    this.timestamp = new Date(ts).getTime()
    this.value = v
  }
}


export class MetricsHandler{
  private db : any

  constructor (path:string){
    this.db = LevelDb.open(path)
  }

  public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)

    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach(m => {
      stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
    })

    stream.end()

  }

  public get(key:string, callback: (err:Error | null, result?: Metric[]) => void) {
  
    const stream = this.db.createReadStream()
    var met : Metric[] = []
    stream.on('error',callback)
    stream.on('end',(err:Error)=>callback(null,met))
    stream.on('data',(data:any)=>{
      const [_,k,timestamp]=data.key.split(":")
      const value = data.value
      if(key!=k){
        console.log('LevelDB error: ${data} does not match key ${key}')
      }
      met.push(new Metric (timestamp,value))
  
    })
  
  }
}





  /*static get(calllback: (err:Error | null, result?: Metric[] ) => void){
    calllback(null,[
      new Metric('2013-11-04 14:00 UTC',12),
      new Metric('2013-11-04 14:30 UTG',15)    
    
    ])
  }*/
