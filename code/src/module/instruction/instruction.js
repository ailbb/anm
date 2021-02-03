/**
 * Created by sirzh on 2018/4/16.
 */
module.exports = function () {
    // 自定义模块
    let main = require("../../main")(); // 主框架
    let p = main.p; // 路径解析
    let db = main.db("instruction.db"); // 引用db模块
    let jp = main.jp; // jsonp解析
    let tool = main.tool; // jsonp解析
    let fs = require('fs');
    let ph = require('path');
    let urlencode = require(p('urlencode'));
    let moment = require(p('moment'));

    let service = {};

    /**
     * 获取执行计划的信息
     * @param request
     * @param response
     */
    service.forwardMusicList = function (request, response) {
        response.setHeader('Content-type',"text/html;charset=utf-8")
        let tmp = request.baseUrl.substr(request.baseUrl.indexOf('music_list.html') + "music_list.html".length);
        let root = p('/code/web/module/instruction/music/' + urlencode.decode((tmp) || ""));
        var files = fs.readdirSync(root);
        var list = ''
        if("" != tmp) {
            list+=`<tr>
                    <td valign="top"><img
                            src="data:image/gif;base64,R0lGODlhFAAWAMIAAP/////Mmcz//5lmMzMzMwAAAAAAAAAAACH+TlRoaXMgYXJ0IGlzIGluIHRoZSBwdWJsaWMgZG9tYWluLiBLZXZpbiBIdWdoZXMsIGtldmluaEBlaXQuY29tLCBTZXB0ZW1iZXIgMTk5NQAh+QQBAAACACwAAAAAFAAWAAADVCi63P4wyklZufjOErrvRcR9ZKYpxUB6aokGQyzHKxyO9RoTV54PPJyPBewNSUXhcWc8soJOIjTaSVJhVphWxd3CeILUbDwmgMPmtHrNIyxM8Iw7AQA7"
                            alt="[   ]"></td>
                    <td><a href="${request.baseUrl.substr(0, request.baseUrl.lastIndexOf('/'))}/">...</a></td>
                    <td align="right"> - </td>
                    <td align="right"> - </td>
                    <td>&nbsp;</td>
                </tr>`;
        }

        files.forEach((item)=>{
            var stats = fs.statSync(p(root+ ph.sep +item))
            if(stats.isFile()){
                list+=`<tr>
                        <td valign="top"><img
                                src="data:image/gif;base64,R0lGODlhFAAWAOMAAP/////MM/8zM8z//5mZmZlmM2bM/zMzMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH+TlRoaXMgYXJ0IGlzIGluIHRoZSBwdWJsaWMgZG9tYWluLiBLZXZpbiBIdWdoZXMsIGtldmluaEBlaXQuY29tLCBTZXB0ZW1iZXIgMTk5NQAh+QQBAAADACwAAAAAFAAWAAAEb/DISee4eBzAu99Hdm1eSYbZWXEkgI5sEBg0+2HnTBsccvhAmGtXAyCOSITwUGg2PYQoQalhOZ/QKLVV6gKmQm8XXDUmzx0yV5ze9s7JdpgtL3ME5jhHTS/xO3hwdWt0f317WwdSi4xRPxlwkUgXEQA7"
                                alt="[DIR]"></td>
                        <td><a target="_blank" href="/module/instruction/music${urlencode.decode(tmp)}/${item}">${item}</a></td>
                        <td align="right">${moment(stats.ctime).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td align="right"> ${tool.trans1024(stats.size)} </td>
                    </tr>`;
            } else {
                list+=`<tr>
                    <td valign="top"><img
                            src="data:image/gif;base64,R0lGODlhFAAWAMIAAP/////Mmcz//5lmMzMzMwAAAAAAAAAAACH+TlRoaXMgYXJ0IGlzIGluIHRoZSBwdWJsaWMgZG9tYWluLiBLZXZpbiBIdWdoZXMsIGtldmluaEBlaXQuY29tLCBTZXB0ZW1iZXIgMTk5NQAh+QQBAAACACwAAAAAFAAWAAADVCi63P4wyklZufjOErrvRcR9ZKYpxUB6aokGQyzHKxyO9RoTV54PPJyPBewNSUXhcWc8soJOIjTaSVJhVphWxd3CeILUbDwmgMPmtHrNIyxM8Iw7AQA7"
                            alt="[   ]"></td>
                    <td><a href="${request.baseUrl}/${item}">${item}</a></td>
                    <td align="right">${moment(stats.ctime).format('YYYY-MM-DD HH:mm:ss')}</td>
                    <td align="right"> - </td>
                </tr>`;
            }
        })
        //判断完之后然后内容给目标网页
        var content =fs.readFileSync(p('/code/web/module/instruction/music_list.html')).toString();
        //  console.log(body);
        content= content.replace("{{list}}",list)
        response.end(content)
    }

    /**
     * 获取执行计划的信息
     * @param request
     * @param response
     */
    service.getMusicList = function (request, response) {
        let music_list = [];

        let dir = p('/code/web/module/instruction/music/' + urlencode.decode((request.baseUrl.substr('/music_list'.length) || ""), 'UTF-8'));
        if(!fs.lstatSync(dir).isFile()) { // 如果是文件夹
            fs.readdir(dir, function(err, files){
                for(let f of files) {
                    if(!fs.lstatSync(p(dir +"/"+ f)).isFile()) f = f+"/";
                    music_list.push(f);
                }
                response.send(jp.r(request.query, music_list));
            });
        } else { // 否则是文件
            console.log(music_list)
        }
    }

    function getMusic(dir, music_list){
        if(!fs.lstatSync(dir).isFile()) { // 如果是文件夹
            fs.readdir(dir, function(err, files){
                for(let f of files) {
                    getMusic(dir + "/" + f, music_list);
                }
            });
        } else { // 否则是文件
            console.log(dir.substr(p('/code/web/module/instruction/').length));
            music_list.push(dir);
        }
    }

    /**
     * 获取执行计划的信息
     * @param request
     * @param response
     */
    service.getInsList = function (request, response) {
        if(!request.query.scheme_id) return response.send(jp.r(request.query, "未找到执行计划！"));

        db.queryCondition(`select * from ins_list`, jp.c(request.query), function (data) {
            response.send(jp.r(request.query, data));
        });
    }

    /**
     * 保存执行计划的信息
     * @param request
     * @param response
     */
    service.saveIns = function (request, response) {
        let rq = request.query;
        db.run(`insert into ins_list (ins_id, scheme_id, time, text, type, play_type) values (
            '${rq.ins_id}', 
            '${rq.scheme_id}', 
            '${rq.time}', 
            '${rq.text}', 
            '${rq.type}', 
            '${rq.play_type}'
        )`, function (data) {
            response.send(jp.r(request.query, '保存执行计划成功！'));
        });
    }

    /**
     * 删除执行计划的信息
     * @param request
     * @param response
     */
    service.delIns = function (request, response) {
        let rq = request.query;
        db.run(`delete from ins_list where ins_id = ${rq.ins_id} and scheme_id = ${rq.scheme_id}`, function (data) {
            response.send(jp.r(request.query, '删除执行计划成功！'));
        });
    }

    /**
     * 清楚执行计划的信息
     * @param request
     * @param response
     */
    service.clearIns = function (request, response) {
        let rq = request.query;
        db.run(`delete from ins_list where scheme_id = ${rq.scheme_id}`, function (data) {
            response.send(jp.r(request.query, '删除指令集成功！'));
        });
    }

    /**
     * 获取定义的
     * @param request
     * @param response
     */
    service.getSchemeList = function (request, response) {
        db.queryCondition(`select * from scheme_list`, jp.c(request.query), function (data) {
            response.send(jp.r(request.query, data));
        });
    }

    /**
     * 保存指令列表的信息
     * @param request
     * @param response
     */
    service.saveScheme = function (request, response) {
        let rq = request.query;
        db.run(`insert into scheme_list (scheme_id, scheme_name, create_time) values (
            ${rq.scheme_id}, 
            ${rq.scheme_name},
            ${rq.create_time}
        )`, function (data) {
            response.send(jp.r(request.query, '保存指令集成功！'));
        });
    }

    /**
     * 删除指令列表的信息
     * @param request
     * @param response
     */
    service.delScheme = function (request, response) {
        let rq = request.query;
        db.run(`delete from scheme_list where scheme_id = ${rq.scheme_id}`, function (data) {
            response.send(jp.r(request.query, '删除指定集成功！'));
        });
    }

    return service;
};