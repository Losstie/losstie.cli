
const path = require('path');
module.exports = {
    // 转换为绝对路径
    abspath: function (p) {
        const cwd = process.cwd();
        return p[0] === '/'?p:path.join(cwd, p);
    },
    // 字符串转正则
    strToRegExp: function(s) {
        return s instanceof RegExp? s: new RegExp('^'+s+'$');
    }
}