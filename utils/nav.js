const _ = require('lodash')
const navArr = [
    // 首页
    {
        name: '首页',
        _auth: 'home',
        _group: 0,
        url: '/admin'
    },
    // 角色管理
    {
        name: '角色管理',
        _auth: 'role',
        _group: 0,
        url: '/admin/role'
    },
    // 用户管理
    {
        name: '用户管理',
        _auth: 'user',
        _group: 0,
        url: '/admin/user'
    },
    // 栏目管理
    {
        name: '栏目管理',
        _auth: 'column',
        _group: 0,
        url: '/admin/column'
    },
    // 发布文章
    {
        name: '发布文章',
        _auth: 'publish',
        _group: 0,
        url: '/admin/publish'
    }
]


class Nav {
    constructor(auth){
        this.auth = auth
        this.menu = this.createMenu()
    }

    createMenu(){
        if(this.auth == -1){
            return navArr
        }else{
            return this.forEachNav(this.auth)
        }
    }

    forEachNav(arr){
        let menu = []

        for(let i = 0; i < arr.length; i++){
            if(arr[i].group != 0){
                let _idx = _.findIndex(navArr, function(o) { return o._auth == arr[i].roleName})
                let _navArr = Object.assign(navArr)
                _navArr[_idx]['_group'] = arr[i].group 
                // let _nav = {
                //     name: navArr[_idx].name,
                //     _auth:
                // // }
                // menu.push({
                        
                // })

                menu = _navArr
            }
        }

        return menu
    }

    getNav(rolename){
        let idx = _.findIndex(navArr, function(o) { return o._auth == rolename; }); 
        return arr[idx] 
    }
}

module.exports = Nav