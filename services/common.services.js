const path = require('path')
const fs = require('fs')
const dbService = require('../services/db.services')

class commonService {
    constructor(){
        this._path = path.resolve(__dirname, '..') + '/db-lock.json'

        this.hasDbConfig().then(() => {
            return this.readDbConfig();
        }, () => {
            // err
        }).then((config) => {
            // console.log(config)
            global.db = new dbService(config)
        }, () => {

        })
    }

    // 判断本地有无数据库配置
    hasDbConfig(){
        return new Promise((resolve, rejects) => {
            fs.exists(this._path, function(exists){
                if(!exists) return rejects();
                resolve();
            })
        })
    }

    // 读取本地数据库配置
    readDbConfig(){
        return new Promise((resolve, rejects) => {
            fs.readFile(this._path, 'utf8', function(err,data){
                if(err) return rejects(err);
                let _config = JSON.parse(data)
              
                resolve(_config)
            })
        })
    }
}

module.exports = new commonService()