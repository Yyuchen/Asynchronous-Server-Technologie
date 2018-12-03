import WriteStream from "level-ws";


export class  Metric {
  public timestamp:string
  public value:number

  constructor(ts: string, v:number){
    this.timestamp = ts
    this.value = v
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
    metrics.forEach((m : Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }

  public get(key:string, callback: (err:Error | null, result?: Metric[]) => void) {
  
    const stream = this.db.createReadStream()
    var metrics : Metric[] = []
    stream.on('error',callback)
    stream.on('end',(err:Error)=>callback(null,metrics))
    stream.on('data',(data:any)=>{
      var _a = data.key.split(":"), 
      _ = _a[0],
      k = _a[1],
      timestamp = _a[2];
      var value = data.value;
      //ou 
      //const [_, k, timestamp] = data.key.split(":")
      //const value = data.value

      if(key!=k){
        console.log(`LevelDB error: ${data} does not match key ${key}`)
      }
      metrics.push(new Metric (timestamp,value))
  
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
