/* <<<<<<<<<<<<<<<<<<<<<<<<< APP公共部分 >>>>>>>>>>>>>>>>>>>>>>>>>> */

var app = app || {};
// websocket协议服务器地址
app.server = 'ws://im.xesv5.com:9006';;
app.url = '//laoshi.xueersi.com';

app.username = null;
app.password = null;
app.nickname = null;
app.roomname = null;
app.roomid = null;
app.spaceid = null;
app.imgcode = null;
app.userpic = null;
app.Msgnum = 100;
app.roomidMsg = {};

app.path = {
    img: '/static/img',
    icon: '/static/img/emoteicon',
    js: '/static/js',
    css: '/static/css'
};

app.ajaxPath = {};
//app.ajaxPath.questions = app.url + '/WebRooms';
app.ajaxPath.questions = app.url + '/TestManage';
app.ajaxPath.myfiles = app.url + '/MyMaterials';
// 本地存储临时数据
app.storage = {
	roomlist : [],
	userinfo : {},
	username : null,
	nickname : null,
	usercode : null,
	userpic : null,
	usertype : null,
	roomid : null,
	roomname : null
};

app.box = {
    username: '#username',
    password: '#password',
    imgcode: '#imgcode',
    nickname: '#sidebar .nickname',
    sidebar: '#sidebar',
    content: '#content',
    roomlist: '#roomlist',
    sidebody: '#side_setting',
    loginbar: '#loginbox',
    container: '.container',
    roomtitle: '#roomtitle',
    sendfrom: '#content_foot',
    textarea: '#input_textarea',
    messagelist: '#message_box',
    messagewrap: '#content_body',
    setting: '#side_setting'
};

app.btn = {
    submit: '#btn_submit',
    emotes: '#btn_emotes',
    images: '#btn_upfile',
    setting: '#btn_setting',
    groups: '#btn_groups',
    users: '#btn_users',
    history: '#btn_history',
    close: '#btn_closeroom',
    checkOut: '#btn_checkOut',
    checkIn: '#btn_checkIn',
    login: '#btn_login',
    logout: '#btn_logout',
    send: '#btn_send',
    checkbox:'#btn_checkbox'
};

app.tpl = {
    loginbar: '<div class="welcome"><img src="' + app.path.img + '/welcome_new.png" alt="" /></div><div class="panel panel-default"><div class="panel-heading">内部版登录</div>' + '<div class="panel-body">' + '<form class="form-horizontal" role="form" action="javascript:void(0);">' + '<div class="form-group">' + '<label class="col-sm-2 control-label" for="username">用户名</label><div class="col-sm-10"><input type="email" class="form-control" id="username" autocomplete="off" placeholder="登录网校的用户名/邮箱" value="$historyusername$"></div>' + '</div>' + '<div class="form-group">' + '<label class="col-sm-2 control-label" for="password">密码</label><div class="col-sm-10"><input type="password" class="form-control" id="password" autocomplete="off" placeholder="请输入网校用户密码" value=""></div>' + '</div>' + '<div class="form-group">' + '<label class="col-sm-2 control-label" for="imgcode">验证码</label>' + '<div class="col-sm-10"><div class="input-group">' + '<input type="text" class="form-control col-sm-8" id="imgcode" autocomplete="off" placeholder="" >' + '<span class="input-group-addon"><a href="javascript:void(0);" class="change_codeimg"><img src="" alt="" id="codeimg"></a></span>' + '</div></div>' + '</div>' +'<div style="padding-top:0" class="checkbox"><label><input type="checkbox" id="btn_checkbox" $historychecked$>记住用户名</label>'+ '</div>'+ '<button id="btn_login" type="button" class="btn btn-primary btn-block" data-loading-text="登录中...">登录</button>' + '</form>' + '</div>' + '</div>',
    setting: '<div class="list-group">\
    			<a href="javascript:void(0);" class="list-group-item btn_apply_num"><span class="badge apply_num" style="display:none;">0</span>我收到的加群申请</a>\
    			<a href="javascript:void(0);" class="list-group-item btn_userinfo_edit">修改我的个人信息</a>\
    			<a href="javascript:void(0);" class="list-group-item btn_questions">我的互动题</a>\
    			</div>\
    			<p> &nbsp;</p><p> &nbsp;</p>\
    			<button id="btn_logout" type="button" class="btn btn-default btn-block" data-loading-text="Loading..."> 退出登录 </button>'
};
//当前登录用户的基础信息
app.userinfo = {};
app.roomlist = {};
app.msgQueue = {};
app.msglist = {};
app.emote = app.emote || {};
app.emote.data = {
    1: '1f60a',
    2: '1f60d',
    3: '1f618',
    4: '1f633',
    5: '1f621',
    6: '1f613',
    7: '1f632',
    8: '1f62d',
    9: '1f601',
    10: '1f631',
    11: '1f616',
    12: '1f609',
    13: '1f60f',
    14: '1f61c',
    15: '1f630',
    16: '1f622',
    17: '1f61a',
    18: '1f604',
    19: '1f62a',
    20: '1f623',
    21: '1f614',
    22: '1f620',
    23: '1f60c',
    24: '1f61d',
    25: '1f602',
    26: '1f625',
    27: '1f603',
    28: '1f628',
    29: '1f612',
    30: '1f637',
    31: '1f61e',
    32: '1f47f',
    33: '1f47d',
    34: '1f444',
    35: '2764',
    36: '1f494',
    37: '1f498',
    38: '1f49d',
    39: '1f4a9',
    40: '1f44d',
    41: '1f44e',
    42: '1f44a',
    43: '270c',
    44: '1f44c',
    45: '1f4aa',
    46: '1f446',
    47: '1f447',
    48: '1f448',
    49: '1f449',
    50: '1f467',
    51: '1f466',
    52: '1f469',
    53: '1f468',
    54: '1f491',
    55: '1f48f',
    56: '1f47c',
    57: '1f480',
    58: '1f431',
    59: '1f436',
    60: '1f42d',
    61: '1f439',
    62: '1f430',
    63: '1f43a',
    64: '1f438',
    65: '1f42f',
    66: '1f428',
    67: '1f43b',
    68: '1f437',
    69: '1f42e',
    70: '1f417',
    71: '1f435',
    72: '1f434',
    73: '1f40d',
    74: '1f426',
    75: '1f414',
    76: '1f427',
    77: '1f41b',
    78: '1f419',
    79: '1f420',
    80: '1f433',
    81: '1f42c',
    82: '2600',
    83: '2614',
    84: '1f319',
    85: '2728',
    86: '26a1',
    87: '2601',
    88: '26c4',
    89: '1f30a',
    90: '1f4a4',
    91: '1f4a6',
    92: '1f3b5',
    93: '1f525',
    94: '1f339',
    95: '1f33a',
    96: '1f334',
    97: '1f335',
    98: '1f385',
    99: '1f47b',
    100: '1f383',
    101: '1f384',
    102: '1f514',
    103: '1f389',
    104: '1f388',
    105: '1f4bf',
    106: '1f4f7',
    107: '1f3a5',
    108: '1f4bb',
    109: '1f4fa',
    110: '1f513',
    111: '1f512',
    112: '1f511',
    113: '1f4a1',
    114: '1f6c0',
    115: '1f4b0',
    116: '1f52b',
    117: '1f48a',
    118: '1f4a3',
    119: '26bd',
    120: '1f3c8',
    121: '1f3c0',
    122: '1f3c6',
    123: '1f47e',
    124: '1f3a4',
    125: '1f3b8',
    126: '1f459',
    127: '1f451',
    128: '1f302',
    129: '1f45c',
    130: '1f484',
    131: '1f48d',
    132: '1f381',
    133: '1f48e',
    134: '2615',
    135: '1f382',
    136: '1f37a',
    137: '1f37b',
    138: '1f378',
    139: '1f354',
    140: '1f35f',
    141: '1f35d',
    142: '1f363',
    143: '1f35c',
    144: '1f366',
    145: '1f34e',
    146: '1f680',
    147: '1f684',
    148: '1f6b2',
    149: '1f3c1',
    150: '1f6b9',
    151: '1f6ba',
    152: '2b55',
    153: '274c'
};