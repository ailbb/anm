/**
 * 工具模块
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {
    let tool = {
        trans1024: function (value) { // 值为Byte
            var v = parseFloat(value || "0");

            if(v === 0) {
                v = '-';
            } else if (!v) {
                v = '-';
            } else if(v > 1024*1024*1024*1024) {
                v = parseFloat((v/1024/1024/1024/1024).toFixed(2)) + " TB";
            } else if(v > 1024*1024*1024) {
                v = parseFloat((v/1024/1024/1024).toFixed(2)) + " GB";
            } else if(v > 1024*1024) {
                v = parseFloat((v/1024/1024).toFixed(2)) + " MB";
            } else if(v > 1*1024) {
                v = parseFloat((v/1024).toFixed(2)) + " KB";
            } else if(v > 1) {
                v = parseFloat((v).toFixed(2)) + " Byte";
            }

            return v;
        },
        trans1024MB: function (value) { // 值为MB
            var v = parseFloat(value || "0");

            if(v === 0) {
                v = '-';
            } else if (!v) {
                v = '-';
            } else if(v > 1024*1024) {
                v = parseFloat((v/1024/1024).toFixed(2)) + " TB";
            } else if(v > 1024) {
                v = parseFloat((v/1024).toFixed(2)) + " GB";
            } else if(v > 1) {
                v = parseFloat((v).toFixed(2)) + " MB";
            } else {
                v = parseFloat((v*1024).toFixed(2)) + " KB";
            }

            return v;
        },
        trans1000: function (value) { //
            var v = parseFloat(value || "0");

            if(v === 0) {
                v = '-';
            } else if (!v) {
                v = '-';
            } else if(v > 1000*1000*1000) {
                v = parseFloat((v/1000/1000/1000).toFixed(2)) + " 亿VCore";
            } else if(v > 1000*1000) {
                v = parseFloat((v/1000/1000).toFixed(2)) + " 十万VCore";
            } else if(v > 1000) {
                v = parseFloat((v/1000).toFixed(2)) + " 千VCore";
            } else if(v > 1) {
                v = parseFloat((v).toFixed(2)) + " VCore";
            }

            return v;
        },
        transferRatio: function(value) {
            if(!value) return '0 %';
            return (value * 100).toFixed(2) + ' %';
        }
    };

    return tool;
};