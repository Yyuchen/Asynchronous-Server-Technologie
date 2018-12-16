"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var leveldb_1 = require("./leveldb");
var dbPath = "db_test";
var dbMet;
describe('Metrics', function () {
    before(function () {
        leveldb_1.LevelDB.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    after(function () {
        dbMet.db.close();
    });
    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbMet.getUserMetrics("0", function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.an('array');
                chai_1.expect(result).to.be.empty;
            });
        });
    });
    describe('#save', function () {
        it('should save data', function () {
            //TODO
        });
        it('should update data', function () {
            //TODO
        });
    });
    describe('#delete', function () {
        it('should delete data', function () {
            //TODO
        });
    });
});
