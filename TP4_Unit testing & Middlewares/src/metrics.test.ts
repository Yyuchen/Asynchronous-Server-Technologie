import {expect} from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"


const dbPath: string = "db_test"
var dbMet MetricsHandler

describe('Metrics', function () {

    before(function(){
        LevelDB.clear()
    })

    describe('#get',function(){
        it('shoul equal 0',function()  {
            expect(a).to.equal(0);
          })
    })
})