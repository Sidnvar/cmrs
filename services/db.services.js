const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const test = require('assert')
const fs = require('fs')
const path = require('path')

class dbService {
    constructor(config){
        this.db_host = config.db_host;
        this.db_port = config.db_port;
        this.db_name = config.db_name;
        this.db_user = config.db_user;
        this.db_pwd = config.db_pwd;
        // 数据库对象
        this.mongoDb = '';

        this.connectDb();
    }

    // 链接数据库
    connectDb(){
        let url = 'mongodb://' + this.db_host + ':' + this.db_port + '/' + this.db_name;

        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useNewUrlParser:true}, (err, db) => {
                if (err) return reject(err);
                this.mongoDb = db
                console.log('成功连接数据库')
                resolve();
            });
        }) 
    }

    // 配置数据库管理员
    addDbUser(){
        let _admin = this.mongoDb.db('admin'),
        options = {
            roles:[
                {role: 'readWrite', db: this.db_name}
            ]
        },
        _path = path.resolve(__dirname, '../')

        return new Promise((resolve, reject) => {
            _admin.addUser(this.db_user, this.db_pwd, options, (err, db) => {
                if(err) return reject(err);
                let _config = {
                    db_host: this.db_host,
                    db_port: this.db_port,
                    db_name: this.db_name,
                    db_user: this.db_user,
                    db_pwd: this.db_pwd
                }
                fs.writeFileSync(_path + '/db-lock.json', JSON.stringify(_config));
                resolve();
            })
        });
    }

    /**
     * 配置网站信息
     * @param {Object}
     *        {options} {web_name, admin_user, password, email, keyword, des}
     */
    webOptions(options){
        let _db = this.mongoDb.db(this.db_name)

        return new Promise((resolve, reject) => {
            _db.collection('options').insertOne({name: 'siteInfo', value: options}, (err, result) => {
                if(err) throw reject(err);
                options['role'] = '-1'
                this.addAdminUser(options)

                resolve()
            });
        });

    }

    /**
     * 更新网站信息
     * @param {Object}
     *        {options} {web_name, admin_user, password, email}
     */
    putOptions(options){}

    /**
     * 登录
     * @param {Object} options 
     */
    login(formData){
        let _db = this.mongoDb.db(this.db_name)

        return new Promise((resolve, reject) => {
            // , (err, users) => {
            //     if(err) return reject(err);
            //     resolve(users)
            //     // console.log(users)
            // }
            _db.collection('users').findOne({"user_name": formData.username}, function(err, users) {
                if(err) return reject(err);
                resolve(users)
            })
        })
    }

    /**
     * 添加后台账户
     * @param {Object}
     *        {email, name, pwd, re_pwd, role}
     */
    addAdminUser(options){
        let _db = this.mongoDb.db(this.db_name)

        return new Promise((resolve, reject) => {
            _db.collection('users').insertOne(options, (err, result) => {
                if(err) throw reject(err);
                resolve()
            })
        });
    }

    /**
     * 修改后台账户
     * @param {Object}
     *        {email, name, pwd, re_pwd, role}  
     */
    putAdminUser(options){}

    /**
     * 删除后台账户
     * @param {String} id
     */
    delAdminUser(id){

    }

    /**
     * 添加新角色
     * @param {Object}
     *        {options} {name, remark, roles[arr]}
     */
    addRole(options){
        let _db = this.mongoDb.db(this.db_name)

        return new Promise((resolve, reject) => {
            _db.collection('roles').insertOne(options, (err, result) => {
                if(err) throw reject(err);
                resolve()
            })
        });
    }

    /**
     * 更新角色
     * @param {Object}
     *        {options} {name, remark, roles[arr]}
     */
    putRole(options){

    }

    /**
     * 删除角色
     * @param {Object}
     */
    delRole(id){

    }
    
}

// exports.dbService = dbService
module.exports = dbService