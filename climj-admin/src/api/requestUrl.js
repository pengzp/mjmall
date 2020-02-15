/**
 * 请求地址统一处理／组装
 * @param {*} actionName action方法名称
 */
export default function (actionName) {
    // 非生产环境 && 开启代理, 接口前缀统一使用[/api/]前缀做代理拦截!
    // return ('/api') + actionName;
    return ('http://192.168.1.251:9090/mj-admin')+actionName;
    //高磊服务器地址
    // return ('192.168.204.62/mj-admin') + actionName;
    // return ('http://47.100.163.56/sdx-admin') + actionName;
    // return ('http://api.51-sdx.com/sdx-admin') + actionName;
}