/**
 * 服务器模块，监听页面链接
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {

    // 解析jsonp请求
    function c(query) {
        let o = {};
        for(let k in query) {
            if(~(["callback", "_"]).indexOf(k)) continue;
            o[k] = query[k];
        }
        return o;
    }

    // 封装jsonp结果数据
    function r(query, data) {
        try {
            return query.callback ? `${query.callback}(${JSON.stringify(data)})` : data;
        } catch (e) {
            return data;
        }
    }

    return {c, r};
};