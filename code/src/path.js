/**
 * 服务器模块，监听页面链接
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {
    return function (path) {
        let cwd = process.cwd(); // 程序运行目录

        let sep = process.platform.startsWith("win") ? "\\" : "/";

        if(~cwd.lastIndexOf('anm')) cwd = cwd.substr(0, cwd.lastIndexOf('anm') + 'anm'.length); // 项目根目录

        if(path.startsWith("\/")) return `${cwd}${path}`.replace(/\/+|\\+/g, sep);

        if(~path.indexOf("\/")) return path;

        return `${cwd}/program/node_modules/${path}/index.js`.replace(/\/|\\+/g, sep);
    };
};