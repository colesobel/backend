'use strict'
const db = require('../../config/db/knex/knexConfig')
const request = require('request')

module.exports = class realtimeStocks {
  constructor() { }
  getRealtimeStockPrice() {
    return new Promise((resolve: any, reject: any) => {
        request(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=NFLX`, (error, response, body) => {
            return (!error && response.statusCode == 200) ? resolve(JSON.stringify(body)) : reject(error)
        })

    })
  }

    updateDatabase(obj: any) {
        let unixDate: string = `${obj.Timestamp.substring(8,10)}-${obj.Timestamp.substring(4,7)}-${obj.Timestamp.substring(30, 35)} ${obj.Timestamp.substring(11,19)}`
        let dbDate: number = Number(new Date(unixDate))/1000
        return db.knex.raw(`insert into realtime_stocks values (default, '${obj.Name}', '${obj.Symbol}', ${obj.LastPrice}, ${obj.Volume}, ${dbDate})`)
    }

    getDatabaseResults() {
        return db.knex.raw(`select * from realtime_stocks`)
    }
}