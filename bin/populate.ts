#!/user/bin/env/ ts-node
import { LevelDB } from "../src/leveldb"
import { Metric, MetricsHandler } from '../src/metrics';
import { User, UserHandler } from '../src/users';

const met0 =[
    new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12, "alice"),
    new Metric(`${new Date('2013-11-04 14:15 UTC').getTime()}`, 10,"alice"),
    new Metric(`${new Date('2013-11-04 14:30 UTC').getTime()}`, 8,"alice")
]

const met1 =[
    new Metric(`${new Date('2018-12-04 14:50 UTC').getTime()}`, 13, "alice"),
    new Metric(`${new Date('2018-12-04 14:15 UTC').getTime()}`, 14,"alice"),
    new Metric(`${new Date('2018-12-04 14:30 UTC').getTime()}`, 1,"alice")
]

const met2 =[
    new Metric(`${new Date('2015-11-14 16:05 UTC').getTime()}`, 15, "toto"),
    new Metric(`${new Date('2015-11-14 16:05 UTC').getTime()}`, 1,"toto"),
    new Metric(`${new Date('2015-11-14 16:35 UTC').getTime()}`, 30,"toto")
]

const user1 = new User("alice","alice@test.com","pwd1")
const user2 = new User("toto","toto@test.com","pwd2")
const db = LevelDB.open('./db/users')

const db2 = new MetricsHandler(db)
    db2.save('0' ,met0,(err:Error | null)=>{
        if(err)throw err 
        console.log('Data populated')
})
db2.save('1' ,met1,(err:Error | null)=>{
    if(err)throw err 
    console.log('Data populated')
})
    db2.save('2' ,met2,(err:Error | null)=>{
    if(err)throw err 
    console.log('Data populated')
})

const db1 = new UserHandler(db)
    db1.save( user1, (err: Error | null) => {
    if (err) throw err;
    console.log("Data user populated")
  })
  db1.save( user2, (err: Error | null) => {
    if (err) throw err;
    console.log("Data user populated")
  })

   
