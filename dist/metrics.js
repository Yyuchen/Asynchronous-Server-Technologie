"use strict";

var __importDefault = (this&&this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod:{"default":mod};
}
Object.defineProperty(exports, "__esModule", { value: true });
const leveldb_1 = require("./leveldb");
const level_ws_1 = __importDefault(require("level-ws"));

class Metric  {
    constructor (ts, v) {
        this.timestamp = new Date(ts).getTime();
        this.value = v;
    }
}
exports.Metric = Metric;

class MetricsHandler {
    constructor (path) {
        this.db = leveldb_1.LevelDb.open(path);
    }
    save = function (key, metrics, callback) {
         const stream = level_ws_1.default(this.db)
         stream.on('error', callback)
         stream.on('close', callback)
         metrics.forEach(m => {
         stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value });
         });
         stream.end();
    }
    get(key, callback)
    {
        const stream = this.db.createReadStream();
        var data=[];
        stream.on('error', callback);
        stream.on('end', callback(null, data));
        stream.on('data', function (data) {
            var _a = data.key.split(":"), 
            _ = _a[0],
            k = _a[1],
            timestamp = _a[2];
            var value = data.value;
            if (key != k) {
                console.log(`LevelDB error: ${data} does not match key ${key}`);
            }else{
                data.push(new Metric(timestamp, value));
            }
        });
    }  
}
exports.MetricsHandler = MetricsHandler;

/*static get(calllback: (err:Error | null, result?: Metric[] ) => void){
  calllback(null,[
    new Metric('2013-11-04 14:00 UTC',12),
    new Metric('2013-11-04 14:30 UTG',15)
  
  ])
}*/
