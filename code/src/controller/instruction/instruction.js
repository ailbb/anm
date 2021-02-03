/**
 * Created by sirzh on 2018/4/16.
 */
module.exports = function (app) {
    let main = require("../../main")(); // 主框架
    let p = main.p; // 路径解析
    let cache = main.cache; // 缓存
    let service = require(p.service("instruction"))();
    let fs = require('fs');

    /**
     * 查询播放网页列表
     */
    app.use("/module/instruction/music_list.html**", function (request, response) {
        service.forwardMusicList(request, response);
    });

    /**
     * 查询播放计划列表
     */
    app.use("/music_list/**", function (request, response) {
        service.getMusicList(request, response);
    });

    /**
     * 查询播放计划列表
     */
    app.use("/ins_list", function (request, response) {
        service.getInsList(request, response);
    });

    app.use("/save_ins", function (request, response) {
        service.saveIns(request, response);
    });

    app.use("/del_ins", function (request, response) {
        service.delIns(request, response);
    });

    app.use("/clear_ins", function (request, response) {
        service.clearIns(request, response);
    });

    /**
     * 查训指令列表
     */
    app.use("/scheme_list", function (request, response) {
        service.getSchemeList(request, response);
    });

    app.use("/save_scheme", function (request, response) {
        service.saveScheme(request, response);
    });

    app.use("/del_scheme", function (request, response) {
        service.delScheme(request, response);
    });

    return app;
};