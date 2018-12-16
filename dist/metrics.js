"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var level_ws_1 = __importDefault(require("level-ws"));
var Metric = /** @class */ (function () {
    function Metric(ts, v, own) {
        this.timestamp = ts;
        this.value = v;
        this.owner = own;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(db) {
        this.db = db;
    }
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + ":" + m.timestamp + ":" + m.owner, value: m.value });
            console.log('m -------------------', m);
        });
        stream.end();
    };
    MetricsHandler.prototype.getUserMetrics = function (username, callback) {
        console.log("jijiji");
        var stream = this.db.createReadStream(); //fonction provient de leveldb
        var metrics = [];
        stream.on('error', callback);
        stream.on('end', function (err) { return callback(null, metrics); });
        stream.on('data', function (data) {
            var _a = data.key.split(":"), _ = _a[0], k = _a[1], timestamp = _a[2], owner = _a[3];
            var value = data.value;
            if (username.localeCompare(owner) == 0) {
                metrics.push(new Metric(timestamp, value, owner));
            }
        });
    };
    MetricsHandler.prototype.remove = function (key, callback) {
        //TODO
        callback(null);
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
/*static get(calllback: (err:Error | null, result?: Metric[] ) => void){
  calllback(null,[
    new Metric('2013-11-04 14:00 UTC',12),
    new Metric('2013-11-04 14:30 UTG',15)
  
  ])
}*/
