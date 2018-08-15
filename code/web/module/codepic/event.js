/**
 * Created by sirzh on 8/10/2018.
 */
var ov = [];
let out=["1","2","3","4","5","6","7","8","9","0", "a","æ","b","c","d","ð","e","f","g","h","i","l","m","n","o","p","r","s","t","þ","Ƿ","x","y","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

define(['jQuery'], function ($) {
    var isButtonDown = false;
    var canvas = $('#canvas');
    var bodyWidth =  $('body').width() * 0.49;
    var bodyHeight =  $('body').height() * 0.9;
    canvas.attr("width", bodyWidth);
    canvas.attr("height", bodyHeight);
    var ctx = canvas[0].getContext("2d");

    $('#drawbtn').on("click", function () {
        ctx.fillStyle = "#9cc9e9";

        var li1 = [], li = [];
        for(var i=0; i<50; i++) {
            for(var j=0; j<125; j++) {
                if(ov[j] && ~ov[j].indexOf(i))
                    li1.push(out[Math.round(Math.random()*out.length)]);
                else
                    li1.push("-");
            }
            li1.push("\r\n");
        }

        for(var i=0; i<50; i++) {
            for(var j=0; j<100; j++) {
                if(ov[j] && ~ov[j].indexOf(i))
                    li.push(out[Math.round(Math.random()*out.length)]);
                else
                    li.push("-");
            }
            li.push("\r\n");
        }

        console.log(li.join(""));
        $('#t-result').text(li1.join(""));
    });

    $('#clearbtn').on("click", function () {
        ctx.fillStyle = "#9cc9e9";
        canvas[0].getContext("2d").fillRect(0,0, bodyWidth,  bodyHeight);
        ov=[];
    });

    var event = {
        mousemove: function(e){
            draw(e.offsetX, e.offsetY, e);
        },
        mousedown: function(e){
            isButtonDown = true;
            draw(e.offsetX, e.offsetY, e);
        },
        mouseup: function(e){
            isButtonDown = false;
        }
    };

    function draw(x, y) {
        if(!isButtonDown) return;
        ctx.fillStyle =  "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
        canvas[0].getContext("2d").fillRect(x,y, 10, 10);
        var ox = Math.round(x/8);
        if(![x]) [x] = [];

        [x].push(y);

        if(!ov[ox]) ov[ox] = [];
        ov[ox].push(Math.round(y/20));
        ov[ox].push(Math.round(y/20)+1);
        ov[ox].push(Math.round(y/20)-1);

    }

    for(var e in event) canvas.on(e, event[e]);
});