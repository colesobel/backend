'use strict';
var db = require('../../config/db/knex/knexConfig');
var request = require('request');
module.exports = (function () {
    function realtimeStocks() {
    }
    realtimeStocks.prototype.getRealtimeStockPrice = function () {
        return new Promise(function (resolve, reject) {
            request("http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=NFLX", function (error, response, body) {
                return (!error && response.statusCode == 200) ? resolve(JSON.stringify(body)) : reject(error);
            });
        });
    };
    realtimeStocks.prototype.updateDatabase = function (obj) {
        var unixDate = obj.Timestamp.substring(8, 10) + "-" + obj.Timestamp.substring(4, 7) + "-" + obj.Timestamp.substring(30, 35) + " " + obj.Timestamp.substring(11, 19);
        var dbDate = Number(new Date(unixDate)) / 1000;
        return db.knex.raw("insert into realtime_stocks values (default, '" + obj.Name + "', '" + obj.Symbol + "', " + obj.LastPrice + ", " + obj.Volume + ", " + dbDate + ")");
    };
    realtimeStocks.prototype.getDatabaseResults = function () {
        return db.knex.raw("select * from realtime_stocks order by timestamp desc limit 10").then(function (results) {
            var deleteIds = results.rows.map(function (elem) { return elem.id; });
            return db.knex('realtime_stocks').whereNotIn('id', deleteIds).del().then(function () {
                return results.rows;
            });
        });
    };
    return realtimeStocks;
}());