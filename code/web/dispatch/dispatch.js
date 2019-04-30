/**
 * Created by sirzh on 2018/4/12.
 */
function dispatch($, Vue) {
    let nodes = document.getElementsByTagName("script"); //只在head标签中寻找
    let dataBind;

    for(let i = 0; node = nodes[i++];) {
        if( /\/dispatch\/dispatch.*\.js/.test(node.src) || node.getAttribute('data-bind')) {
            dataBind = node.getAttribute('data-bind');
        }
    }

    dataBind = (dataBind || "config.json").split(",");

    console.info("======= 加载数据文件开始 Start =======");

    for(let i in dataBind) {
        console.info(dataBind[i]);
        // 获取呈现模块的配置
        $.ajax({
            url: "/dispatch/" + dataBind[i],
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            success: function (config) {
                // 数据递归调用
                for(let i in config) {
                    let c = config[i];
                    c.requestModel == 'local' ?
                        (console.warn('注意："%s"使用的是测试数据：%s', c.domId, JSON.stringify(c.data)), doData(false, c, c.data)) :
                        requestData(c);
                }
            },
            error: function (d) {
                let err = "请求配置数据失败！请检查配置文件！\r\n" + JSON.stringify(d);
                console.error(err);
                alert(err);
            }
        });
    }

    console.info("======= 加载数据文件结束  End  =======");

    // 请求数据
    function requestData(c) {
        $.ajax({
            url: c.ajax,
            type: c.requestType || "GET",
            dataType: "jsonp", //指定服务器返回的数据类型
            success: function (d) {
                try {
                    doData(false, c, d);
                } catch (e) {
                    doData(true, c, d);
                }
            },
            error: function (d) {
                doData(true, c, d);
            }
        })
    }

    /**
     * 处理数据
     * @param error
     * @param c
     * @param data
     */
    function doData(error, c, data) {
        $.dispatch.data[c.domId] = (data = $.isArray(data) ? data : [data]);

        if(c.callback) return eval(c.callback).call(c, error, data);

        let dom = $('#'+c.domId);

        if(c.template) {
            dom.html(c.domId, $.dispatch.template(c.template, data).join(""));
        } else {
            let dataFields = dom.find("[data-field]");

            for(let i in data) { // data数组
                if(dataFields.length)
                    for(let j=0; j<dataFields.length; j++) {
                        let el = $(dataFields[j]);
                        el.text(data[i][el.attr('data-field')]);
                    }

                if(!Vue) return;

                new Vue({
                    el: '#app',
                    data: data[i]
                });
            }
        }
    };

    $.extend({
        findFiled: function (field) {
            return $('[data-field="' + field + '"]');
        },
        createTemplates: function (dom, template, nums) {
            for (var i = 0; i < nums; i++)
                dom.append(template);
            return $;
        }
    });

    $.extend({
        dispatch: {
            data: {},
            text: function (arg1, arg2, arg3) {
                if(arguments.length == 2)
                    $('#'+arg1).text(arg3);
                else
                    $('#'+arg1).find('[data-field="'+arg2+'"]').text(arg3);
            },
            html: function (arg1, arg2, arg3) {
                if(arguments.length == 2)
                    $('#'+arg1).html(arg2);
                else
                    $('#'+arg1).find('[data-field="'+arg2+'"]').html(arg3);
            },
            template: function (template, data) {
                let html = [];

                for(let i in data) { // data数组
                    let tp = template;
                    for(let o in data[i]) {
                        let rex = new RegExp('{'+o+'}', "g");
                        tp = tp.replace(rex, data[i][o]);
                    }
                    html.push(tp);
                }

                return html;
            }
        }
    });
}

window.define ? define(['jQuery','vue'], dispatch) : dispatch($, Vue);