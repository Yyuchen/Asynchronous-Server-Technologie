"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
///Cours
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = new Date(ts).getTime();
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricHandler = /** @class */ (function () {
    function MetricHandler(path) {
        this.db = leveldb_1.LevelDb.open(path);
    }
    MetricHandler.prototype.save = function (key, metrics, callback) {
        // const stream = WriteStream(this.db)
        // stream.on('error', callback)
        // stream.on('close', callback)
        // metrics.forEach(m => {
        //   stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
        // })
        // stream.end()
    };
    return MetricHandler;
}());
exports.MetricHandler = MetricHandler;
get(key, string, callback, function (err, result) { return void  });
{
    var stream = this.db.createReadStream();
    var result;
    stream.on('error', callback);
    stream.on('end', callback(null, result));
    stream.on('data', function (data) {
        var _a = data.key.split(":"), _ = _a[0], key = _a[1], timestamp = _a[2];
        var value = data.value;
        if (key != k) {
            console.log('LevelDB error: ${data} does not match key ${key}');
        }
        data.push(new Metric(timestamp, value));
    });
}
/*static get(calllback: (err:Error | null, result?: Metric[] ) => void){
  calllback(null,[
    new Metric('2013-11-04 14:00 UTC',12),
    new Metric('2013-11-04 14:30 UTG',15)
  
  ])
}*/
