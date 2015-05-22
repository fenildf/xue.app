/* <<<<<<<<<<<<<<<<<<<<<<<<< APP公共部分 >>>>>>>>>>>>>>>>>>>>>>>>>> */

var app = app || {};
// xmpp服务器地址
app.server = 'http://jzh.xueersi.com/http-bind';
// 用户后缀
app.domain = '@chat-app';
// 房间后缀
app.roomDomain = '@conference.chat-app';
// Strophe对象
app.talk = null;

app.url = '//jzh.xueersi.com';

app.path = {
    img: 'http://xesapp.sinaapp.com/img',
    icon: 'http://xesapp.sinaapp.com/img/emoteicon',
    js: 'http://xesapp.sinaapp.com/js',
    css: 'http://xesapp.sinaapp.com/css'
};

app.ajaxPath = {};
app.ajaxPath.questions = app.url + '/TestManage';
app.ajaxPath.myfiles = app.url + '/MyMaterials';