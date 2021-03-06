import {expect} from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"


const dbPath: string = "db_test"
var dbMet : MetricsHandler

describe('Metrics', function () {

    before(function(){
        LevelDB.clear(dbPath)
        dbMet= new MetricsHandler(dbPath)
    })
    after(function(){
        dbMet.db.close()
    })

    describe('#get',function(){
        it('should get empty array on non existing group',function()  {
            dbMet.getUserMetrics("0",(err:Error| null, result?: Metric[])=>{
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.be.an('array')
                expect(result).to.be.empty
            })
          })
    })

    describe('#save',function(){
        
            it('should save data', function(){
                //TODO
            })
            it('should update data',function(){
                //TODO
            })
        })

    describe('#delete',function(){
        it('should delete data', function(){
            //TODO
        })
    })
})