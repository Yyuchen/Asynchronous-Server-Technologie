#!/user/bin/env/ ts-node
import { LevelDB } from "../src/leveldb"
import { Metric, MetricsHandler } from '../src/metrics';
import { User, UserHandler } from '../src/users';

const met =[
    new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12),
    new Metric(`${new Date('2013-11-04 14:15 UTC').getTime()}`, 10),
    new Metric(`${new Date('2013-11-04 14:30 UTC').getTime()}`, 8)
]

const user1 = new User("alice","alice@test.com","pwd1")
const user2 = new User("toto","toto@test.com","pwd2")
const db = LevelDB.open('./db/users')

const db2 = new MetricsHandler(db)
    db2.save('0' ,met,(err:Error | null)=>{
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

   
