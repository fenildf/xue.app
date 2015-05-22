// /**
//  *
//  * @authors Your Name (you@example.org)
//  * @date    2014-03-06 20:27:41
//  * @version $Id$
//  */

var xue = xue || {};
xue.log=function(a){console.log(a);};
xue.clear=function(){console.clear();};

var BOSH_SERVICE = 'http://www.xxyys.com/http-bind';
var connection = null;

// xue.app = xue.app || {};
if (!String.prototype.encodeHTML) {
    String.prototype.encodeHTML = function() {
        return this.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
}
if (!String.prototype.decodeHTML) {
    String.prototype.decodeHTML = function() {
        return this.replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');
    };
}
jQuery.cookie=function(a,b,c){if("undefined"==typeof b){var i=null;if(document.cookie&&""!=document.cookie)for(var j=document.cookie.split(";"),k=0;k<j.length;k++){var l=jQuery.trim(j[k]);if(l.substring(0,a.length+1)==a+"="){i=decodeURIComponent(l.substring(a.length+1));break}}return i}c=c||{},null===b&&(b="",c.expires=-1);var d="";if(c.expires&&("number"==typeof c.expires||c.expires.toUTCString)){var e;"number"==typeof c.expires?(e=new Date,e.setTime(e.getTime()+1e3*60*60*24*c.expires)):e=c.expires,d="; expires="+e.toUTCString()}var f=c.path?"; path="+c.path:"",g=c.domain?"; domain="+c.domain:"",h=c.secure?"; secure":"";document.cookie=[a,"=",encodeURIComponent(b),d,f,g,h].join("")};


// 更新验证码图片
function changeVerificationImg(imgId) {
    var newVerificationImg = '//www.jzh.com/Verifications/show?' + generateMixed(12);
    $('#' + imgId).attr('src', newVerificationImg);
}

// 生成随机字符串
function generateMixed(n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}


//获取服务器所有的房间
function getRoomList() {
    var iq = $iq({
        from: $("#jid").val(),
        id: 'disco2',
        to: 'conference.lidongsheng-lenovo',
        type: 'get'
    }).c('query', {
        xmlns: 'http://jabber.org/protocol/disco#items'
    });
    setMessage(iq);
    connection.sendIQ(iq.tree(), function(msg) {
        xue.log(msg);
        var tpl = '';
        $(msg).find('query').find('item').each(function(index, ele) {
            // alert($(ele).attr('jid'));
            tpl += '<li class="list-group-item media roomitem" data-roomid="' + $(ele).attr('jid') + '">';
            tpl += '	<span class="pull-right">233/1455</span>';
            tpl += '	<div class="media-body">';
            tpl += '		<h5 class="media-heading"><span class="roomtitle">' + $(ele).attr('name') + '</span>';
            tpl += '	<span class="label label-default">0</span>';
            tpl += '			</h5>';
            tpl += '	</div>';
            tpl += '</li>';
        });
        $('#roomlist').html(tpl);
    }, null, 30);
}

//进入房间
function goRoom(roomid) {
    var conbox = $('#content');
    var userid = $('#jid').val();
    conbox.show();
    conbox.data({
        roomid: roomid,
        userid: userid
    });
    clearMessage();
    resize();

    var pre = $pres({
        from: userid,
        to: roomid + '/' + userid
    }).c('x', {
        xmlns: 'http://jabber.org/protocol/muc'
    }).c('passwordword', {}, '111111');
    // setMessage(pre);
    connection.send(pre.tree());

}

// 发送信息
function sendMessages() {
    var vbox = $('#talk'),
        val = vbox.val();
    var data = $('#content').data();

    var msg = $msg({
        from: data.userid,
        to: data.roomid,
        type: 'groupchat'
    }).c('body', {}, $('#talk').val());
    // setMessage(msg);
    xue.log($msg);

    connection.send(msg.tree());
}

function setMessage(msg) {
    var m = msg;
    $('#log').append(msg);
    goBottom();
}

function resize() {
    var panel = $('#content > .panel'),
        head = panel.find('.panel-heading'),
        body = panel.find('.panel-body'),
        foot = panel.find('.panel-footer');
    body.height(panel.height() - head.outerHeight() - foot.outerHeight() - 30);

    var sidebox = $('#sidebar > .panel');
    var side = {
        head : sidebox.find('.panel-heading'),
        body : sidebox.find('#roomlist'),
        foot : sidebox.find('#content_footer')
    };

    side.body.height(sidebox.height() - side.head.outerHeight() - side.foot.outerHeight() - 30);

}

function goBottom() {
    var box = $('#log');
    $('#content_body').scrollTop(box.height());
}

function clearMessage() {
    $('#log').empty();
}

$(window).resize(resize);
$(function() {
    resize();
    try {
        connection = new Strophe.Connection(BOSH_SERVICE);
        //log('recv: ' + data);
        connection.rawInput = function(data) {};
        //log('send: ' + data);
        connection.rawOutput = function(data) {};
        connection.xmlOutput = function(elem) {};
    } catch (e) {

    }

    // 登录
    $('#connect').on('click', function() {
        var button = $('#connect');
        if (button.text() == '登录') {
            button.text('disconnect');
            connection.connect($('#jid').val(), $('#pass').val(), onConnect);
        } else {
            button.text('connect');
            connection.disconnect();
        }
    });

    // 房间列表点击事件
    $('#roomlist').on('click', '.roomitem', function() {
        var that = $(this),
            id = that.data('roomid');
        $('#roomtitle').text(that.find('.roomtitle').text());
        // connection.disconnect();
        goRoom(id);
    });

    // 发送按钮点击事件
    $("#send").click(function() {
        sendMessages();
    });

    $('#topbar_clear').on('click', function() {
        clearMessage();
    });

    $('#talk').on('keydown', function(eve) {
        var v = eve || window.event;
        // if(v.keyCode == 13 && v.ctrlKey){
        if (v.keyCode == 13) {
            sendMessages();
        }
    });
});


function onMessage(msg) {
    xue.log(msg);
    var m = $(msg);
    var o = {
        to: m.attr('to'),
        from: m.attr('from'),
        type: m.attr('type'),
        body: m.find('body')
    };
    o.content = String(o.body.html()).decodeHTML();
    o.user = $(o.content);
    o.msg = o.user.find('msg');
    xue.log(o.msg);
    var user = null,
        info = null,
        message = null;
    if (o.user.length > 0) {
        user = {
            name: o.user.attr('nickname'),
            avatar: o.user.attr('headimg')
        };
    }

    if (o.msg.length > 0) {
        info = {
            id: o.msg.attr('mid'),
            type: o.msg.attr('type'),
            msgType: o.msg.attr('mtype'),
            sendTime: o.msg.attr('sendtime')
        };
    }

    if (user) {
        message = '<div class="bs-callout bs-callout-info">';
        message += '<h4><span class="label label-info">' + user.name + ':</span></h4>';
        message += '<p class="alert alert-default">' + o.msg.find('content').html() + '</p>';
        message += '</div>';
    } else {
        message = '<p class="alert alert-default">' + o.body.text() + '</p>';
    }
    setMessage(message);

    return true;
}

// 链接服务器状态
function onConnect(status) {
    switch (status) {
        case Strophe.Status.CONNECTING:
            xue.log('is connecting.');
            break;
        case Strophe.Status.CONNFAIL:
            xue.log('is connect fail');
            break;
        case Strophe.Status.DISCONNECTING:
            xue.log('is disconnecting');
            break;
        case Strophe.Status.DISCONNECTED:
            xue.log('is disconnected');
            break;
        case Strophe.Status.CONNECTED:
            xue.log('is connected');
            $('#loginbox').hide();
            $('.container').show();
            resize();

            connection.addHandler(onMessage, null, 'message', null, null, null);
            connection.send($pres().tree());
            getRoomList();

        break;
    }
}



function getMsg(msg){
    var tpl = '<user headimg="http://x03.xesimg.com/himg/836e7024a365f57c523b727477d0d850_small.jpg" nickname="jddnnf的妈妈"><msg sendtime="" mtype="text" type="user" mid=""><content>njccjckcjx</content></msg></user>';
}



