import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import bodyparser = require('body-parser')

const app = express()
const port: string = process.env.PORT || '8080'

const dbMetrics = new MetricsHandler('./db')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/', (req: any, res: any) => {
    res.write('Hello world')
    res.send()
})

app.get('/metrics/:id', (req: any, res: any) => {
    dbMetrics.get(req.params.id, (err: Error | null, result?: Metric[]) => {
        if (err) throw err
        if (result == undefined) {
            res.write('no result')
            res.send()
        }
        else res.json(result)
    })
})

app.post('/metrics/:id',(req:any,res:any)=>{
    dbMetrics.save(req.parames.id,req.body,(err:Error|null)=>{
        if(err){
            res.status(500).send(err)
        }throw err
        res.status(200).send()
    })
})

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log('server is listening on port ${port}')
})


