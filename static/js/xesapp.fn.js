
/*******************************************
 *
 * 协议：聊天协议业务相关优化
 * @version 1.0
 * @anthor : DuXinli
 * @upload : 2015-4-20 by DuXinli
 *
*********************************************/


/**
 * fancybox
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 * http://fancyapps.com/fancybox/#docs
 * cn : http://xufukun.com/tools/fancybox2/index.html
 */
app.win = function(opt) {

    var con = {
        padding: null,
        margin: null,
        width: null,
        height: null,
        wrapCSS: null,
        modal: null,
        type: null, //  'image', 'inline', 'ajax', 'iframe', 'swf' and 'html'
        title: null,
        tpl: {
            wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
            image: '<img class="fancybox-image" src="{href}" alt="" />',
            // iframe   : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0"' + ($.browser.msie ? ' allowtransparency="true"' : '') + '></iframe>',
            error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
            closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
            next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
            prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
        }
    };
    $(".fancybox-button").fancybox({
        prevEffect: 'none',
        nextEffect: 'none',
        content: opt.content,
        closeBtn: true,
        helpers: {
            //     title   : { type : 'inside' },
            //     buttons : {}
            overlay: {
                css: {
                    'background': 'rgba(58, 42, 45, 0)'
                }
            }
        }
    });
};
app.win.close = function() {
    $.fancybox.close();
};
app.win.cancel = function() {
    $.fancybox.cancel();
};
app.win.open = function() {
    $.fancybox.open();
};
app.win.position = function() {
    $.fancybox.reposition();
};

/**
 * 分页方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.pages = function(opt) {
    var con = {
        wrap: '.ui_pages',
        total: 25, // 总条数
        page: 1, // 当前页数
        rows: 10, // 每页条数
        handle: null
    };
    var o = $.extend(con, opt);
    o.pages = Math.ceil(o.total / o.rows);

    app.pages.opt = o;

    if ($(o.wrap).find('.page_item').length != o.pages) {
        app.pages.create();
    }
    if (o.handle) {
        $(o.wrap).find('.page_item:not(.active)').on('click', function() {
            var that = $(this),
                cur = that.data('val');
            o.handle(cur);
        });
    }
    return app.pages;
};

// app.pages.opt = {
//     wrap : '.ui_pages',
//     total : 25, // 总条数
//     page : 1,   // 当前页数
//     rows : 3,  // 每页条数
//     handle : null
// };
app.pages.create = function(all, current, row) {
    var total = all || this.opt.total;
    var page = current || this.opt.page;
    var rows = row || this.opt.rows;

    var pages = Math.ceil(total / rows);

    page = page < 0 ? 0 : (page > pages ? pages : page);

    var tpl = '';
    tpl += '    <ul class="pagination ui_pages" data-rows="" data-current="1">';
    if (pages > 1) {
        for (var i = 0; i < pages; i++) {
            var num = Number(i + 1);
            if ((i + 1) === page) {
                tpl += '        <li class="page_item active"><a href="#">' + num + ' <span class="sr-only">(current)</span></a></li>';
            } else {
                tpl += '        <li class="page_item " data-val="' + num + '"><a href="javascript:void(0);">' + num + '</a></li>';
            }
        }
    }
    tpl += '    </ul>';
    $(this.opt.wrap).html(tpl);
};

app.pages.fn = function() {};

// 创建风格选择功能按钮
app.createStyle = function() {
    var tpl = '';
    tpl += '    <button type="button" class="btn btn-default btn-sm style_handle"> <i class="glyphicon glyphicon-chevron-left"></i> </button>';
    for (var i = 0, len = 30; i <= len; i++) {
        tpl += '    <a href="javascript:void(0);" class="btn btn-default btn-sm style_item" data-val="skin_' + String(i + 1).padLeft(2, 0) + '"> &nbsp; </a>';
    }

    if ($('#style_list').length === 0) {
        $('body').append('<div id="style_list" class="btn-group style_hide">' + tpl + '</div>');
    } else {
        $('#style_list').html(tpl);
    }
};

app.close = function() {

};
app.hidePopover = function(ev) {
    var tar = $(ev.target);
    if (tar.attr('id') != 'btn_emotes' && tar.closest('.popover').attr('role') != 'tooltip') {
        $(app.btn.emotes).popover('hide');
    }
};
/**
 * 创建右侧panel的公共方法
 * @type {Object}
 */
app.panel = {};
(function(){
    var panel = app.panel;
    panel.tpl = {
        head : '<div class="panel-heading">{$button$}{$tools$}{$title$}</div>',
        body : '<div class="panel-body panel_content">{$content$}</div>',
        foot : false
    };
    panel.opt = {
        id : 'panel',
        title : '家长会',
        content : '',
        footer : null,
        toolbar : null,
        opacity : true,
        buttons : [
            // {
            //     id : '',
            //     title : '',
            //     name : '',
            //     cls : '',
            //     position : 'right',
            //     icon : '',
            //     link : '',
            //     callback : null
            // }
        ]
    };
    panel.create = function(opt){

        if(opt){
            $.extend(this.opt, opt);
        }
        var wrap = $(app.box.content), box = $('#'+this.opt.id);

        var btns = '', btn_l = '<div class="btn-group pull-left">', btn_r = '<div class="btn-group pull-right">';
        if(this.opt.buttons.length > 0){
            $.each(this.opt.buttons, function(k, v){
                var pos = v.position || 'right';
                var title = v.title || '';
                var id = v.id || '';
                var cls = v.cls || '';
                var data = '';
                var btn_temp = '';
                if(v.data){
                    $.each(v.data, function(dname, dval){
                        data += 'data-' + dname + '=' + dval + ' ';
                    });
                }

                btn_temp += '<button class="btn btn-default btn-sm pull-'+ pos +' toolbar_btn '+ cls +'" title="'+ title +'" href="javascript:void(0);" id="'+ id +'" '+ data +'>';
                if(v.icon){
                    btn_temp += '<i class="fa fa-'+ v.icon +' fa-3"></i>';
                }
                if(v.name || !v.icon){
                    var name = v.name || v.title;
                    btn_temp += '<b class="btn_title">' + name + '</b>';
                }
                btn_temp += '</button>';
                if(pos === 'left'){
					btn_l += btn_temp;
				}else if(pos === 'right'){
					btn_r += btn_temp;
				}
            });
        }
        btn_l += '</div>';
        btn_r += '</div>';
        btns = btn_l + btn_r;

        var tit = this.opt.title ? '<h2 class="text-center">'+ this.opt.title +'</h2>' : '';
        var head = '<div class="panel-heading">' + btns + tit + '</div>';
        var body = '<div class="panel-body panel_content">'+ this.opt.content +'<div>';
        var foot = this.opt.footer ? '<div class="panel-footer panel_footer"></div>' : '';

        var tpl = head + body + foot;

        var isOpacity = this.opt.opacity ? 'panel-opacity' : '';

        $('#content_message').hide();
        if (box.length === 0) {
            wrap.append('<div id="'+ this.opt.id +'" class="panel panel-default h600 panel_list '+ isOpacity +'"></div>');
        }
        box = $('#' + this.opt.id);
        box.html(tpl).show().siblings('.panel').hide();
        wrap.removeClass('sr-only').show();
        return this;
    };
    panel.show = function(opt){

    };
})();


/**
 * 本地存储相关方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.ls = app.ls || {};
(function(){
	var ls = app.ls;
	/*
	 * 如果有keys和val则先设置app.storage里面的对应内容；
	 * 然后再把app.sotrage转换成string
	 * 最后存入localstorage里面
	 */
	ls.set = function(keys, val){
		app.storage[keys] = val;
		var v = xue.json.stringify(app.storage);
		$.LS.set('app', v);
	};
	/*
	 *
	 * 先从localstorage里面取出app的内容
	 * 把取出的内容转换成JSON
	 * 如果有keys返回出对应值，否则返回这个json内容
	 */
	ls.get = function(keys){
		var v = $.LS.get('app');
		var val = xue.json.parse(v);
		if(keys && val[keys]){
			return val[keys];
		}else{
			return val;
		}
	};
	ls.remove = function(keys){
		var v = $.LS.get('app');
		var val = xue.json.parse(v);
		if(keys && val[keys]){
			app.storage[keys] = null;
			delete val[keys];
			$.LS.set('app', xue.json.stringify(val));
		}else{
			$.each(app.storage, function(k, m){
				app.storage[k] = null;
			});
			$.LS.remove('app');
		}
	};
})();


/****<<<<<<<<<<<<<<<<<<<<<<<<<<< 业务相关功能 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>****/ 


/**
 * 登录方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.login = function() {
    $(app.btn.login).button('loading');
    app.username =  $(app.box.username).val();
    app.password =  $(app.box.password).val();
    app.imgcode =  $(app.box.imgcode).val();
    
    $.ajax(app.url + '/Jzhrpc/login', {
        data: {
            username: app.username,
            password: app.password,
            verificationCode: app.imgcode
        },
        success: function(d) {
            //判断是否选择记住用户名
            var checkbox_checked = $(app.btn.checkbox).prop("checked");
           
            if(checkbox_checked){
                $.LS.set('username', app.username);
            }else{
                 try{
                   var usernamelocalstorage = $.LS.get("username");
                    $.LS.remove("username");
                }catch(e){

                }
            }
            
            // 登录失败重新获取验证码
            if (d.sign != 1) {
                alert(d.data);
                $(app.btn.login).button('reset');
                changeVerificationImg('codeimg');
                $(app.box.imgcode).val('');
                return;
            }
            //以变量形式存储用户信息
            app.userinfo = d.data.userInfo;
            $.cookie('app_nickname', d.data.userInfo.nickname);
            $.cookie('app_username', app.username);
            $.cookie('app_usertype', d.data.userInfo.type);
            $.cookie('app_userpic', d.data.userInfo.himg);
            $.cookie('app_sessid', d.data.userInfo.sessid);
            $.cookie('app_version', d.data.userInfo.version);

            //$.cookie('app_userPwd', $.base64.encode(app.password));
            //链接websocket
            app.Websocket.onConnected(d.data.userInfo.sessid);

            app.ls.set('username', app.username);
            app.ls.set('userpic', d.data.userInfo.himg);
            app.ls.set('userinfo', d.data.userInfo);
            app.ls.set('usertype', d.data.userInfo.type);
             
        }
    });
};
// 退出
app.logout = function() {

    $.removeCookie('app_sessid');
    $.ajax(app.url + '/Users/logout', {
        success: function(d) {
            if (d.sign != 1) {
                alert(d.data);
                return;
            }
            $(app.box.username).val('');
            $(app.box.password).val('');
            $(app.box.imgcode).val('');
            $.removeCookie('app_username');
            $.removeCookie('app_nickname');
            $.removeCookie('app_usertype');
            $.removeCookie('app_userpic');
            $.removeCookie('app_sessid');
            $.removeCookie('app_version');
            $.removeCookie('LockedRoom');
            $.removeCookie('app_roomid');
            $.removeCookie('app_roomname');

            app.ls.remove();
            try{
               var usernamelocalstorage = $.LS.get("username");
               if(usernamelocalstorage && usernamelocalstorage!='null'){
                     app.historyusername = usernamelocalstorage;
                     $.LS.remove("username");
                     $.LS.set('username', app.historyusername);
               }else{
                    $.LS.remove("username");
               }

            }catch(e){

            }
            // 获取验证码
            changeVerificationImg('codeimg');
            var url = window.location.href;
            url = url.replace(/#/g, '');
            setTimeout(function() {
                window.location.href = url;
            }, 200);
        }
    });
};

/**
 * webscoket发送消息、解析消息封装方法类
**/

app.Websocket = app.Websocket || {};
app.Websocket.websocket = '';

(function(socket){
     /**连接websocket聊天协议**/
     socket.onConnected = function(sessionId,versionNumber){
            var This = this;
            this.websocket = new WebSocket(app.server);
            var Message = new Protocol.Message.Message();
            Message.packageType = Protocol.Message.PackageType.PACKAGE_NORMAL;
            Message.messageType = Protocol.Message.MessageType.PACKAGE_MSG_SYS;
            Message.messageEvent = Protocol.Message.MessageEvent.PACKAGE_MSG_ON_ISLOGIN;//消息事件类型  默认登录
            Message.versionNumber = versionNumber;
            Message.sessionId = sessionId;
            Message.deviceSource = 'pc';
            this.websocket.onopen = function(){
                 console.log('open');
                 This.send(Message);
            }

            this.websocket.onmessage = function(evt){
                 console.log('onmessage');
                 This.readmsg(evt);
            };    

            this.websocket.onclose = function(){
                console.log('Closed');
            }

            this.websocket.onerror = function(evt){
                 console.log("WebSocketError!");
            };
       
     };

     /**发送消息的封装打包**/

     socket.send = function(msg){
            var messagePack = new Message.MessagePack();
            var buff = messagePack.getBuff(msg); 
            this.websocket.send(buff);
     };

    
     /**
      * @description
      *
      * 收到消息的解析和呈现
      *    1. 解析获取的二进制消息messages
      *    2. 判断获得消息的消息事件
      *    3. 根据响应的消息事件分别作相应的处理
     **/
     socket.readmsg = function(evt){
            var reader = new FileReader();
            var This = this;
            reader.onload = function(evt){
              if(evt.target.readyState == FileReader.DONE){
                  var bin = evt.target.result;
                  /*var data1 = new Uint8Array(bin);
                  var data2 = new Uint8Array(bin.byteLength - 4);
                  data2.set([].slice.call(data1,4));*/
                  var messagePack = new Message.MessagePack();
                  var messages = messagePack.decode(bin);
                  console.log(messages);
                  if(!messages.returnResult.status){
                      alert(messages.returnResult.reason);
                      app.logout();
                      return false;
                  }
                  This.checkMessage(messages);
              }
          }
          reader.readAsArrayBuffer(evt.data);
     };
     //消息事件检测
     socket.checkMessage = function(messages) {
            /**
              * @description
              *
              * 对不同的消息事件分别作相应的处理
              *    1. 判断消息事件类型
              *    2. 判断内容消息类别
              *    3. 系统消息的处理
              *   
            **/ 
            var This = this;

            var FunEvents={
                   FunEvent_0: function(){/*普通聊天消息*/
                          This.onMessage(messages);
                   },
                   FunEvent_1: function(){/*校验用户会话请求，应用场景（用户im连接权限校验和重连）*/
                          console.log('重连');
                          var sessid = $.cookie('app_sessid');
                          var version = $.cookie('app_version');
                          // 如果存在sessid && version则直接重连服务器
                          if (sessid && (version||version == 0)){
                              This.onConnected(sessid,version);
                          }
                   },
                   FunEvent_2: function(){/*校验用户会话结果，应用场景（用户im连接权限校验和重连），登录成功之后的信息都在这里判断*/
                          console.log('登录成功结果');
                          //以变量的形式存储用户信息
                          app.username = $.cookie('app_username');
                          app.nickname = $.cookie('app_nickname');
                          app.userpic = $.cookie('app_userpic');
                          app.usertype = $.cookie('app_usertype');
                          app.ls.set('username', app.username);
                          app.ls.set('userpic', app.userpic);
                          app.ls.set('usertype', app.usertype);

                          $(app.box.nickname).text(app.nickname);
                          $(app.box.setting).html(app.tpl.setting);
                          app.getApplyNum();
                          $(app.box.loginbar).hide();
                          $(app.box.container).show();
                          app.resize();
                          //获取服务器所有的房间
                          This.getRooms(messages);

                          changeVerificationImg('codeimg');
                          $(app.btn.login).button('reset');

                          // 获取当前登录用户的基础信息，存到变量里
                          $.ajax(app.url + '/WebRooms/getUserBasicInfo', {
                                success: function(v) {
                                    if (v.sign != 1) {
                                        alert(v.data);
                                        return;
                                    }
                                    var d = v.data;
                                    $.extend(app.userinfo, d);
                                    app.usercode = app.userinfo.enstuId;
                                    app.ls.set('userinfo', app.userinfo);
                                    app.ls.set('usercode', app.usercode);
                                }
                           });
                           
                           //将历史消息存储到缓存中
                           $.each(messages.msgLists, function(k, v) {
                                  app.roomidMsg[v.roomId].push(v);
                           }) 
                           app.ls.set('app_roomidMsg', app.roomidMsg);

                   },       

                   FunEvent_3: function(){/*发送用户离线通知，应用场景（客户端主动、异常断开连接，代理服务器需向worker发送离线事件，删除用户代理等关系）*/
                            console.log('发送用户离线通知');
                   },
                   FunEvent_4: function(){/*用户离线结果，应用场景（业务服务器处理完成发送给代理的处理结果，客户端不需要这个事件）*/
                           console.log('用户离线结果');
                   },
                   FunEvent_5: function(){/*加群结果通知*/
                            console.log('加群结果通知');
                            var roomid = messages.roomId;
                            var joinRoomInfos = messages.joinRoomInfos;
                            var username = joinRoomInfos.username;
                            if(username != app.username){
                                This.onMessage(messages);
                            }
                   },
                   FunEvent_6: function(){/*退群结果通知*/
                            console.log('退群结果通知');
                            This.onMessage(messages);
                   },
                   FunEvent_7: function(){/*添加金币成功通知*/
                            console.log('添加金币成功通知');
                            This.onMessage(messages);
                   },     
                   FunEvent_8: function(){/*添加经验成功通知* 这个已经没有了*/
                            console.log('添加经验成功通知');
                   },
                   FunEvent_9: function(){/*添加公告成功通知*/
                            console.log('添加公告成功通知在内部版只保存不显示群公告内容');
                            /*This.setMessage(messages,'roomnotice');*/
                   },
                   FunEvent_10: function(){/*群解散结果通知*/
                            console.log('群解散结果通知');
                            var roomid = messages.roomId;
                            alert(messages.dissolveInfos.content);
                            $('#roomlist li[data-roomid="'+ roomid +'"]').remove();
                            if(roomid == app.roomid){
                                $(app.box.content).hide();
                            }
                            var roomidMsgs = app.ls.get('app_roomidMsg');
                            delete roomidMsgs[roomid];//删除移除群的历史消息
                            app.roomidMsg = roomidMsgs;
                            app.ls.set('app_roomidMsg',app.roomidMsg);
                   },
                   FunEvent_11: function(){/*普通的系统消息*/
                            console.log('普通的系统消息');
                   },
                   FunEvent_12: function(){/*多端重复登录互踢系统消息*/
                            console.log('多端重复登录互踢系统消息');
                            alert(messages.kickSystemMsg.content);
                            app.logout();
                   },
                   FunEvent_13: function(){/*管理员把用户移出群系统消息*/
                            console.log('管理员把用户移出群系统消息');
                            var roomid = messages.removeSystemMsg.roomid;
                            var removeContent = messages.removeSystemMsg.content;
                            if(removeContent && removeContent != ''){
                                alert(removeContent);
                            }
                            $('#roomlist li[data-roomid="'+ roomid +'"]').remove();
                            if(roomid == app.roomid){
                                $(app.box.content).hide();
                            }
                            var roomidMsgs = app.ls.get('app_roomidMsg');
                            delete roomidMsgs[roomid];//删除移除群的历史消息
                            app.roomidMsg = roomidMsgs;
                            app.ls.set('app_roomidMsg',app.roomidMsg);
                   },
                   FunEvent_14: function(){/*邀请、审核通过用户加入群---------在家长会才显示此操作*/
                            console.log('邀请、审核通过用户加入群');
                            var v = messages.passSystemMsg;
                            alert(v.content);//通知用户加群成功
                            var roomid = v.roomid;
                            var roomInfo = v.roomInfo;
                            var JionroomList = '';
                            JionroomList += '<li class="list-group-item media roomitem roomid_' + roomInfo.roomId + '" data-pic="' + roomInfo.roomIconUrl + '" data-roomid="' + roomInfo.roomId + '" data-admin="' + roomInfo.roomFirstAdministrator + '" data-member="' + roomInfo.roomMember + '" data-roomNotice ="' + roomInfo.roomNotice + '">';
                            JionroomList +=     '<div class="pull-right"><span class="badge room_newmsg" style="display:none;">0</span></div>';
                            JionroomList +=     '<div class="media-body">';
                            JionroomList +=         '<h5 class="media-heading"><span class="roomtitle">' + roomInfo.roomName + '</span><span class="members"> (' + roomInfo.roomPeopleNum + ') </span>';
                            JionroomList +=             '<span class="label label-default">0</span>';
                            JionroomList +=         '</h5>';
                            JionroomList +=     '</div>';
                            JionroomList += '</li>';
                            $(app.box.roomlist).append(JionroomList);
                            app.roomidMsg[roomid] = [];//把通过加入的群的房间id存储到app.roomidMsg
                            app.roomlist[roomid] = roomInfo;//把通过加入的群的房间的信息存储到app.roomlist
                            app.ls.set('app_roomidMsg',app.roomidMsg);
                   },
                   FunEvent_15: function(){/*管理员禁言用户*/
                            console.log('管理员禁言用户');
                            app.lockroom(messages.banSystemMsg.roomid);
                            alert(messages.banSystemMsg.content);
                   },
                   FunEvent_16: function(){/*管理员解禁用户*/
                            console.log('管理员解禁用户');
                            app.unlockroom(messages.unbanSystemMsg.roomid);
                            alert(messages.unbanSystemMsg.content);
                   },
                   FunEvent_17: function(){/*单独向网页版发送的系统消息，用户修改头像昵称*/
                            console.log('单独向网页版发送的系统消息，用户修改头像昵称');
                   },
                   FunEvent_18: function(){/*单独向网页版发送的系统消息，用户申请加入群，管理员收到消息后，申请数加一*/
                            console.log('单独向网页版发送的系统消息，用户申请加入群，管理员收到消息后，申请数加一');
                            app.setJoinNumber();
                   },
                   FunEvent_19: function(){/*用户发送消息丢失的请求*/
                            console.log('用户发送消息丢失的请求');
                   },
                   FunEvent_20: function(){/*系统给用户返回丢失的消息*/
                            console.log('系统给用户返回丢失的消息');
                   }
             };
             var Events = messages.messageEvent;
                 
             var ProtocolEvent = Protocol.Message.MessageEvent;
             var NewEvent = {};//将ProtocolEvent事件对象的值和键名对换
             for(var e in ProtocolEvent){
                 NewEvent[ProtocolEvent[e]]  = e;
             }
             if(NewEvent[Events]){   
                 var Func = 'FunEvent_' + Events;
                 if (typeof(FunEvents[Func]) === 'function') {
                         FunEvents[Func]();
                }
             }
       
     };
     
     //会话响应成功
     socket.onMessage = function(messages) {
            var from_roomId = messages.roomId;
            if (from_roomId == app.roomid) {
                if ($('#content_message:visible').length === 0) {
                        app.setRoomNewNumber(from_roomId);
                }
                this.setMessage(messages,'Msgshow');
            } else {
                app.setRoomNewNumber(from_roomId);
                this.setMessage(messages);
            }
     }

     // 设置消息
     socket.setMessage = function(messages,tp) {
            /**
              * @description
              *
              * 展示历史消息
              *  1. 每条消息的发送时间处理
              *  2. 判断消息的内容类型
              *     (1) 文本消息类型textMessageBody
              *     (2) 图片消息类型imageMessageBody
              *     (3) 语音消息类型audioMessageBody
              *     (4) 群通知消息类型（历史消息中不显示群通知，群通知事实收才显示）groupMessageBody
              *     (5) 群公告消息类型（历史消息中不用roomNoticeMessageBody就能显示是否有群公告消息，时时接收消息需要群公告的更改）
              *     (6) 发送活动消息类型 sendActivity
              *     (7) 发送互动题消息类型 sendQuestion
              *  
            **/
            /*if(tp == 'roomnotice'){
                var roomnoticeCont = messages.addNoticeInfos.content;
                app.noticeShow(roomnoticeCont);
                return;
            }*/
            var msginfo = '',
                msghead = '',
                nickName = '',
                cls = 'color-default',
                tpCls = 'msg-list-default',
                msgCls = 'alert-info',
                voice = null,
                avatar = '',
                levelName = '',
                groupContent = '',
                v = messages;

            if (v.messageEvent != Protocol.Message.MessageEvent.PACKAGE_MSG_ON_MESSAGE) {//如果不是普通的聊天消息类型0
                tpCls = 'msg-list-warning msg_list_system';
                cls = 'color-warning';
                if(v.messageEvent == Protocol.Message.MessageEvent.PACKAGE_MSG_ON_MSG_JOINROOM_RESULT){
                    nickName = v.joinRoomInfos.nickname;
                    groupContent = v.joinRoomInfos.content;
                }
                if(v.messageEvent == Protocol.Message.MessageEvent.PACKAGE_MSG_ON_MSG_EXITROOM_RESULT){
                    nickName = v.exitRoomInfos.nickname;
                    groupContent = v.exitRoomInfos.content;
                }
                if(v.messageEvent == Protocol.Message.MessageEvent.PACKAGE_MSG_ON_MSG_ADDGOLD_RESULT){
                    nickName = v.addGoldInfos.nickname;
                    groupContent = v.addGoldInfos.content;
                }
            }else{
                if(v.contentType == Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_AUDIO){//语音消息
                   voice = v.audioMessageBody;
                   avatar = voice.headImg;
                   levelName = voice.levelName;
                   nickName = voice.nickName;
                }
                var fromuser = v.fromId;
                if (fromuser == app.username) {
                    nickName = '我';
                    cls = 'color-success';
                    tpCls = 'msg-list-me';
                    msgCls = 'alert-default';
                    avatar = app.userpic || (app.path.img + '/defult_head_img.png');
                    if (voice) {
                        voice.img = app.path.img + '/sound/voice_me.gif';
                    }
                } else {
                    cls = 'text-muted';
                    tpCls = 'msg-list-info';
                    if (voice) {
                        voice.img = app.path.img + '/sound/voice_user.gif';
                    }
                }
                if (v.contentType == Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_TEXT) {
                    avatar = v.textMessageBody.headImg;
                    levelName = v.textMessageBody.levelName;
                    nickName = v.textMessageBody.nickName;
                }
                if (v.contentType == Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_SENDQUESTION) {
                    avatar = v.sendQuestionMessageBody.headImg;
                    levelName = v.sendQuestionMessageBody.levelName;
                    nickName = v.sendQuestionMessageBody.nickName;
                }
                if (v.contentType == Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_PICTRUE) {
                    tpCls += ' msg-list-img';
                    avatar = v.imageMessageBody.headImg;
                    levelName = v.imageMessageBody.levelName;
                    nickName = v.imageMessageBody.nickName;
                }

            }
            
            avatar = avatar || app.path.img +'/defult_head_img.png';

            // 当天的消息只显示时间，不显示日期
            var today = new Date().getTime();
            // var msday = con.time / 1000 / 60 / 60 / 24 / 12;
            var msgtime = xue.date('m月d日 H:i', v.sendTime / 1000);

            if(xue.date('Y/m/d', today / 1000) == xue.date('Y/m/d', v.sendTime / 1000)){
                msgtime = xue.date('H:i', v.sendTime / 1000);
            }

            var time_new = parseInt(v.sendTime / 1000 / 60);

            var lasttime = $(app.box.messagelist).find('.msg-time:last');
            var time_isnew = true;
            if (lasttime.length > 0) {
                var last_d = lasttime.data('time');
                var last_n = parseInt(last_d / 1000 / 60);
                time_isnew = time_new > last_n ? true : false;
            }

            if (time_isnew) {
                msginfo += '    <p class="msg-time" data-time="' + v.sendTime + '"> ' + msgtime + ' </p>';
            }

            msginfo += '<div mid="' + v.sendTime + '" class="msg-list ' + tpCls + '" data-time="' + v.sendTime + '">';
            if (v.messageEvent != Protocol.Message.MessageEvent.PACKAGE_MSG_ON_MESSAGE) {
                msginfo += '<p class="system_group">' + nickName + ' : ' + groupContent + '</p>';
            }else{
                msginfo += '<div class="msg-avatar roomuser_item" data-id="' + fromuser + '"><img class="media-object btn_viewuser" src="' + avatar + '">';
                if(levelName){
                    msginfo += '<span class="label label-default user-levelname">' + levelName + '</span>';
                }
                msginfo += '</div>';
                msginfo += '<div class="msg-body">';
                msginfo += '<h4 class="' + cls + ' useritem" data-id="' + fromuser + '"><span class="msg-username ' + cls + ' ">' + nickName + ':</span> <span class="label-time pull-right" data-time="' + v.sendTime + '"></span></h4>';
                
                if (v.contentType == Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_PICTRUE) {//图片消息

                    msginfo += '<p class="alert alert-normal alert-picture"><a href="' + v.imageMessageBody.bigImageUrl + '" rel="fancybox-button" class="fancybox-button"><img src="' + v.imageMessageBody.smallImageUrl + '" alt="" data-url="' + v.imageMessageBody.bigImageUrl + '" class="img-rounded img-thumbnail"></a></p>';
                
                } else if (v.contentType == Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_AUDIO) {//语音消息

                    msginfo += '<pre class="alert ' + msgCls + '"><a href="javascript:void(0);" class="msg-audio msg_'+ v.sendTime +'" data-url="' + voice.audioUrl + '" data-time="' + voice.duration + '"></a></pre>';
                    msginfo += '<p class="voice_info">\
                                    <span class="voice_statue"><i class="fa fa-circle"></i></span>\
                                    <span class="voice_time">' + v.audioMessageBody.duration + '\"</span>\
                                </p>';

                } else if(v.contentType == Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_SENDQUESTION){//互动题

                    msginfo += '<pre style="white-space:pre-wrap" class="alert ' + msgCls + ' alert-activity">';
                    //如果有图片则显示，否则显示默认图片
                    var Question = v.sendQuestionMessageBody;
                    if(Question && Question.imgs){
                         msginfo += '<img src="'+ Question.imgs + '" class="img-circle" alt=""  />';
                    }else{
                         msginfo += '<img src="'+ app.path.img + '/media_icon/gold.png" class="img-circle" alt="互动题"  />';
                    }
                    msginfo += '<a class="activity_title" href="'+ Question.url +'/'+ app.usercode +'" target="_blank"><span class="">' + Question.title + '</span></a>';
                    msginfo += '</pre>';
                } else {//文本内容

                    var textMessage = v.textMessageBody.content;
                    // 替换特殊字符
                    //textMessage = app.contentReplace(textMessage);

                    // url地址转换为超链接
                    var reg = /((https?|ftp|file):\/\/[-a-zA-Z0-9+&@#\/%?=~_|!:,.;]*)/g;
                    textMessage = textMessage.replace(reg, '<a class="msg_links" href="$1" target="_blank">$1</a>')
                    .replace(/\n/g, '<br />')
                    .replace(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z]{2,6}$)/g,'<a class="msg_links" href="http://$1$3" target="_blank">$1$3</a>');

                    //emote 替换
                    var conreg = /\[e\](.*?)\[\/e\]/g;
                    textMessage = textMessage.replace(conreg, function(str, src) {
                        return '<img class="icon icon-emote" src="' + app.path.icon + '/' + src + '.png" alt="" />';
                    });

                    msginfo += '<pre style="white-space:pre-wrap" class="alert ' + msgCls + '">' + textMessage + '</pre>';
                }    
                msginfo +=     '</div>';

            }

            //如果是历史消息需要显示的内容保存到变量中,如果是历史消息的则不再重复保存到缓存变量中去
            if(tp != 'history'){
                 var MsgObject = {
                        'audioMessageBody':v.audioMessageBody || '',
                        'contentType':v.contentType || '',
                        'deviceSource':v.deviceSource || '',
                        'fromId':v.fromId || '',
                        'imageMessageBody':v.imageMessageBody || '',
                        'messageEvent':v.messageEvent || '',
                        'roomId':v.roomId || '',
                        'sendQuestionMessageBody':v.sendQuestionMessageBody || '',
                        'sendTime':v.sendTime || '',
                        'textMessageBody':v.textMessageBody || '',
                        'versionNumber':v.versionNumber || '',
                        'joinRoomInfos':v.joinRoomInfos || '',
                        'exitRoomInfos':v.exitRoomInfos || '',
                        'addGoldInfos':v.addGoldInfos || ''
                }
                app.roomidMsg[v.roomId].push(MsgObject);
                app.ls.set('app_roomidMsg', app.roomidMsg);
            }

            msginfo +=     '</div>';

            msginfo = msginfo.replace('&#0;', '');

            var newmsgages = $(msginfo);

            // 替换报名链接，后面追加用户加密串及家长会标示符
            var signup = newmsgages.find('a.msg_links');
            if(signup.length > 0){
                signup.each(function(){
                    var a = $(this), links = a.attr('href');
                    if(links.indexOf('xueersi.com/AxhSignup/detail/')>=0){
                        a.attr('href',links + '/'+app.userinfo.enstuId+'/1');
                    }
                });
            }
            
            if(!tp){//如果收到的新消息不是本群的不显示
              return false;
            }
            newmsgages.appendTo(app.box.messagelist);
           
           //消息爬楼层滚动条效果
           var scrollTop = (parseFloat($(app.box.messagelist).height()) -parseFloat($(app.box.messagewrap).scrollTop()))/parseFloat($(app.box.messagelist).height());
           if(scrollTop>1/4){
                return false;
           }else{
                app.setMessageScroll();
           }

     }; 

     /**获取服务器所有的房间**/
     socket.getRooms = function(messages){

            /**已经加入的房间数据**/
            $(app.box.roomlist).html('<li class="list-group-item list_group_loading"><i class="fa fa-spinner fa-spin"></i></li>');

            var AlreadyJionroom = messages.roomListsOfAlreadyJoin;
            var roomInfoOfTop = messages.roomInfoOfTop;//置顶群和已加入群都要显示
            var AlreadyJionroomList = [];
            $.each(AlreadyJionroom, function(k, v) {
                  AlreadyJionroomList.push(v);
            }) 
            if(roomInfoOfTop){
               AlreadyJionroomList.unshift(roomInfoOfTop);
            }
            var JionroomList = '';
            if(AlreadyJionroomList.length === 0){
                JionroomList = '<div class="emptyRoomList">暂无群聊房间</div>';
            }else{
                $.each(AlreadyJionroomList, function(k, v) {
                    //以变量形式存储已经加入的房间数据信息
                    app.roomlist[v.roomId] = v;
                    app.msglist[v.roomId] = [];
                    app.roomidMsg[v.roomId] = [];

                    JionroomList += '<li class="list-group-item media roomitem roomid_' + v.roomId + '" data-pic="' + v.roomIconUrl + '" data-roomid="' + v.roomId + '" data-admin="' + v.roomFirstAdministrator + '" data-member="' + v.roomMember + '" data-roomNotice ="' + v.roomNotice + '">';
                    JionroomList +=     '<div class="pull-right"><span class="badge room_newmsg" style="display:none;">0</span></div>';
                    JionroomList +=     '<div class="media-body">';
                    JionroomList +=         '<h5 class="media-heading"><span class="roomtitle">' + v.roomName + '</span><span class="members"> (' + v.roomPeopleNum + ') </span>';
                    JionroomList +=             '<span class="label label-default">0</span>';
                    JionroomList +=         '</h5>';
                    JionroomList +=     '</div>';
                    JionroomList += '</li>';
                });
                app.ls.set('roomlist', app.roomlist);
            }
            $(app.box.roomlist).html(JionroomList);
            //app.roomidMsg[125] = [];

            /**可加入的房间数据**/
            /*var CanJionroomList = messages.roomListsOfCanJion;
            var canroomList = '';
            if(CanJionroomList.length === 0){
                canroomList = '<div class="emptyRoomList">暂无可加入的房间</div>';
            }else{
                $.each(CanJionroomList, function(k, v) {
                    canroomList += '<li class="media group-item" data-roomid="' + v.roomId + '">';
                    canroomList +=          '<a class="media-left media-middle" href="javascript:void(0);"><img class="img-circle group-picture" src="'+v.roomIconUrl+'"></a>';
                    canroomList +=          '<div class="media-body group-body hidden-xs">';
                    canroomList +=             '<h4 class="media-heading group-title">'+v.roomName+'</h4>';
                    canroomList +=             '<p class="group-info">'+v.roomPeopleNum+'</p>';
                    canroomList +=         '</div>';
                    canroomList += '</li>';
                });
            }
            $('#roomlist_apply').html(canroomList);*/
     };
     
     /**会话消息**/
     socket.talk = function(e, type){
            var MessageType = new Protocol.Message.Message();
            MessageType.packageType = Protocol.Message.PackageType.PACKAGE_NORMAL;
            MessageType.messageType = Protocol.Message.MessageType.PACKAGE_MSG_GROUP;
            MessageType.messageEvent = Protocol.Message.MessageEvent.PACKAGE_MSG_ON_MESSAGE;//消息事件类型  默认登录
            MessageType.deviceSource = 'pc';
            MessageType.versionNumber = $.cookie('app_version');
            MessageType.sessionId = $.cookie('app_sessid');
            MessageType.roomId = app.roomid;
            MessageType.fromId = app.username;
            //判断消息内容媒体类型
            switch(type){
                  case Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_TEXT: //普通文本消息
                       MessageType.contentType = Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_TEXT;

                       var textMessage = new Protocol.Message.TextMessage();
                       textMessage.nickName = e.nickName;
                       textMessage.headImg = e.headImg;
                       textMessage.levelName = e.levelName;
                       textMessage.fromId = e.fromId;
                       textMessage.content = e.content;
                       MessageType.textMessageBody = textMessage; 
                  break;
                  case Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_PICTRUE: //图片消息
                       MessageType.contentType = Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_PICTRUE;
                       var ImageMessage = new Protocol.Message.ImageMessage();
                       ImageMessage.nickName = e.nickName;
                       ImageMessage.headImg = e.headImg;
                       ImageMessage.levelName = e.levelName;
                       ImageMessage.fromId = e.fromId;
                       ImageMessage.bigImageUrl = e.bigImageUrl;
                       ImageMessage.smallImageUrl = e.smallImageUrl;
                      
                      MessageType.imageMessageBody = ImageMessage;
                  break;
            }

            this.send(MessageType);
     };
      
     /**进入房间**/
     socket.checkInRoom = function(roomid) {
            /**
              * @description
              *
              * 进入房间的操作
              *  1. 判断属于本房间的消息
              *  2. 将属于本房间的所有消息数据放入一个数组对象中
              *  3. 处理本房间的消息总条数和要显示的信息条数
              *  4. 判断每条消息的内容消息类别
              *  5. 根据消息内容类别以及是否是本人的消息信息展示相应的位置
              *  6. 本房间是否有群公告信息
              *  7. 该用户在本群是否被禁言
              *  8. 本房间是否有群空间
              *  9. 本房间是否有统计(群管理员才能看到统计的群日报和周报)
            **/
            var This = this;
            var conbox = $(app.box.content);
            conbox.show();
            $(app.box.messagelist).empty();
            app.resize();
            setTimeout(app.setMessageScroll, 400);
            $('#content_message').show().siblings('.panel').hide();
            app.roomid = roomid;

            // 群公告显示：如果用户类型是1的则显示
            var roominfo = app.roomlist[roomid];
            if(roominfo.roomNotice && app.userinfo.type == 1){
                 app.noticeShow();
            }else{
                 app.noticeHide();
            }

            // 判断本房间禁言状态
            if(roominfo.speakstate === 1){
                 app.lockroom(roomid);
            }else{
                 app.unlockroom(roomid);
                 $(app.box.textarea).focus();
            }
            //群公告按钮
            if($('#btn_notices').length === 0){
                 $('#btn_history').after('<button id="btn_notices" type="button" class="btn btn-default btn-sm">群公告</button>');
            }

            //判断房间是否有群空间
            if(roominfo.roomSpaceId !=0 ){
                  if($('#btn_roomspace').length === 0){
                      $('#btn_notices').after('<button id="btn_roomspace" type="button" class="btn btn-default btn-sm">群空间</button>');
                  }
            }else{
                  $('#btn_roomspace').remove();
            }
            app.spaceid = roominfo.roomSpaceId;

            /**
            **判断房间是否有统计(群管理员才能看到统计的群日报和周报)**缺少isAdmin字段判断是否是群管理员，一个群可能有很多个管理员
            **/

            var Statistics = [
                              '<div class="bs-example pull-left" id = "btn_Statistics">',
                                    '<div class="dropdown clearfix">',
                                      '<button aria-expanded="true" data-toggle="dropdown" type="button" id="dropdownMenu3" class="btn btn-default btn-sm dropdown-toggle">统计<span class="caret"></span>',
                                      '</button>',
                                      '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu3">',
                                        '<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" id="btn_Daily">日报</a></li>',
                                        '<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" id="btn_Weekly">周报</a></li>',
                                      '</ul>',
                                    '</div>',
                              '</div>'
                            ]

            //检测用户是否是本群的管理员    
            $.ajax(app.url + '/WebRooms/checkIsAdmin', {
                    data: {
                        rid: roomid
                    },
                    success: function(d) {
                       if(d.sign != 1){
                         $('#btn_Statistics').remove();
                         return false;
                       }
                       if(roominfo.roomSpaceId ==0 && $('#btn_Statistics').length === 0){
                               $('#btn_notices').after(Statistics.join(''));
                       }else if (roominfo.roomSpaceId !=0 && $('#btn_Statistics').length === 0) {
                               $('#btn_roomspace').after(Statistics.join(''));
                       }
                    }
            });

            var msgLists = app.ls.get('app_roomidMsg');;
            var RoomMsgList = msgLists[roomid];

            //删除多余的历史消息 要显示的消息条数app.Msgnum
            if(RoomMsgList.length>app.Msgnum){
                  var deletenum = parseInt(RoomMsgList.length - app.Msgnum);
                  RoomMsgList.splice(0,deletenum);//筛选要显示的信息条数 00 为了测试数据
            }
            $.each(RoomMsgList, function(k, v) {
                  This.setMessage(v,'history');
            }) 
        }     
      
})(app.Websocket);

/**
 * 发送消息方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.sendMessage = function(tp) {
    if(app.roomlist[app.roomid].speakstate === 1){//禁言状态不能发送
        return false;
    }
    var con = $(app.box.textarea).val();
    if ($.trim(con) == '') {
        alert('请输入聊天内容');
        $(app.box.textarea).blur();
        return;
    }
    var nickname = app.userinfo.nickname;
    var headImg = app.userinfo.himg;
    var levelName = (app.userinfo.type == '2' || app.userinfo.type == '3') ? '老师' : app.userinfo.levelname;
    var infocont = {
               'nickName':nickname,
               'headImg':headImg,
               'levelName':levelName,
               'content':con
    }
    app.Websocket.talk(infocont,0);
    $(app.box.textarea).height(40).val('');
    //发送消息滚动条到底部
    app.setMessageScroll();
    setTimeout(function() {
        $(app.box.textarea).height(20);
    }, 1);
};

/**
 * 发送图片方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.sendPicture = function(d) {
    app.Websocket.talk(d,1);
    setTimeout(app.setMessageScroll, 200);
};

/**
 *图片上传方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.ajaxFileUpload = function() {
    if(app.roomlist[app.roomid].speakstate === 1){
        return false;
    }
    var btn_upload = $('#buttonUpload');
    btn_upload.button('loading');
    $(app.box.messagelist).append('<div class="msg-list msg-list-me msg_list_loading"><h4 class="color-success"><span class="label label-default color-success">我 :</span> <span class="label-time pull-right" data-time="' + xue.timer + '"></span></h4><pre class="alert alert-default"><i class="fa fa-spinner fa-spin"></i></pre></div>');
    app.setMessageScroll();
    var nickName = app.userinfo.nickname;
    var headImg = app.userinfo.himg;
    var levelName = (app.userinfo.type == '2' || app.userinfo.type == '3') ? '老师' : app.userinfo.levelname;
    $.ajaxFileUpload({
        url: app.url + '/Rooms/uploadMsgImg',
        secureuri: false,
        fileElementId: '#fileToUpload',
        dataType: 'json',
        data: {
            name: 'logan',
            id: 'id'
        },
        success: function(d) {
            var v = d.result;
            btn_upload.button('reset');
            if (v.status != 1) {
                alert(v.data);
                return;
            }
            var big = v.data.big,
                small = v.data.small;
            $('.msg_list_loading').remove();
            app.sendPicture({
                'nickName': nickName,
                'headImg': headImg,
                'levelName' : levelName,
                'bigImageUrl':big,
                'smallImageUrl':small
            });
        },
        error: function(data, status, e) {
            xue.log(arguments);
        }
    });

    return false;
};

/**
 *设置房间的新消息数方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.setRoomNewNumber = function(id) {

    var item = $(app.box.roomlist).find('.roomid_' + id);
    var box = item.find('.room_newmsg');
    var num = box.text();
    if (box.hasClass('new_tips')) {
        num = Number(num) + 1;
    } else {
        num = 1;
    }
    box.text(num).addClass('new_tips').show();
    // 将新消息群置顶
    if(!$.cookie('LockedRoom')){
      item.prependTo(app.box.roomlist);   
    }
    // 在title设置新消息数
    app.setAllNewNumber();
};

/**
 *获取房间全部新消息数方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getAllNewMessage = function() {
    var item = $(app.box.roomlist).find('.new_tips'),
        n = 0;
    item.each(function() {
        var that = $(this),
            num = that.text();
        num = Number(num);
        if (num > 0) {
            n = n + num;
        }
    });

    return n;
};

/**
 *在title设置新消息数方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.setAllNewNumber = function() {
    var allnum = app.getAllNewMessage();
    allnum = allnum > 99 ? '99+' : allnum;
    if (allnum > 0) {
        $('title').html('家长会网页版 (' + allnum + ')');
    } else {
        $('title').html('家长会网页版');
    }
};

/**
 *我收到的加群申请的总数方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getApplyNum = function() {
    $.ajax(app.url + '/WebRooms/getApplyNum', {
        data: null,
        success: function(v) {
            var items = $('#sidebar .apply_num');

            if (v.sign != 1) {
                $('.btn_apply_num').hide();
                items.hide();
                // alert(v.data);
                return;
            }
            $('.btn_apply_num').show();
            if (v.data > 0) {
                items.addClass('new_tips');
                items.show().text(v.data);
            } else {
                items.removeClass('new_tips').hide();
                // items.removeClass('new_tips');
            }
        }
    });
};

/**
 *表情图标方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.emote.getHtml = function() {

    var emote_url = '/static/img/emote/',
        emote_tpl = '<ul class="list-inline emote_list">';

    $.each(app.emote.data, function(k, v) {
        emote_tpl += '<li class="emote_item" data-key="' + v + '"><img src="' + app.path.icon + '/' + v + '.png" alt="" /></li>';
    });
    emote_tpl += '</ul>';
    return emote_tpl;
};

/**
 *设置容器尺寸方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.resize = function() {
    var panel = $('#content > .panel'),
        body = panel.find('.panel_content:visible'),
        head = body.closest('.panel').find('.panel-heading'),//解决点击群空间成员等头部高度总是为导致容器高度计算错误问题，开始是head = panel.find('.panel-heading')
        foot = panel.find('.panel-footer');
        
    body.height(panel.height() - head.outerHeight() - foot.outerHeight() - 30);

    var sidebox = $('#sidebar > .panel');
    var side = {
        head: sidebox.find('.panel-heading'),
        body: sidebox.find('#roomlist'),
        foot: sidebox.find('#content_footer')
    };

    side.body.height(sidebox.height() - side.head.outerHeight() - side.foot.outerHeight() - 40);

};

/**
 *接收的时候转义回来方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.contentReplace = function(con){
    if(!con){
        return false;
    }
    var str = con.replace(/\*_0_\#/g, '&');
    str = str.replace(/\*_1_#/g, '&lt;');
    str = str.replace(/\*_2_#/g, '&gt;');
    str = str.replace(/\*_3_#/g, '"');
    str = str.replace(/\*_4_#/g, '\'');
    return str;
};

/**
 *发送消息、接收消息滚动条到底部方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.setMessageScroll = function() {

    setTimeout(function(){
           $(app.box.messagewrap).scrollTop($(app.box.messagelist).height());
    }, 200);

};

/**
 *设置加群数方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.setJoinNumber = function(num) {

    var n = num || 1;
    var items = $('#sidebar .apply_num');
    items.each(function() {
        var txt = $(this).text();
        txt = Number(txt) + 1;
    $(this).removeAttr('style').text(txt);
    });

};


/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[ 群管理部分 ]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */


/**
 *获取群成员列表方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getRoomUsers = function(user, current) {

    var username = user ? user : '';
    $.ajax(app.url + '/WebRooms/getRoomUsers', {
        // $.ajax('/data/roomusers.json', {
        data: {
            rid: app.roomid, //群ID
            name: username || '', //检索账号
            curpage: current || 1, //当前页
            rows: 5500 //每页显示条数
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                $('.input_search_user').val('');
                return;
            }
            var tpl = '',
                userlist = [];
            $.each(v.data, function(userid, userinfo) {
                var info = userinfo;
                var isban = info.ban == 1 ? 'active' : '';
                var tpCls = '',
                    tpName = '用户';
                if (info.admin == 1) {
                    tpCls = 'text-danger';
                    tpName = '群主';
                } else {
                    tpCls = info.type == '2' ? 'text-warning' : (info.type == '3' ? 'text-success' : '');
                    tpName = info.type == '2' ? '学科' : (info.type == '3' ? '老师' : '用户');
                }
                var btnTpl = '        <div class="btn-group btn-group-sm">';

                // 如果登录用户是管理员，且循环中的这个用户不是管理员时，则显示功能按钮
                // if ((v.isAdmin == 1) && info.type && (info.type == 1) && info.admin == 0) {
                if ((v.isAdmin == 1) && info.admin == 0) {
                    if(app.usertype != '3'){
                        btnTpl += '            <button type="button" class="btn btn-default btn_kick" data-loading-text="Loading...">移出</button>';
                    }
                    if (info.ban == 1) {
                        btnTpl += '            <button type="button" class="btn btn-warning btn_unban" data-loading-text="Loading...">解禁</button>';
                    } else {
                        btnTpl += '            <button type="button" class="btn btn-default btn_ban" data-loading-text="Loading...">禁言</button>';
                    }
                }
                btnTpl += '        </div>';

                var d = {
                    'DT_RowId': 'row_' + userid,
                    'DT_RowClass': 'roomuser_item useritem ' + isban,
                    '0': '<a href="javascript:void(0);">' + userid + '</a>',
                    '1': info.nickname || '',
                    '2': info.gradename || '',
                   
                    // 调整之后 2015-2-10 已完成，但是测试不让上：

                    '3': (info.areaname || '')+(info.cityname || ''),
                    '4': info.lastLoginTime || '',
                    '5': btnTpl,
                    '6': '<a href="javascript:void(0);" class="btn_viewuser ' + tpCls + '" title="查看' + tpName + '资料"><i class="fa fa-info-circle fa-1"></i><span class="sr-only">' + tpName + '</span></a>'
                };

                if (userid && userid.indexOf('<') < 0) {
                    userlist.push(d);
                }
            });
            tpl += '<div class="panel-heading">';
            tpl += '    <div class="btn-group pull-left"><button type="button" class="btn btn-default btn-sm btn_goback">返回</button></div>';
            if (v.isAdmin == 1 && app.usertype != '3') {
                tpl += '    <div class="btn-group pull-right"><button type="button" class="btn btn-default btn-sm btn_adduser">添加群成员</button></div>';
            }
            tpl += '    <h5 class="text-center">[' + app.roomname + '] 的群成员</h5>';
            tpl += '</div>';

            tpl += '<div class="panel-body users_form panel_content">';
            tpl += '<table id="roomuser_items" class="table table-hover users_items userlist">';
            tpl += '</table>';
            tpl += '</div>';

            $('#content_message').hide();
            if ($('#groupUsers').length === 0) {
                $(app.box.content).append('<div id="groupUsers" class="panel panel-default h600 panel_list"></div>');
            }
            var box = $('#groupUsers');
            box.html(tpl).show().siblings('.panel_list').hide();
            $('#roomuser_items').dataTable({
                'bRetrieve': true,
                'bDestroy': true,
                'bAutoWidth': false, // 禁止计算宽度
                'iDisplayLength': 10, // 每页显示数

                'bLengthChange': false, // 禁用选择每页显示数
                'sPaginationType': 'bootstrap',

                'aoColumns': [{
                    'sTitle': '用户账号',
                    'sClass': 'btn_viewuser text-left'
                }, {
                    'sTitle': '家长会昵称',
                    'sClass': 'btn_viewuser text-left'
                }, {
                    'sTitle': '年级',
                    'sClass': 'btn_viewuser text-left'
                }, {
                    'sTitle': '城市',
                    'sClass': 'btn_viewuser text-left'
                 },{
                     'sTitle': '最后登录时间',
                     'sClass': 'btn_viewuser text-left'
                }, {
                    'sTitle': '操作',
                    'sClass': 'text-left'
                }, {
                    'sTitle': ''
                }],
                'aaData': userlist
            });
            app.resize();
            $('.input_search_user').val('');
        }
    });
};


 /**
 *群公告：弹出添加群公告弹出层方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getNotice = function(){
    var id = app.roomid;
    var info = app.roomlist[id];
    var n = info.roomNotice.replace(/\n/g, '<br>');

    var tpl = '<div class="panel" id="win_roomNotice">\
                    <div class="panel-heading">\
                        <a class="toolbar_btn pull-right" href="javascript:app.win.close();"><i class="fa fa-times-circle"></i></a>\
                    </div>\
                    <div class="panel-body">\
                        <h5>群公告</h5>\
                        <div class="content">\
                            <form role="form">\
                                <div class="form-group"><textarea class="form-control" rows="4" cols="30" id="room_notice_val" name="editRoomNotice" data-type="notice"></textarea></div>\
                                <div class="form-group">\
                                      <button type="button" class="btn btn-primary btn_notice_submit">添加</button>\
                                  </div>\
                            </from>\
                        </div>\
                    </div>\
               </div>';
    $.fancybox({
        prevEffect: 'none',
        nextEffect: 'none',
        width: 730,
        height: 'auto',
        content: tpl,
        closeBtn: false,
        autoSize: false,
        scrolling: 'visible',
        padding: 0,
        helpers: {}
    });
};

/**
 *群公告：添加群公告层方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.addNotice = function(val){
    var rid = app.roomid;
    var con = val || $('#room_notice_val').val();
    $.ajax(app.url + '/WebRooms/editRoomNotice', {
        data : {
            rid : rid,
            notice : con
        },
        success : function(v){
            if (v.sign != 1) {
                alert(v.data);
                return;
            }
            app.roomlist[rid].notice = con;
            app.getNoticeList();
            $.fancybox.close();
        }
    });
};

/**
 *群公告列表方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getNoticeList = function(tp, current) {
    $.ajax(app.url + '/Rooms/getRoomNotice', {
        data: {
            rid: app.roomid, //房间号
            type: 1 //类型（1：网页版；2：移动版）
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                return;
            }
            var tpl = '';
            tpl += '<div class="panel-heading"><div class="btn-group pull-left"><button id="btn_closeroom" type="button" class="btn btn-default btn-sm btn_notice_add">添加群公告</button></div><div class="btn-group pull-right"><button class="btn btn-default btn-sm btn_goback" type="button">返回</button></div><h5 class="text-center">群公告</h5></div>';
            tpl += '<div class="panel-body panel_content">';
            if(v.data.length === 0){
                tpl += '<div class="center-block">暂无公告 <a href="javascript:void(0);" class="btn_notice_add">(添加)</a></div>';
            }else{
                tpl += '<table class="table table-hover users_items userlist">';
                tpl += '<col width="140">';
                tpl += '<thead><tr><td>公告发布日期</td><td>内容</td></tr></thead>';
                tpl += '<tbody>';

                $.each(v.data, function(k, val) {
                    tpl += '    <td class="">' + val.time + '</td>';
                    tpl += '    <td class="text-left">' + val.notice + '</td>';
                    tpl += '</tr>';
                });
                tpl = tpl.replace(/undefined/g, ' -- ');
                tpl += '</tbody>';
                tpl += '</table>';
            }
            tpl += '</div>';

            $(app.box.content).show();
            if ($('#noticeList').length === 0) {
                $(app.box.content).append('<div id="noticeList" class="panel panel-default h600 panel_list"></div>');
            }
            var box = $('#noticeList');
            box.html(tpl).show().siblings('.panel').hide();
            var panel = $('#noticeList'),
                head = panel.find('.panel-heading'),
                body = panel.find('.panel_content:visible'),
                foot = panel.find('.panel-footer');
                xue.log(panel.height());

            body.height(panel.height() - 42);
        }
    });
};

/**
 *群公告显示方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.noticeShow = function(roomnoticeMsg){

    var roomnotice;
    if(roomnoticeMsg){
       roomnotice = roomnoticeMsg;  
    }else{
       roomnotice = app.roomlist[app.roomid]['roomNotice']; 
    }
    roomnotice = roomnotice.replace(/\n/g, '<br />');
    if($('.room_notice').length === 0){
        $('#message_box').before('<div class="room_notice alert alert-warning" style="display:none"></div>');
    }
    if(roomnotice){
        $('#content_message .room_notice').html('<button type="button" class="close pull-right btn_notice_close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' + roomnotice).show();
    }else{
        $('#content_message .room_notice').html('').hide();
    }

};

/**
 *群公告隐藏方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.noticeHide = function(){
    $('#content_message .room_notice').remove();
};

/**
 *添加群成员方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.addRoomUser = function(users) {
    $.ajax(app.url + '/WebRooms/addRoomUser', {
        data: {
            usernames: users, //添加的用户账号:可以是逗号分隔的数组字符串
            rid: app.roomid //添加的群ID
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);

                // return;
            }
            app.getRoomUsers();
        }
    });
};


/**
 *移出群方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.kickUser = function(user, con) {
    $.ajax(app.url + '/WebRooms/kickRoom', {
        data: {
            username: user, //用户账号
            rid: app.roomid, //群ID
            reason: con
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                // return;
            }
            app.getRoomUsers();
        }
    });
};


/**
 *编辑个人信息方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.editUserInfo = function() {
    var tpl = '<div class="panel-heading"><div class="btn-group pull-left"></div><div class="btn-group pull-right"><button id="btn_closeroom" type="button" class="btn btn-default btn-sm btn_close">关闭</button></div><h5 class="text-center">我的个人简介</h5></div>';
    tpl += '   <div class="panel-body usersinfo_form panel_content">';
    tpl += '        <form class="form" role="form" action="javascript:void(0);">';
    tpl += '            <div class="form-group">';
    tpl += '            <p class="help-block">在这里输入您的个人介绍（最多300字）</p>';
    tpl += '            <textarea name="" id="userinfo_val" cols="30" rows="10" class="form-control">' + (app.userinfo.abstract || '') + '</textarea>';
    tpl += '            </div>';
    tpl += '            <div class="form-group"><button id="userinfo_submit" class="btn btn-default">确定</button></div>';
    tpl += '        </form>';
    tpl += '   </div>';
    $(app.box.content).show();
    if ($('#editUserInfo').length === 0) {
        $(app.box.content).append('<div id="editUserInfo" class="panel panel-default h600"></div>');
    }
    var box = $('#editUserInfo');
    box.html(tpl).show().siblings('.panel').hide();
    app.resize();

};
app.setUserInfo = function(val) {
    var con = $('#userinfo_val');
    if (con.val().length > 300 || con.val().length <= 0) {
        return;
    }
    $.ajax(app.url + '/WebRooms/editAbstract', {
        data: {
            abstract: val || con.val()
        },
        success: function(result) {
            var d = result;
            if (d.sign == 1) {
                alert('修改成功');
                app.userinfo = d.data;
            } else {
                alert(d.data);
            }
        }
    });
};

/**
 *我收到的加群申请用户列表
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getApplyList = function(tp, current) {
    $.ajax(app.url + '/WebRooms/getApplyList', {
        data: {
            curpage: current || 1, //当前页
            rows: 10, //每页显示条数
            status: tp || 0 //状态（1:待审核 2:已通过 3:已拒绝）
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                // $('.apply_type').val(0).hide();
                return;
            }
            // return;
            var tpl = '';
            tpl += '<div class="panel-heading"><div class="btn-group pull-left"></div><div class="btn-group pull-right"><button id="btn_closeroom" type="button" class="btn btn-default btn-sm btn_close">关闭</button></div><h5 class="text-center">加群申请审批</h5></div>';

            tpl += '<div class="panel-body users_form panel_content">';
            tpl += '    <form class="form-inline" role="form" action="javascript:void(0);">';
            tpl += '        <div class="col-sm-4"></div>';
            tpl += '        <div class="form-group col-sm-4">';
            tpl += '            <div class="input-group">';
            tpl += '                <span class="input-group-addon">状态</span> ';
            // tpl += '                <select name="apply_type" class="form-control apply_type" autocomplete="off">';
            tpl += '                <select name="apply_type" class="form-control apply_type" autocomplete="off">';
            tpl += '                    <option value="0">全部</option>';
            tpl += '                    <option value="1">待审核</option>';
            tpl += '                    <option value="2">已通过</option>';
            tpl += '                    <option value="3">已拒绝</option>';
            tpl += '                </select>';
            tpl += '                <span class="input-group-btn"><button type="button" class="btn btn-default btn_search_apply" data-loading-text="Loading...">筛选</button></span>';
            tpl += '            </div>';
            tpl += '        </div>';
            tpl += '        <div class="col-sm-4"></div>';
            tpl += '    </form>';
            // tpl += '</div>';
            // tpl += '<div class="panel-body users_items panel_content">';
            tpl += '<table class="table table-hover users_items userlist">';
            // tpl += '<col width="134px" /><col width="132px" /><col width="122px" /><col width="141px" /><col width="177px" />';
            tpl += '<thead><tr><td>登录账号</td><td>时间</td><td>申请群</td><td>验证信息</td><td>操作</td><td></td></tr></thead>';
            tpl += '<tbody>';

            $.each(v.data, function(userid, userinfo) {
                var info = userinfo;
                var isban = info.ban == 1 ? 'active' : '';
                tpl += '<tr id="row_' + info.username + '" class="roomuser_item useritem" ' + isban + ' data-name="' + info.username + '" data-id="' + info.username + '" data-rid="' + info.rid + '" data-type="' + info.type + '">';
                tpl += '    <th class="btn_viewuser"><a href="javascript:void(0);">' + info.username + '</a></th>';
                tpl += '    <td class="btn_viewuser">' + info.create_time + '</td>';
                tpl += '    <td class="btn_viewuser">' + info.room_name + '</td>';
                tpl += '    <td>' + info.apply_info + '</td>';
                tpl += '    <td class="text-left">';
                tpl += '        <div class="btn-group btn-group-sm input-group">';

                // tpl += '            <button type="button" class="btn btn-default btn_viewuser" data-type="apply_user">查看</button>';
                // 如果登录用户是管理员，且循环中的这个用户不是管理员时，则显示功能按钮
                if (info.status == 2) { // 通过
                    // tpl += '<span class="input-group-addon"> 已通过（'+ info.check +'）</span>';
                    tpl += '已通过（' + info.check + '）';
                } else if (info.status == 3) { // 拒绝
                    // tpl += '<span class="input-group-addon"> 已拒绝（'+ info.check +'）</span>';
                    tpl += '已拒绝（' + info.check + '）';
                } else {
                    tpl += '            <button type="button" class="btn btn-default btn_through" data-loading-text="Loading...">通过</button>';
                    tpl += '            <button type="button" class="btn btn-default btn_refuse" data-loading-text="Loading...">拒绝</button>';
                }
                tpl += '        </div>';
                tpl += '    </td>';
                tpl += '    <td><a href="javascript:void(0);" class="btn_viewuser" data-type="apply_user" title="查看用户资料"><i class="fa fa-info-circle fa-1"></i></a></td>';
                tpl += '</tr>';
            });
            tpl = tpl.replace(/undefined/g, ' -- ');
            tpl += '</tbody>';
            // tpl += '<tfoot><tr><td colspan=5 class="userlist_page center-block"> 1 2 3 4 5 </td></tr></tfoot>';
            tpl += '</table>';
            tpl += '    <div class="ui_pages"></div>';
            tpl += '</div>';

            // 分页部分
            // tpl += '<div class="panel-footer con_footer">';

            // tpl += '</div>';

            $(app.box.content).show();
            // $('#content_message').hide();
            if ($('#applyUsers').length === 0) {
                $(app.box.content).append('<div id="applyUsers" class="panel panel-default h600 panel_list"></div>');
            }
            var box = $('#applyUsers');
            box.html(tpl).show().siblings('.panel').hide();
            // box.css('z-index', 1).siblings('.panel').css('z-index', 'auto');
            app.pages({
                total: v.rows,
                page: current || 1,
                handle: function(cur) {
                    app.getApplyList(tp, cur);
                }
            });
            app.resize();
            if(tp){
                $('#applyUsers .apply_type').val(tp);
            }

        }
    });
};

/**
 *通过申请列表方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.throughApply = function(user, rid) {
    var vtp = $('#applyUsers .apply_type').val();
    var item = $('#applyUsers .roomuser_item');
    vtp = item.length > 1 ? vtp : 0;
    $.ajax(app.url + '/WebRooms/throughApply', {
        data: {
            username: user, //申请人账号
            rid: rid //申请加入群ID
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                return;
            }
            app.getApplyList(vtp);
        }
    });
};

/**
 *拒绝用户的加群申请方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.refuseApply = function(user, rid, content) {
    var vtp = $('#applyUsers .apply_type').val();
    var item = $('#applyUsers .roomuser_item');
    vtp = item.length > 1 ? vtp : 0;
    $.ajax(app.url + '/WebRooms/refuseApply', {
        data: {
            username: user, //申请人账号
            rid: rid, //申请加入群ID
            reason: content //拒绝原因
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                return;
            }
            app.getApplyList(vtp);
        }
    });
};


/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[ 群管理部分 ]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/**
 *移出群方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.PhotokickUser = function(user, con) {
    $.ajax(app.url + '/WebRooms/kickRoom', {
        data: {
            username: user, //用户账号
            rid: app.roomid, //群ID
            reason: con
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
            }else{
                $('.Photo_btn_kick,.Photo_btn_ban,.user_gold_item').remove();
                $('.userstate').text('(此用户已不在该群)');
            }
        }
    });
};

/**
 *禁言方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.PhotobanUser = function(user,nickname,day) {
    $.ajax(app.url + '/WebRooms/banUser', {
        data: {
            username: user, //申请人账号
            rid: app.roomid, //申请加入群ID
            days: day //禁言天数 1 or 7 or 永久
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
            }else{
                $('.Photo_btn_ban').removeClass('btn-default').addClass('btn-warning').removeClass('Photo_btn_ban').addClass('Photo_btn_unban').text('解禁');
                $('#banSelectDateBg').hide();
               /***点击禁言时提示在输入框提示已经被禁言效果**/
                var textarea = $(app.box.textarea),
                    textarea_val = textarea.val(),
                    pos = getCursortPosition(textarea[0]),
                    banUserval = nickname+'已经被禁言';
                if (textarea_val.indexOf(banUserval) >= 0) {
                    textarea.focus();
                    return;
                }
                textarea.focus();
                var val = textarea_val.substring(0, pos) + banUserval + ' ' + textarea_val.substring(pos);
                $(app.box.textarea).val(val);
                textarea.focus();
            }

        }
    });
};

/**
 *解禁方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.PhotounbanUser = function(user) {
    $.ajax(app.url + '/WebRooms/unbanUser', {
        data: {
            username: user, //申请人账号
            rid: app.roomid //申请加入群ID
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
            }else{
                $('.Photo_btn_unban').removeClass('btn-warning').addClass('btn-default').removeClass('Photo_btn_unban').addClass('Photo_btn_ban').text('禁言');
            }
        }
    });
};


/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[群成员部分 ]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */


/**
 *选择禁言日期弹出层方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.banUserDate= function(datainfo,userAccounts,nickname) {
    var tpl = '<div class="panel  panel-default">';
        tpl += '<div class="panel-heading"><h2>选择禁言时长</h2></div>';
        tpl += '<div class="panel-body">';
        tpl +=      '<form role="form" class="form-horizontal banUser_SelectDate" id="'+datainfo+'">';
        tpl +=          '<div class="form-group">';
        tpl +=              '<span class="col-sm-2 control-label">昵称：</span>';
        tpl +=              '<div class="col-sm-10"><p class="form-control-static">'+nickname+'</p></div>';
        tpl +=          '</div>';
        tpl +=          '<div class="form-group">';
        tpl +=              '<span class="col-sm-2 control-label">账号：</span>';
        tpl +=              '<div class="col-sm-10"><p class="form-control-static">'+userAccounts+'</p></div>';
        tpl +=          '</div>';
        tpl +=          '<div class="form-group">';
        tpl +=              '<span class="col-sm-2 control-label">周期：</span>';
        tpl +=              '<div class="col-sm-10">';
        tpl +=                  '<label class="radio-inline"><input type="radio" class="SelectDate" name="banUser_SelectDate"  value="1天">1天</label>';
        tpl +=                  '<label class="radio-inline"><input type="radio" class="SelectDate" name="banUser_SelectDate"  value="7天">7天</label>';
        tpl +=                  '<label class="radio-inline"><input type="radio" class="SelectDate" name="banUser_SelectDate"  value="永久">永久</label>';
        tpl +=              '</div>';
        tpl +=          '</div>';
        tpl +=          '<div class="form-group text-center">';
        tpl +=              '<button type="button" class="btn btn-primary btn_banDate" style="margin-right:10px">&nbsp;&nbsp;确定&nbsp;&nbsp;</button>';
        tpl +=              '<button type="button" class="btn btn-default" onclick="javascript:app.win.close();">&nbsp;&nbsp;关闭&nbsp;&nbsp;</button>';
        tpl +=          '</div>';
        tpl +=      '</form>';
        tpl += '</div>';
        tpl += '</div>';
        $.fancybox({
            prevEffect: 'none',
            nextEffect: 'none',
            width: 730,
            height: 'auto',
            content: tpl,
            closeBtn: false,
            autoSize: false,
            scrolling: 'visible',
            padding: 0,
            helpers: {}
        });
};

/**
 *禁言方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.banUser = function(user,day) {
    $.ajax(app.url + '/WebRooms/banUser', {
        data: {
            username: user, //申请人账号
            rid: app.roomid, //申请加入群ID
            days: day //禁言天数 1 or 7 or 永久
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                // return;
            }
            app.getRoomUsers();
        }
    });
};

/**
 *解禁方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.unbanUser = function(user) {
    $.ajax(app.url + '/WebRooms/unbanUser', {
        data: {
            username: user, //申请人账号
            rid: app.roomid //申请加入群ID
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                // return;
            }
            app.getRoomUsers();
        }
    });
};

/**
 *查看用户资料方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getUserInfo = function(user, rid, msgusername, tableclick, tp) {
    $.ajax(app.url + '/WebRooms/seeUserInfo', {
        data: {
            username: user, //申请人账号
            rid: rid || app.roomid //申请加入群ID
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
                return;
            }
            var d = v.data;
            var tpl = '';
            /**
             * 增加用户管理功能
             * @typ
             e {string}
             */
            var btnGroup = '', kickText = '', BtnselectDate = '';
            if (tableclick <= 0) {
               btnGroup = '', kickText = '', BtnselectDate = '';
            }else{
               if ((app.usertype == 2 || app.usertype == 3) && v.role !== 1 && v.controller ==1) {

                    if (v.isRoomUser != 1) {
                        btnGroup = '';
                        BtnselectDate = '';
                        kickText = '(此用户已不在该群)';
                    } else {

                        if (d.speakstate) {
                            btnGroup = '<a type="button" href="javascript:void(0);" class="btn btn-warning btn-xs btn_unban Photo_btn_unban pull-right" data-loading-text="Loading...">解禁</a>';
                        } else {
                            btnGroup = '<a type="button" href="javascript:void(0);" class="btn btn-default btn-xs btn_ban Photo_btn_ban pull-right" data-loading-text="Loading...">禁言</a>';
                            
                        }
                        if(app.usertype == 2){
                            btnGroup += '<a type="button" class="btn btn-default btn-xs btn_kick Photo_btn_kick pull-right" data-loading-text="Loading...">移出</a>';
                        }
                        BtnselectDate = '<div class="btn-group pull-right banSelectDateBg" id="banSelectDateBg" style="display:none">';
                        BtnselectDate +=    '<span class="pull-left banSelectDateTOp">请选择禁言时长：</span>';
                        BtnselectDate +=    '<button class="btn btn-default btn-sm btn_selectdate" type="button">1天</button>';
                        BtnselectDate +=    '<button class="btn btn-default btn-sm btn_selectdate" type="button">7天</button>';
                        BtnselectDate +=    '<button class="btn btn-default btn-sm btn_selectdate" type="button">永久</button>';
                        BtnselectDate += '</div>';
                        kickText = '';
                    }
                }
            }


            tpl += '<div class="panel panel-default userinfo_dialog Photoroomuser_item" data-userid="' + user + '" data-roomid="' + (rid || app.roomid) + '" data-nickname="' + msgusername + '" style="margin-bottom:0;min-height:240px;">';
            tpl += '    <div class="panel-heading"><p class="btn-group pull-right"><a href="javascript:app.win.close();" class="btn btn-default btn-xs pull-right">关闭</a>'+ btnGroup + '</p> 用户详细资料<span clas="userstate">'+ kickText +'</span>'+BtnselectDate+'</div>';
            tpl += '    <div class="panel-body">';
            tpl += '       <div class="row-fluid">';
            tpl += '          <div class="pull-left Useravatar_area">';
            if (d.himgbig) {
                tpl += '         <a href="' + d.himgbig + '" target="_blank"><img class="img-rounded img-thumbnail" data-url="' + d.himgbig + '" alt="" src="' + d.himgbig + '"></a>';
            }else{
                 tpl += '         <a href="' + app.path.img + '/defult_head_img.png" target="_blank"><img class="img-rounded img-thumbnail" data-url="' + app.path.img + '/defult_head_img.png" alt="" src="' + app.path.img + '/defult_head_img.png"></a>';
            }
            tpl += '        </div>';
            tpl += '        <div class="User_InfoTable">';
            tpl += '           <table class="table table-bordered">';
            tpl += '              <tbody>';
            tpl += '                 <tr>';
            tpl += '                    <th>家长会昵称</th>';
            tpl += '                    <td>' + d.nickname + '</td>';
            tpl += '                    <th>类别</th>';
            tpl += '                    <td>' + (d.type == 2 ? '学科' : (d.type == 3 ? '老师' : '用户')) + '</td>';
            tpl += '                 </tr>';
            tpl += '                 <tr>';
            tpl += '                    <th>账号</th>';
            tpl += '                    <td>' + user + '</td>';
            tpl += '                    <th>等级</th>';
            tpl += '                    <td>' + d.stulevel + ' (' + d.levelname + ')</td>';
            tpl += '                 </tr>';
            tpl += '                 <tr>';
            tpl += '                    <th>当前年级</th>';
            tpl += '                    <td>' + d.gradename + '</td>';
            tpl += '                    <th>最后登录时间</th>';
            tpl += '                    <td>' + (d.lastLoginTime || '') + '</td>';
            tpl += '                 </tr>';
            tpl += '                 <tr>';
            tpl += '                    <th>地区</th>';
            tpl += '                    <td>' + d.areaname + '' + d.cityname + '</td>';
            if ((v.courseInfo.length!=0 && v.courseInfo) || $.cookie('app_usertype') == 2) {
                tpl += '                <th>电话</th>';
                tpl += '                <td>' + d.mobile + '</td>';
             }else{
                tpl += '                <th></th>';
                tpl += '                <td></td>';
             }
            tpl += '                 </tr>';
            tpl += '              </tbody>';
            tpl += '           </table>';
            tpl += '        </div>';
            tpl += '    </div>';
            // 发金币
            if((v.goldType == 1 || v.goldType == 2) && !rid && v.isRoomUser == 1){
                tpl += '            <div class="user_gold_item" style="padding:10px 0">';
                tpl += '                    <div class="user_gold">';
                tpl += '                        <div class="input-group col-sm-3">\
                                                    <input class="form-control input-sm add_gold_val" min="1" max="30" >\
                                                    <span class="input-group-btn">\
                                                    <button class="btn btn-sm btn-default add_gold_btn" type="button">发金币</button>\
                                                    </span>\
                                                </div><!-- /input-group -->';
                tpl += '                        ';
                tpl += '                        ';
                if(v.goldNum.length > 0){
                    tpl += '                        <span class="text-muted add_gold_tips">老师的金币账户剩余：<em class="gold_balance">'+ v.goldNum +'</em></span>';
                }
                tpl += '                        <span class="text-danger add_error_tips"></span>';
                tpl += '                    </div>';
                tpl += '                ';
                tpl += '            </div>';
            }
            if (v.courseInfo.length!=0 && v.courseInfo) {
                tpl += '<div class="row-fluid" id="CurriculumTable">';
                tpl += '</div>';
            }
            if (app.usertype == 2) {
                tpl += '<div class="row-fluid pull-left Belonginggroup">';
                tpl += '   <p><span>所属群：</span>' + d.joinRoom + '</p>';
                tpl += '</div>';
            }

            tpl += ' </div>';
            tpl += '</div>';

            $.fancybox({
                prevEffect: 'none',
                nextEffect: 'none',
                width: 730,
                height: 'auto',
                content: tpl,
                closeBtn: false,
                autoSize: false,
                scrolling: 'visible',
                padding: 0,
                helpers: {
                    overlay: {
                        css: {
                            // 'background' : 'rgba(58, 42, 45, 0)'
                        }
                    }
                }
                // helpers     : {
                //     title   : { type : 'inside' },
                //     buttons : {}
                // }
            });

            var LessonList = [];
            var vcourseInfo = v.courseInfo;
            //遍历资料数据
            $.each(vcourseInfo , function(coursenum,courseinfo){
                var info = courseinfo;
                //dataTable实例模板
                var d = {
                    //'DT_RowId': 'row_' + info.id,  //横向id
                    'DT_RowClass': 'course_item courseitems', //横向class
                    '0': info.course_id || '',  //ID
                    '1': info.course_name || '',//在读课程名
                    '2': (info.study_count || '0')+'/'+(info.section_count || '0'),//听课进度（讲）
                    '3': info.start_time || '', //开始时间
                    '4': info.end_time || '' //结束时间
                };
                LessonList.push(d);
            });
            //dataTable插入表格
            // console.log(spaceList)
            $('#CurriculumTable').html('').append('<table class="table table-hover users_items userlist"></table>');
            $('#CurriculumTable table').dataTable({
                'bRetrieve': true,
                'bDestroy': true,
                'bSort':false,
                'bAutoWidth': false, // 禁止计算宽度
                //'iDisplayLength': 10, // 每页显示数
                'bInfo': false,  // 隐藏页数信息
                'bFilter': false,  //搜索框
                'bPaginate': false,  //取消分页器
                'bLengthChange': false, // 禁用选择每页显示数
                // 'bServerSide': false,
                // 'bProcessing': true,
                'sPaginationType': 'bootstrap',

                // "sDom": '<"bottom"p>',
                // "sDom": "<'dt-top-row'><'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
                'aoColumns': [{
                    'sTitle': 'ID',
                    'sClass': 'btn_viewuser text-left'
                },{
                    'sTitle': '在读课程名',
                    'sClass': 'btn_viewuser text-left'
                },{
                    'sTitle': '听课进度（节）',
                    'sClass': 'btn_viewuser text-left'
                }, {
                    'sTitle': '开始时间',
                    'sClass': 'btn_viewuser text-left'
                }, {
                    'sTitle': '结束时间',
                    'sClass': 'btn_viewuser text-left'
                }],
                'aaData': LessonList
            });
        }
    });
};

/**
 *返回历史消息方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getHistory = function(rid) {
    var roomid = rid || app.roomid;
    $.cookie('app_roomid', roomid);
    $.cookie('app_roomname', app.roomname);
    window.open(app.url + '/history.html', 'history');
    return;
};

/**
 *加经验方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.addExpByAdmin = function(uid, rid, num) {
    var userdata = $('.userinfo_dialog:visible');

    var expdata = {
        expval: num || $('.add_exp_val:visible').val(),
        expuser: uid || userdata.data('userid'),
        exproom: rid || app.roomid
    };
    $.ajax(app.url + '/WebRooms/addExpByAdmin', {
        data: {
            username: expdata.expuser,
            expnum: expdata.expval,
            rid: expdata.exproom
        },
        success: function(result) {
            // xue.log(result);
            var d = result,
                cls = 'text-muted',
                txt = '经验获得不易，请尽量少发',
                tips = $('.add_exp_tips:visible');
            if (d.sign == 1) {
                cls = 'color-success';
            } else {
                cls = 'color-danger';
            }

            tips.removeClass().addClass('add_exp_tips').addClass(cls).html(d.data);
            setTimeout(function() {
                tips.removeClass().addClass('add_exp_tips').addClass('text-muted').html(txt);
            }, 3000);
        }
    });
};

/**
 *加金币方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.addGoldByAdmin = function(uid, rid, num){
    var userdata = $('.userinfo_dialog:visible');
    var cls = 'text-muted',tips = $('.add_error_tips');
    var _data = {
        uid : uid || userdata.data('userid'),
        rid : rid || app.roomid,
        val : num || $('.add_gold_val:visible').val()
    };


    if(!/^[0-9]*[1-9][0-9]*$/.test(_data.val)){
        $('.add_gold_val:visible').val('');
        tips.removeClass().addClass('add_error_tips').addClass('text-danger').html('请输入正确的数值');
        setTimeout(function(){
            tips.removeClass().addClass('add_error_tips').addClass('text-muted').html('');
        }, 3000);
        return false;
    }

    if(userdata.length > 0){
        $.ajax(app.url + '/WebRooms/addGold', {
            data: {
                username : _data.uid,
                goldnum : _data.val,
                rid : _data.rid
            },
            success : function(result){
                var d = result;
                if (d.sign == 1) {
                    cls = 'color-success';
                    var balance_box = $('.gold_balance');
                    var balance = Number(balance_box.text());
                    balance_box.text(balance - _data.val);
                } else {
                    cls = 'color-danger';
                    $('.add_gold_val').val('');
                }
                tips.removeClass().addClass('add_error_tips').addClass(cls).html(d.data);

                setTimeout(function(){
                    tips.removeClass().addClass('add_error_tips').addClass('text-muted').html('');
                }, 3000)
            }
        });
    }
};

/**
 *语音相关方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
var msgSound = null;

app.audio = app.audio || {};

(function(){
    var audio = app.audio;
    audio.id = null;
    audio.item = null;
    audio.dom = null;
    audio.url = null;
    audio.queue = {};
    audio.create = function(id, url){

        this.item = new Audio(this.url);
        this.add(this.id);

        this.on('play', function() {
            app.audio.play();
        });
        this.on('pause', function(s) {
            app.audio.stop();
        });
        // this.on('ended', function(s) {
            // app.audio.stop();
        // });
        return this;
    };
    audio.clear = function(id){
        this.id = null;
        // this.item.currentTime = 0.0;
        this.item = null;
        this.url = null;
        this.del(id || this.id);
    };
    // 检测是否存在
    audio.is = function(id){
        if(this.queue[id]){
            return true;
        }else{
            return false;
        }
    };
    audio.play = function(id){
        if(!this.is(id)){
            this.id = id;
            this.create();
        }
        var that = $('.msg_' + this.id),
            from = that.parents('.msg-list');
        var icon = from.hasClass('msg-list-me') ? 'voice_me.gif' : 'voice_user.gif';
        var img = '<img src="' + app.path.img + '/sound/' + icon + '" alt="" class="msg-audio-icon" />';
        that.html(img);
        that.addClass('active');
        from.find('.voice_info').find('.voice_statue').html('&nbsp;');
        this.item.play();
    };
    audio.stop = function(id){
        var that = $('.msg_' + this.id);
        that.empty();
        that.removeClass('active');
        // xue.log('stop: --------------->>>');
        // xue.log(this.item);
        this.item.pause();
        this.clear(id);
    };
    audio.add = function(id){
        this.queue[id] = this.item;
    };
    audio.del = function(id){
        delete this.queue[id];
    };
    // 音频绑定事件
    audio.on = function(tp, fn){
        this.item.addEventListener(tp, function(){
            fn();
        });
    };
    audio.off = function(tp){
        this.item.removeEventListener(tp);
    };
})();

/**
 *互动题相关方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.questions = app.questions || {};
(function(){
    var quest = app.questions;
    quest.data = [];
    // 获取互动题列表
    quest.getList = function(){
        $.ajax(app.ajaxPath.questions + '/questionList', {
            data : {
                curpage : 1,
                perpage : 1000
            },
            success : function(v){
                if(v.sign != 1){
                    alert(v.data);
                    return;
                }
                var tpl = '', qlist = [];
                $.each(v.data, function(qid, qinfo){
                    var isEdit = qinfo.is_publish === 1 ? '' : ' <a href="javascript:void(0);" class="btn_question_edit" data-id="'+ qid +'" data-title="'+ qinfo.title +'" data-question="'+ qinfo.question_img_path +'" data-answer="'+ qinfo.answer +'" data-analysis="'+ qinfo.analysis_img_path +'" title="编辑" data-id="'+ qid +'">编辑</a> ';
                    var d = {
                        'DT_RowId': 'row_' + qid,
                        'DT_RowClass': 'questions_item',
                        '0': qinfo.create_time,
                        '1': qinfo.title || '',
                        '2': '<a href="javascript:void(0);" class="btn_question_preview" title="预览" data-id="'+ qid +'" data-title="'+ qinfo.title +'" data-question="'+ qinfo.question_img_path +'" data-answer="'+ qinfo.answer +'" data-analysis="'+ qinfo.analysis_img_path +'">预览</a> <a href="javascript:void(0);" class="btn_question_pub" title="发布" data-id="'+ qid +'">发布</a> <a href="javascript:void(0);" class="btn_question_del" title="删除" data-id="'+ qid +'">删除</a>'+isEdit
                    };
                    if (qid) {
                        qlist.push(d);
                    }
                });
                app.panel.create({
                    id : 'questionsList',
                    title : '我的互动题',
                    content : '<table id="questions_items" class="table table-hover questions_items"></table>',
                    buttons : [
                        {
                            id : 'question_btn_add',
                            cls : 'question_btn_add',
                            title : '上传互动题',
                            name : '上传',
                            position : 'left',
                            icon : 'upload'
                        },{
                            id : 'question_btn_getrecord',
                            cls : 'question_btn_getrecord',
                            title : '互动题发布记录',
                            name : '发布记录',
                            position : 'left',
                            icon : 'list-ul'
                        },{
                            id : 'question_btn_close',
                            cls : 'btn_close',
                            title : '关闭',
                            position : 'right',
                            icon : 'times-circle'
                        }
                    ]
                });

                $('#questions_items').dataTable({
                    'bRetrieve': true,
                    'bDestroy': true,
                    'bAutoWidth': false, // 禁止计算宽度
                    'iDisplayLength': 10, // 每页显示数
                    'bLengthChange': false, // 禁用选择每页显示数
                    'sPaginationType': 'bootstrap',
                    "aaSorting": [[ 0, "desc" ]],    // 第一列倒序
                    'aoColumns': [{
                        'sTitle': '上传时间',
                        'sClass': 'text-left'
                    }, {
                        'sTitle': '标题',
                        'sClass': 'text-left'
                    }, {
                        'sTitle': '操作',
                        'sClass': 'item_btns text-left'
                    }],
                    'aaData': qlist
                });

                app.resize();
                $('#questions_items_filter').parent().parent().remove();
            }
        });
    };
    // 获取发布记录列表
    quest.getRecord = function(){
        var tpl = '', rlist = [];

        $.ajax(app.ajaxPath.questions + '/questionPublishLog', {
            data : {
                curpage : 1,
                perpage : 1000
            },
            success : function(result){
                var v = xue.checkAjaxData(result);
                if(v){
                    $.each(v, function(rid, rinfo){
                        var d = {
                            'DT_RowId': 'row_' + rid,
                            'DT_RowClass': 'questions_record_item',
                            '0': rinfo.create_time,
                            '1': rinfo.title || '',
                            '2': rinfo.group_name || '',
                            '3': rinfo.gold,
                            '4': rinfo.right_people_num + '/' + rinfo.answer_people_num,
                            '5': '<a href="javascript:void(0);" class="btn_question_record_resend" title="重发" data-id="'+ rid +'">重发</a> | <a href="javascript:void(0);" class="btn_question_record_view" title="查看" data-id="'+ rid +'">查看</a>'
                        };
                        if (rid) {
                            rlist.push(d);
                        }
                    });

                    app.panel.create({
                        id : 'questionsRecordList',
                        title : '互动题发布记录',
                        content : '<table id="questions_records" class="table table-hover questions_items"></table>',
                        buttons : [
                            {
                                id : 'question_btn_goback',
                                cls : 'btn_goback',
                                title : '返回',
                                name : '返回',
                                position : 'left',
                                icon : 'arrow-circle-left',
                                data : {
                                    target : '#questionsList'
                                }
                            },{
                                id : '',
                                cls : 'btn_close',
                                title : '关闭',
                                position : 'right',
                                icon : 'times-circle'
                            }
                        ]
                    });

                    $('#questions_records').dataTable({
                        'bRetrieve': true,
                        'bDestroy': true,
                        'bAutoWidth': false, // 禁止计算宽度
                        'iDisplayLength': 10, // 每页显示数
                        'bLengthChange': false, // 禁用选择每页显示数
                        'sPaginationType': 'bootstrap',
                        "aaSorting": [[ 0, "desc" ]],    // 第一列倒序 (asc:正序)
                        'aoColumns': [{
                            'sTitle': '发布时间',
                            'sClass': 'text-left'
                        },{
                            'sTitle': '标题',
                            'sClass': 'text-left'
                        },{
                            'sTitle': '群',
                            'sClass': 'text-left'
                        },{
                            'sTitle': '悬赏金币',
                            'sClass': 'text-left'
                        },{
                            'sTitle': '答对/参与',
                            'sClass': 'text-left'
                        },{
                            'sTitle': '操作',
                            'sClass': 'item_btns text-left'
                        }],
                        'aaData': rlist
                    });

                    app.resize();
                    $('#questions_records_filter').parent().parent().remove();
                }
            }
        });

    };

    // 获取抢金榜列表
    quest.getGoldList = function(id){
        if(!id){return;}

        var tpl = '', glist = [] ;
        $.ajax(app.ajaxPath.questions + '/getGoldList', {
            data : { publishId : id },
            success : function(result){
                var v = xue.checkAjaxData(result);
                if(v){
                    $.each(v, function(gid, ginfo){
                        xue.log('gid: ' + gid);
                        var d = {
                            'DT_RowId': 'row_' + gid,
                            'DT_RowClass': 'questions_goldlist_item',
                            '0': (gid+1),
                            '1': ginfo.nickname || '',
                            '2': ginfo.create_time || '',
                            '3': ginfo.gold
                        };
                        glist.push(d);
                    });
                    tpl += '<div class="panel question_goldlist_win">';
                    tpl +=      '<div class="panel-heading"><a href="javascript:app.win.close();" class="toolbar_btn pull-right"><i class="fa fa-times-circle"></i></a></div>';
                    tpl +=      '<div class="panel-body">';
                    tpl +=          '<table id="questions_goldlist" class="table table-hover questions_items"></table>';
                    tpl +=      '</div>';
                    tpl += '</div>';
                    $.fancybox({
                        prevEffect: 'none',
                        nextEffect: 'none',
                        width: 730,
                        height: 'auto',
                        content: tpl,
                        closeBtn: false,
                        autoSize: false,
                        scrolling: 'visible',
                        padding: 0,
                        helpers: {}
                    });
                    $('#questions_goldlist').dataTable({
                        'bRetrieve': true,
                        'bDestroy': true,
                        'bAutoWidth': false, // 禁止计算宽度
                        'iDisplayLength': 10, // 每页显示数
                        'bLengthChange': false, // 禁用选择每页显示数
                        'sPaginationType': 'bootstrap',
                        "aaSorting": [[ 0, "asc" ]],    // 第一列倒序 (asc:正序)
                        'aoColumns': [{
                            'sTitle': '序号',
                            'sClass': 'text-left'
                        },{
                            'sTitle': '昵称',
                            'sClass': 'text-left'
                        },{
                            'sTitle': '时间',
                            'sClass': 'text-left'
                        },{
                            'sTitle': '金币',
                            'sClass': 'text-left'
                        }],
                        'aaData': glist
                    });
                    $('#questions_goldlist_filter').parent().parent().remove();
                }
            }
        });
    };

    // 添加互动题
    quest.add = function(dom){
        // if(!dom){return;}
        var item = $(dom);
        var data = {
            id : item.data('id') || '',
            title : item.data('title') || '',
            question : item.data('question') || '',
            answer : item.data('answer') || '',
            analysis : item.data('analysis') || ''
        };
        var tpl = '';

        tpl += '<form class="form-horizontal question_add_form" role="form">';
        tpl +=      '<div class="form-group">';
        tpl +=          '<label class="col-sm-2 control-label">添加标题</label>';
        tpl +=          '<div class="col-sm-7"><input type="text" class="form-control" id="question_input_title" name="question_title" placeholder="最多20个字符" value="'+ data.title +'"></div>';
        tpl +=      '</div>';
        tpl +=      '<div class="form-group">';
        tpl +=          '<label for="question_title" class="col-sm-2 control-label">题干图片</label>';
        tpl +=          '<div class="col-sm-7">';
        tpl +=              '<input type="text" class="form-control" id="question_input_questionImg" placeholder="jpg/png,小于200k,宽度大于500像素" disabled readonly>';
        tpl +=          '</div>';
        tpl +=          '<div class="col-sm-2 files_input_group">';
        tpl +=              '<button type="button" class="btn btn-default">选择</button>';
        tpl +=              '<input type="file" accept="image/*" name="questionImg" size="45" id="question_files_questionImg" class="file_input question_input_files" data-target="#question_input_questionImg">';
        tpl +=          '</div>';
        tpl +=      '</div>';
        tpl +=      '<div class="form-group">';
        tpl +=          '<span class="col-sm-2 control-label">正确答案</span>';
        tpl +=          '<div class="col-sm-8">';
        tpl +=              '<label class="radio-inline"><input type="radio" name="question_answer" value="A" '+ (data.answer == 'A' ? 'checked="true"' : '') +'>A</label>';
        tpl +=              '<label class="radio-inline"><input type="radio" name="question_answer" value="B" '+ (data.answer == 'B' ? 'checked="true"' : '') +'>B</label>';
        tpl +=              '<label class="radio-inline"><input type="radio" name="question_answer" value="C" '+ (data.answer == 'C' ? 'checked="true"' : '') +'>C</label>';
        tpl +=              '<label class="radio-inline"><input type="radio" name="question_answer" value="D" '+ (data.answer == 'D' ? 'checked="true"' : '') +'>D</label>';
        tpl +=          '</div>';
        tpl +=      '</div>';
        tpl +=      '<div class="form-group">';
        tpl +=          '<label for="question_title" class="col-sm-2 control-label">解析图片</label>';
        tpl +=          '<div class="col-sm-7">';
        tpl +=              '<input type="email" class="form-control" id="question_input_analysisImg" placeholder="jpg/png,小于200k,宽度大于500像素" disabled readonly>';
        tpl +=          '</div>';
        tpl +=          '<div class="col-sm-2 files_input_group">';
        tpl +=              '<button type="button" class="btn btn-default">选择</button>';
        tpl +=              '<input type="file" accept="image/*" name="analysisImg" size="45" id="question_files_analysisImg" class="file_input question_input_files" data-target="#question_input_analysisImg">';
        tpl +=          '</div>';
        tpl +=      '</div>';
        tpl +=      '<div class="form-group">';
        tpl +=          '<label class="col-sm-2 control-label"></label>';
        tpl +=          '<div class="col-sm-8">';
        if(data.id){
            tpl +=              '<input type="hidden" id="question_edit_id" value="'+ data.id +'">';
        }
        tpl +=              '<button type="button" class="btn btn-primary" id="question_add_submit" data-target="form.question_add_form">保存</button>';
        tpl +=          '</div>';
        tpl +=      '</div>';
        tpl += '</form>';


        app.panel.create({
            id : 'questionsAdd',
            title : '上传互动题',
            content : tpl,
            // opacity : false,
            buttons : [
                {
                    id : 'question_btn_goback',
                    cls : 'btn_goback',
                    title : '返回',
                    name : '返回',
                    position : 'left',
                    icon : 'arrow-circle-left',
                    data : {
                        target : '#questionsList'
                    }
                },{
                    id : '',
                    cls : 'btn_close',
                    title : '关闭',
                    name : '关闭',
                    position : 'right',
                    icon : 'times-circle'
                }
            ]
        });

    };
    // 上传互动题
    quest.upload = function(form){
        var dom = $(form);
        if(!form || dom.length === 0){ return ;}
        var title = dom.find('#question_input_title'),
            answer = dom.find('input[name="question_answer"]:checked'),
            id = dom.find('#question_edit_id'),
            submit = $('#question_add_submit');
        answer = answer || '';
        if(title.val() == ''){
            alert('标题不能为空');
            submit.button('reset');
            title.focus();
            return false;
        }
        if(title.val().length > 20){
            alert('标题请控制在20个字以内');
            submit.button('reset');
            title.focus();
            return false;
        }
        var data = {
            title: title.val(),
            answer: answer.val()
//          ,
//          questionImg   : $('#question_files_questionImg').val(),
//          analysisImg   : $('#question_files_analysisImg').val()
        };
        var url = app.ajaxPath.questions + '/addQuestions';
        if(id.val()){
            data.qid = id.val();
            url = app.ajaxPath.questions + '/modifyQuestions';
        }

        $.ajaxFileUpload({
            url: url,
            secureuri: false,
            fileElementId: '#question_files_questionImg,#question_files_analysisImg',
            dataType: 'json',
            data: data,
            success: function(d) {
                var val = xue.checkAjaxData(d);
                $('#question_add_submit').button('reset');
                if(val){
                    alert(val);
                    title.val('');
                    answer.val('');
                    $('#question_files_questionImg,#question_input_questionImg').val('');
                    $('#question_files_analysisImg,#question_input_analysisImg').val('');
                    // 重新加载互动列表
                    app.questions.getList();
                }

            },
            error: function(data, status, e) {
                xue.log(arguments);
                $('#question_add_submit').button('reset');

            }
        });
    };
    // 修改互动题
    quest.edit = function(){};
    // 删除互动题
    quest.del = function(id, fn){
        if(!id){ return; }
        $.ajax(app.ajaxPath.questions + '/delQuestions', {
            data : { qid : id },
            success: function(v){
                var d = xue.checkAjaxData(v);
                if(d){
                   if(typeof fn == 'function'){
                        fn(v);
                    }else{
                        $('#questions_items').find('#row_'+id).remove();
                    }
                }
            }
        });
    };
    // 发送互动题
    quest.send = function(dom){
        var form = $(dom);
        var data = {
            qid : form.data('id'),
            rid : form.find('input.pub_roomgroup:radio:checked').val(),
            gold : form.find('input[name="question_pub_gold"]').val(),
            num : form.find('input[name="question_pub_num"]').val(),
            gold_type : form.find('input[name="question_pub_gold_type"]').val()
        };
        if(data.gold_type == 1){
            data.firstGold = $('input.firstGold').val();
            data.firstNum = $('input.firstNum').val();
            data.secondGold = $('input.secondGold').val();
            data.secondNum = $('input.secondNum').val();
            data.thirdGold = $('input.thirdGold').val();
            data.thirdNum = $('input.thirdNum').val();
        }
        /**
            qid          试题ID
            rid          发布的群ID
            gold         悬赏的金币数不大于1000的正整数
            num          悬赏人数
         */
        $.ajax(app.ajaxPath.questions + '/publishQuestions', {
            data : data,
            success: function(v){
                var d = xue.checkAjaxData(v);
                if(d){
                    alert(d);
                    app.win.close();
                }

            }
        });
        return false;
    };
    // 互动题上传列表中的发布弹出层

    quest.sendLayer = function(id){
        var tpl = '<div class="panel question_pub_win">';
        tpl += '<div class="panel-heading"><a href="javascript:app.win.close();" class="toolbar_btn pull-right"><i class="fa fa-times-circle"></i></a></div>';
        tpl += '<div class="panel-body">';
        tpl +=      '<form role="form" class="form-horizontal question_pub_form" data-id="'+ id +'">';
        tpl +=          '<div class="form-group">';
        tpl +=              '<span class="col-sm-2 control-label">选择群：</span>';
        tpl +=              '<div class="col-sm-10">';
        $.each(app.roomlist, function(k, v){
            tpl +=              '<label class="radio-inline"><input type="radio" class="pub_roomgroup" name="question_pub_group" data-type="rid" value="'+ k +'">'+ v.roomName +'</label>';
        });
        tpl +=              '</div>';
        tpl +=          '</div>';
        tpl +=          '<div class="form-group">';
        tpl +=              '<span class="col-sm-2 control-label">发放类型：</span>';
        tpl +=              '<div class="col-sm-10">';
        tpl +=                  '<label class="radio-inline"><input type="radio" name="question_pub_type" data-type="rid" value="1" data-target=".type_1" checked>手工设置</label>';
        tpl +=                  '<label class="radio-inline"><input type="radio" name="question_pub_type" data-type="rid" value="2" data-target=".type_2">随机设置</label>';
        tpl +=              '</div>';
        tpl +=          '</div>';

        tpl +=          '<div class="row quest_pub_type_box type_1">';
        tpl +=              '<div class="form-group">';
        tpl +=                  '<span class="col-sm-2 control-label">一等奖：</span>';
        tpl +=                  '<div class="col-sm-4">'
        tpl +=                      '<div class="input-group">';
        tpl +=                          '<span class="input-group-addon">每人奖励金币</span><input type="text" class="form-control firstGold" name="question_pub_firstGold" data-type="gold" placeholder="必填">';
        tpl +=                      '</div>';
        tpl +=                  '</div>';
        tpl +=                  '<div class="col-sm-4">'
        tpl +=                      '<div class="input-group">';
        tpl +=                          '<span class="input-group-addon">人数</span><input type="text" class="form-control firstNum" name="question_pub_firstNum" data-type="num" placeholder="必填">';
        tpl +=                      '</div>';
        tpl +=                  '</div>';
        tpl +=              '</div>';
        tpl +=              '<div class="form-group">';
        tpl +=                  '<span class="col-sm-2 control-label">二等奖：</span>';
        tpl +=                  '<div class="col-sm-4">'
        tpl +=                      '<div class="input-group">';
        tpl +=                          '<span class="input-group-addon">每人奖励金币</span><input type="text" class="form-control secondGold" name="question_pub_secondGold" data-type="gold" placeholder="选填">';
        tpl +=                      '</div>';
        tpl +=                  '</div>';
        tpl +=                  '<div class="col-sm-4">'
        tpl +=                      '<div class="input-group">';
        tpl +=                          '<span class="input-group-addon">人数</span><input type="text" class="form-control secondNum" name="question_pub_secondNum" data-type="num" placeholder="选填">';
        tpl +=                      '</div>';
        tpl +=                  '</div>';
        tpl +=              '</div>';
        tpl +=              '<div class="form-group">';
        tpl +=                  '<span class="col-sm-2 control-label">三等奖：</span>';
        tpl +=                  '<div class="col-sm-4">'
        tpl +=                      '<div class="input-group">';
        tpl +=                          '<span class="input-group-addon">每人奖励金币</span><input type="text" class="form-control thirdGold" name="question_pub_thirdGold" data-type="gold" placeholder="选填">';
        tpl +=                      '</div>';
        tpl +=                  '</div>';
        tpl +=                  '<div class="col-sm-4">'
        tpl +=                      '<div class="input-group">';
        tpl +=                          '<span class="input-group-addon">人数</span><input type="text" class="form-control thirdNum" name="question_pub_thirdNum" data-type="num" placeholder="选填">';
        tpl +=                      '</div>';
        tpl +=                  '</div>';
        tpl +=              '</div>';
        tpl +=          '</div>';

        tpl +=          '<div class="form-group quest_pub_type_box type_2" style="display:none;">';
        tpl +=              '<span class="col-sm-2 control-label">悬赏金币：</span>';
        tpl +=              '<div class="col-sm-3"><input type="text" class="form-control" name="question_pub_gold" data-type="gold" placeholder="5000金币可用"></div>';
        tpl +=              '<span class="col-sm-2 control-label">悬赏人数：</span>';
        tpl +=              '<div class="col-sm-3"><input type="text" class="form-control" name="question_pub_num" data-type="num" placeholder=""></div>';
        tpl +=          '</div>';
        tpl +=          '<div class="form-group">';
        tpl +=              '<span class="col-sm-2 control-label"></span>';
        tpl +=              '<input type="hidden" name="question_pub_gold_type" value="1" >';
        tpl +=              '<div class="col-sm-3"> <button id="question_pub_submit" type="button" name="question_pub_submit" class="btn btn-primary">发布</button></div>';
        tpl +=          '</div>';
        tpl +=      '</form>';
        tpl += '</div>';
        tpl += '</div>';
        $.fancybox({
            prevEffect: 'none',
            nextEffect: 'none',
            width: 730,
            height: 'auto',
            content: tpl,
            closeBtn: false,
            autoSize: false,
            scrolling: 'visible',
            padding: 0,
            helpers: {}
        });
    };

    quest.preview = function(data){
        if(!data.id){return;}
        var tpl = '<div class="panel-default question_preview_win">';
        tpl += '<div class="panel-heading"><p class="btn-group pull-right"><a href="javascript:app.win.close();" class="btn btn-default btn-xs pull-right">取消</a><a href="javascript:void(0)" class="btn btn-default btn-xs pull-right btn_question_pub" data-id="'+data.id+'">去发布</a><span class="answer">答案：'+ data.answer +'</span></p>'+ data.title +'</div>';
        tpl += '<div class="panel-body">';
        tpl +=      '<form role="form" class="form-horizontal question_pub_form">';
        tpl +=          '<div class="form-group">';
        tpl +=              '<span class="col-sm-2 control-label">题干：</span>';
        tpl +=              '<div class="col-sm-10">';
        tpl +=                 '<div class="analysis_img">';
        tpl +=                   '<img src="'+ data.question_img_path +'">';
        tpl +=                 '</div>';
        tpl +=              '</div>';
        tpl +=          '</div>';
        if (data.analysis_img_path) {
            tpl +=          '<div class="form-group">';
            tpl +=              '<span class="col-sm-2 control-label">解析：</span>';
            tpl +=              '<div class="col-sm-10">';
            tpl +=                 '<div class="analysis_img">';
            tpl +=                   '<img src="'+ data.analysis_img_path +'">';
            tpl +=                 '</div>';
            tpl +=              '</div>';
            tpl +=          '</div>';
        };
        tpl +=      '</form>';
        tpl += '</div>';
        tpl += '</div>';
        $.fancybox({
            prevEffect: 'none',
            nextEffect: 'none',
            width: 640,
            height: 500,
            content: tpl,
            closeBtn: false,
            autoSize: false,
            scrolling: 'auto',
            padding: 0,
            helpers: {}
        });
    };

    // 重发
    quest.resend = function(id){
        if(!id){
            return false;
        }
        ///TestManage/rePublish
        $.ajax(app.ajaxPath.questions + '/rePublish', {
            data : {publishId: id},
            success: function(v){
                var d = xue.checkAjaxData(v);
                if(d){
                    alert(d);
                    app.win.close();
                }

            }
        });
    };

})();


/**
 *房间禁言方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.lockroom = function(roomid, userid){
    if(app.roomid == roomid){
        var input = $(app.box.textarea);
        input.prop('readonly', true);
        input.prop('disabled', true);
        input.val('');
    }
    app.roomlist[roomid].speakstate = 1;
};

/**
 *房间解禁状态方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.unlockroom = function(roomid){
    if(app.roomid == roomid){
        var input = $(app.box.textarea);
        input.prop('readonly', false);
        input.prop('disabled', false);
    }
    app.roomlist[roomid].speakstate = 0;
};



/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[ 群空间部分 ]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/**
 *群空间相关方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.spaces = app.spaces || {};

(function(){

    var sp = app.spaces;
    //获取群空间列表
    sp.opt = {
        pageStr: '',
        curPage: 1, //当前页
        total: 0, //总记录数
        pageSize: 10, //每页显示条数
        totalPage: 0,//总页数
        pageBox:'#paginate-mod'
    }
    sp.getList = function(current) {
        $.ajax(app.url + '/DatumManage/datumList', {
            data:{
                rid:app.roomid, //群id
                spaceId:app.spaceid, //空间id
                curpage:current || 1, //当前页
                perpage: sp.opt.pageSize//每页显示条数
            },
            success:function(v){
                if(v.sign != 1){
                    alert(v.data);
                    return;
                }
                var spaceList = [];
                var vdata = v.data;

                 sp.opt.curPage = current || 1;
                 sp.opt.total = v.rows;
                 sp.opt.totalPage = Math.ceil(sp.opt.total/sp.opt.pageSize);
                 console.log('total:'+sp.opt.total+'tpage:'+sp.opt.totalPage)
                //遍历资料数据
                $.each(vdata.datumList , function(spacenum,spaceinfo){
                    var info = spaceinfo;
                    var istop = info.is_top == 1 ? '置顶' : '取消置顶';
                    var topclass = info.is_top == 1 ? 'btn_topdatum' : 'btn_untopdatum';
                    var filetype = info.type == 1 ? '文件' : (info.type == 2 ? '链接' : '未知');
                    var btnTpl = '<div class="btn-group btn-group-sm">';

                    //判断用户类型
                    if(app.usertype == 2 || app.usertype == 3){
                        btnTpl +='<button type="button" data-datumid="'+info.id+'" class="btn btn-default btn_deldatum" data-loading-text="Loading...">删除</button>';
                        btnTpl +='<button type="button" data-datumid="'+info.id+'" class="btn btn-default '+ topclass +'" data-loading-text="Loading...">'+istop+'</button>';
                    }
                    btnTpl +='</div>';

                    //dataTable实例模板
                    var d = {
                        'DT_RowId': 'row_' + info.id,  //横向id
                        'DT_RowClass': 'spacedatum_item spaceitems', //横向class
                        '0': '<a href="'+info.datum_path+'" target="_blank">' + info.title + '</a>',  //第一列--标题
                        '1': info.nickname || '',
                        '2': filetype || '',  //第二列--文件类型
                        '3': info.create_time || '', //第三列--创建时间
                        '4': info.click_people || '0', //点击数
                        '5': info.collect_num || '0', //收藏数
                        '6': info.share_num || '0' , //分享数
                        '7': btnTpl
                    };

                    spaceList.push(d);
                });
                //dataTable插入表格
                // console.log(spaceList)
                $('#roomspace_items').html('').append('<table class="table table-hover users_items userlist"></table>');
                $('#roomspace_items table').dataTable({
                    'bRetrieve': true,
                    'bDestroy': true,
                    'bSort':false,
                    'bAutoWidth': false, // 禁止计算宽度
                    //'iDisplayLength': 10, // 每页显示数
                    'bInfo': false,  // 隐藏页数信息
                    'bFilter': false,  //搜索框
                    'bPaginate': false,  //取消分页器
                    'bLengthChange': false, // 禁用选择每页显示数
                    // 'bServerSide': false,
                    // 'bProcessing': true,
                    'sPaginationType': 'bootstrap',

                    // "sDom": '<"bottom"p>',
                    // "sDom": "<'dt-top-row'><'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
                    'aoColumns': [{
                        'sTitle': '标题',
                        'sClass': 'btn_viewuser text-left'
                    },{
                        'sTitle': '作者',
                        'sClass': 'btn_viewuser text-left'
                    },{
                        'sTitle': '类别',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '发表时间',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '点击',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '收藏',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '分享',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '操作',
                        'sClass': 'text-left'
                    }],
                    'aaData': spaceList
                });
                sp.setPageBar();
                app.resize();
            }  //success
        });  //ajax
    }

    sp.setPageBar = function(){
            var o = this.opt;
            if(o.totalPage < 1){
                return;
            }
            //页码大于最大页数
            if(o.curPage > o.totalPage){
                o.curPage = o.totalPage;
            }
            //页码小于1
            if(o.curPage<1) {
                o.curPage=1
            }
            o.pageStr = '<ul class="pagination pagination-sm">';
            //如果是第一页
            if(o.curPage==1){
                o.pageStr += '<li class="disabled"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
            }else{
                o.pageStr += '<li class="prev"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
            }

            var len = o.totalPage > 5 ? 5 : o.totalPage;      //分页器如果大于五且curPage>=3 && <=总数-2时，始终保持在中间
            if (o.totalPage < 5) {
                for (var i = 1; i <= len; i++) {
                    var page = i;
                    var className = o.curPage == page ? 'active' : 'item';
                    o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                }
            } else {
                if (o.curPage >= 3 && o.curPage <= o.totalPage - 2) {
                    for (var j = 1; j <= len; j++) {
                        var page = o.curPage - 3 + j;
                        var className = o.curPage == page ? 'active' : 'item';
                        o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                    }
                } else {
                    for (var k = 1; k <= len; k++) {
                        console.log(o.curPage)
                        var page = o.curPage < 3 ? k : o.totalPage - 5 + k;
                        var className = o.curPage == page ? 'active' : 'item';
                        o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                    }
                }
            }

            //如果是最后页
            if(o.curPage >= o.totalPage){
                o.pageStr += '<li class="disabled"><a href="#"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>';
            }else{
                o.pageStr += '<li class="next"><a href="#"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>';
            }
            o.pageStr += '</ul>';
            $(o.pageBox).html(o.pageStr);
    }
    sp.createMod = function() {
        //创建群空间右侧整体模板
        var tpl = '';
        tpl += '<div class="panel-heading">';
        tpl += '<div class="btn-group pull-left"><button type="button" class="btn btn-default btn-sm btn_space_upload">添加资料</button></div>'
        tpl += '    <div class="btn-group pull-right"><button type="button" class="btn btn-default btn-sm btn_goback"><i class="fa fa-arrow-circle-left fa-3"></i><b class="btn_title">返回</b></button></div>';
        tpl += '    <h5 class="text-center space-title"></h5>';
        tpl += '</div>';

        tpl += '<div class="panel-body users_form panel_content">';
        tpl += '<div id="roomspace_items"><table class="table table-hover users_items userlist"></table></div>';
        tpl += '<div class="col-sm-12" id="paginate-mod"></div>';
        tpl += '</div>';

        //插入群空间外框架
        $('#content_message').hide();
        if ($('#roomSpace').length === 0) {
            $(app.box.content).append('<div id="roomSpace" class="panel panel-default h600 panel_list"></div>');
        }
        var box = $('#roomSpace');
        box.html(tpl).show().siblings('.panel_list').hide();
    }

    //删除群空间资料
    sp.delDatum = function(datumid) {
        $.ajax(app.url + '/DatumManage/delDatum', {
            data: {
                rid: app.roomid, //添加的群ID
                spaceId: app.spaceid,
                id: datumid,
            },
            success: function(v) {
                if (v.sign != 1) {
                    alert(v.data);
                    return;
                }
                sp.getList();
            }
        });
    };

    //添加空间资料
    sp.add = function(){
            var tpl = '';

            tpl += '<form class="form-horizontal spaces_add_form" style="margin-top:50px;" role="form">';
            tpl +=      '<div class="form-group">';
            tpl +=          '<label class="col-sm-2 control-label">类别</label>';
            tpl +=          '<div class="col-sm-7 btn-group" >';
            tpl +=               '<button type="button" id="spaces_upload_type" class="btn btn-sm btn-default dropdown-toggle" data-type="1" data-toggle="dropdown" aria-expanded="false">文件<span class="caret"></span></button>';
            tpl +=               '<ul class="dropdown-menu" role="menu">';
            tpl +=                     '<li data-type="1"><a href="javascript:void(0);">文件</a></li><li data-type="2"><a href="javascript:void(0);">链接</a></li>';
            tpl +=               '</ul>';
            tpl +=          '</div>';
            tpl +=      '</div>';
            tpl +=      '<div class="form-group">';
            tpl +=          '<label for="spaces_upload_title" class="col-sm-2 control-label">标题</label>';
            tpl +=          '<div class="col-sm-7">';
            tpl +=              '<input type="text" class="form-control" id="spaces_upload_title" placeholder="20个字以内">';
            tpl +=          '</div>';
            tpl +=      '</div>';
            tpl +=      '<div class="form-group spaces_datum_file">';
            tpl +=          '<label class="col-sm-2 control-label">选择文件</label>';
            tpl +=          '<div class="col-sm-7">';
            tpl +=              '<input type="email" class="form-control" id="space_upload_file_url" placeholder="10M以内" disabled readonly>';
            tpl +=          '</div>';
            tpl +=          '<div class="col-sm-2 files_input_group">';
            tpl +=              '<button type="button" class="btn btn-default">选择</button>';
            tpl +=              '<input type="file" name="filePath" size="45" id="spaces_upload_file" class="file_input question_input_files" data-target="#space_upload_file_url">';
            tpl +=          '</div>';
            tpl +=      '</div>';
            tpl +=      '<div class="form-group spaces_datum_url" style="display:none;">';
            tpl +=          '<label for="space_upload_url" class="col-sm-2 control-label">链接地址</label>';
            tpl +=          '<div class="col-sm-7">';
            tpl +=              '<input type="text" class="form-control" id="space_upload_url" placeholder="复制链接地址">';
            tpl +=          '</div>';
            tpl +=      '</div>';
            tpl +=      '<div class="form-group">';
            tpl +=          '<label class="col-sm-2 control-label"></label>';
            tpl +=          '<div class="col-sm-8">';
            tpl +=              '<button type="button" class="btn btn-primary" id="spaces_add_submit">保存</button>';
            tpl +=          '</div>';
            tpl +=      '</div>';
            tpl += '</form>';


            app.panel.create({
                id : 'spaceDatumAdd',
                title : '添加资料',
                content : tpl,
                // opacity : false,
                buttons : [
                    {
                        id : 'question_btn_goback',
                        cls : 'btn_goback',
                        title : '返回',
                        name : '返回',
                        position : 'right',
                        icon : 'arrow-circle-left',
                        data : {
                            target : '#roomSpace'
                        }
                    }
                ]
            });

        };

    //编辑群空间资料--类型变换
    sp.changType = function(dom){
        if(!dom) return false;
        //判断是否为jQuery对象
        dom = dom instanceof jQuery ? dom : $(dom);
        var fileMod = dom.parents('.form-group').siblings('.spaces_datum_file');
        var urlMod = dom.parents('.form-group').siblings('.spaces_datum_url');
        var typebtn = dom.parents('.dropdown-menu').siblings('#spaces_upload_type');
        var type = dom.data('type');
        //类型按钮根据选择切换文字
        var str = type == 1 ? typebtn.html().replace(/^[\u4e00-\u9fa5]+/g,'文件'): typebtn.html().replace(/^[\u4e00-\u9fa5]+/g,'链接');

        typebtn.html(str);

        if(type == 1){             //选择上传文件
            urlMod.hide();
            fileMod.show();
        }

        if(type == 2){             //选择上传资料
            urlMod.show();
            fileMod.hide();
        }
        typebtn.data('type',type); //把选择类型赋给类型按钮
    };
    //置顶群空间资料
    sp.isTopDatum = function(datumid,datumtype) {
        $.ajax(app.url + '/DatumManage/topDatum', {
            data: {
                rid: app.roomid, //添加的群ID
                spaceId: app.spaceid,
                id: datumid,
                type:datumtype
            },
            success: function(v) {
                if (v.sign != 1) {
                    alert(v.data);
                    return;
                }
                sp.createMod();
                sp.getList();
            }
        });
    };

    //上传空间资料
    sp.upLoad = function(dom){
        if(!dom) return false;
        dom = dom instanceof jQuery ? dom : $(dom);
        if(dom.hasClass('uploading')){     //防止重复提交
            return false;
        }
        dom.addClass('uploading');
        var form = dom.parents('.spaces_add_form');
        var type = form.find('#spaces_upload_type').data('type');
        var title = form.find('#spaces_upload_title');

        if(title.val() == ''){
                alert('标题不能为空');
                dom.button('reset');
                title.focus();
                return false;
            }
            if(title.val().length > 20){
                alert('标题请控制在20个字以内');
                dom.button('reset');
                title.focus();
                return false;
            }
        var data = {
            rid : app.roomid,
            spaceId : app.spaceid,
            title : title.val(),
            type : type
        }
        if(type == 1){  //提交文件类型资料
            $.ajaxFileUpload({
                url: app.url + '/DatumManage/addDatum',
                secureuri: false,
                fileElementId: '#spaces_upload_file',
                dataType: 'json',
                data: data,
                success: function(v) {
                    if(v.sign !=1){
                       alert(v.data);
                       return;
                    }
                    sp.createMod();
                    sp.getList();

                },
                error: function(data, status, e) {
                    alert('通信失败');
                }
            });
        }else if(type == 2){   //提交链接类型资料
            var urlAdd = form.find('#space_upload_url');
            if(!/^(http:\/\/|https:\/\/)/.test(urlAdd.val())){
                alert('请输入合法的链接地址');
                dom.button('reset');
                urlAdd.focus();
                return false;
            }
            data.urlPath = urlAdd.val();
            $.ajax(app.url+'/DatumManage/addDatum',{
                    data:data,
                    success:function(v){
                        if(v.sign != 1){
                            alert(v.data);
                            return;
                        }
                        sp.createMod();
                        sp.getList();
                    },
                    error:function(){
                        alert('通信失败')
                    }
             });
        }
    }

})()


/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[ 群统计部分 ]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/**
 *群统计相关方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.Statistics = app.Statistics || {};

(function(){

    var Statistic = app.Statistics;
    //获取群日报列表
    Statistic.groupDailyopt = {
        pageStr: '',
        curPage: 1, //当前页
        total: 0, //总记录数
        pageSize: 10, //每页显示条数
        totalPage: 0,//总页数
        pageBox:'#paginate-groupDailyMod'
    }
    Statistic.groupDailyList = function(StartDate,EndDate,current) {
        $.ajax(app.url + '/WebRooms/getDayStat', {
            data:{
                rid:app.roomid, //群id
                stime:StartDate || '',
                etime:EndDate || '',
                curpage:current || 1, //当前页
                perpage: Statistic.groupDailyopt.pageSize//每页显示条数
            },
            success:function(v){
                if(v.sign != 1){
                    alert(v.data);
                    return;
                }
                var DailyList = [];
                var vdata = v.data;

                 Statistic.groupDailyopt.curPage = current || 1;
                 Statistic.groupDailyopt.total = v.rows;
                 Statistic.groupDailyopt.totalPage = Math.ceil(Statistic.groupDailyopt.total/Statistic.groupDailyopt.pageSize);
                 //console.log('total:'+sp.opt.total+'tpage:'+sp.opt.totalPage)
                 //群日报标题
                 var DailyTitle = app.roomname +"日报";
                 $('#groupDaily_title').html(DailyTitle);
                //遍历资料数据
                $.each(vdata , function(Dailynum,Dailyinfo){
                    var info = Dailyinfo;
                    //dataTable实例模板
                    var d = {
                        //'DT_RowId': 'row_' + info.id,  //横向id
                        'DT_RowClass': 'groupDaily_item Dailyitems', //横向class
                        '0': info.tdate || '', //日期
                        '1': info.msgnum || '',//发言条数
                        '2': info.speaknum || '', //发言人数
                        '3': info.member || '', //群人数
                        '4': info.learnclass_paynum || '', //直播小组人数
                        '5': info.rate || '', //直播辅导加群比例
                        '6': info.loginnum || '' //当日登录人数
                    };
                    DailyList.push(d);
                });
                //dataTable插入表格
                // console.log(spaceList)
                $('#groupDaily_items').html('').append('<table class="table table-hover users_items userlist"></table>');
                $('#groupDaily_items table').dataTable({
                    'bRetrieve': true,
                    'bDestroy': true,
                    'bSort':false,
                    'bAutoWidth': false, // 禁止计算宽度
                    //'iDisplayLength': 10, // 每页显示数
                    'bInfo': false,  // 隐藏页数信息
                    'bFilter': false,  //搜索框
                    'bPaginate': false,  //取消分页器
                    'bLengthChange': false, // 禁用选择每页显示数
                    // 'bServerSide': false,
                    // 'bProcessing': true,
                    'sPaginationType': 'bootstrap',

                    // "sDom": '<"bottom"p>',
                    // "sDom": "<'dt-top-row'><'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
                    'aoColumns': [{
                        'sTitle': '日期',
                        'sClass': 'btn_viewuser text-left'
                    },{
                        'sTitle': '发言条数',
                        'sClass': 'btn_viewuser text-left'
                    },{
                        'sTitle': '发言人数',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '群人数',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '直播小组人数',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '直播辅导加群比例',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '当日登录人数',
                        'sClass': 'btn_viewuser text-left'
                    }],
                    'aaData': DailyList
                });
                Statistic.groupDailysetPageBar();
                app.resize();
            }  //success
        });  //ajax
    }

    Statistic.groupDailysetPageBar = function(){
            var o = this.groupDailyopt;
            if(o.totalPage < 1){
                return;
            }
            //页码大于最大页数
            if(o.curPage > o.totalPage){
                o.curPage = o.totalPage;
            }
            //页码小于1
            if(o.curPage<1) {
                o.curPage=1
            }
            o.pageStr = '<ul class="pagination pagination-sm">';
            //如果是第一页
            if(o.curPage==1){
                o.pageStr += '<li class="disabled"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
            }else{
                o.pageStr += '<li class="prev"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
            }

            var len = o.totalPage > 5 ? 5 : o.totalPage;      //分页器如果大于五且curPage>=3 && <=总数-2时，始终保持在中间
            if (o.totalPage < 5) {
                for (var i = 1; i <= len; i++) {
                    var page = i;
                    var className = o.curPage == page ? 'active' : 'item';
                    o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                }
            } else {
                if (o.curPage >= 3 && o.curPage <= o.totalPage - 2) {
                    for (var j = 1; j <= len; j++) {
                        var page = o.curPage - 3 + j;
                        var className = o.curPage == page ? 'active' : 'item';
                        o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                    }
                } else {
                    for (var k = 1; k <= len; k++) {
                        console.log(o.curPage)
                        var page = o.curPage < 3 ? k : o.totalPage - 5 + k;
                        var className = o.curPage == page ? 'active' : 'item';
                        o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                    }
                }
            }

            //如果是最后页
            if(o.curPage >= o.totalPage){
                o.pageStr += '<li class="disabled"><a href="#"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>';
            }else{
                o.pageStr += '<li class="next"><a href="#"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>';
            }
            o.pageStr += '</ul>';
            $(o.pageBox).html(o.pageStr);
    }
    Statistic.groupDailycreateMod = function() {
        //创建群日报右侧整体模板
        var tpl = '';
        tpl += '<div class="panel-heading">';
        tpl += '    <div class="btn-group pull-right"><button type="button" class="btn btn-default btn-sm btn_goback"><i class="fa fa-arrow-circle-left fa-3"></i><b class="btn_title">返回</b></button></div>';
        tpl += '    <h5 class="text-center Daily-title" id="groupDaily_title"></h5>';
        tpl += '</div>';

        tpl += '<div class="panel-body users_form panel_content">';
        tpl += '  <div class="col-sm-12"  id="search_date">';
        tpl += '    <div class="col-sm-2 text-center"></div>';
        tpl += '    <div class="col-sm-7 text-center">';
        tpl += '      <div id="search_datetimepicker1" class="input-group date col-sm-5 pull-left">';
        tpl += '        <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>';
        tpl += '        <input type="text" data-date-format="YYYY-MM-DD" class="form-control" id="Daily_date1">';
        tpl += '      </div>';
        tpl += '      <h5 class="col-sm-2 pull-left">至</h5>';
        tpl += '      <div id="search_datetimepicker2" class="input-group date col-sm-5 pull-left">';
        tpl += '        <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>';
        tpl += '        <input type="text" data-date-format="YYYY-MM-DD" class="form-control" id="Daily_date2">';
        tpl += '      </div>';
        tpl += '    </div>';
        tpl += '    <div class="col-sm-3 text-center"> <div class="col-sm-6"><button type="button" class="btn btn-default  btn-block" id="btn_dateSearch"> 查询 </button></div></div>';
        tpl += '  </div>';
        tpl += '<div id="groupDaily_items"><table class="table table-hover users_items userlist"></table></div>';
        tpl += '<div class="col-sm-12" id="paginate-groupDailyMod"></div>';
        tpl += '</div>';

        //插入群日报外框架
        $('#content_message').hide();
        if ($('#groupDaily').length === 0) {
            $(app.box.content).append('<div id="groupDaily" class="panel panel-default h600 panel_list"></div>');
        }
        var box = $('#groupDaily');
        box.html(tpl).show().siblings('.panel_list').hide();
        //按照日期查询
        
        $('#search_datetimepicker1').datetimepicker({
            language: 'locale',
            pickTime: false,
            defaultDate : moment().subtract('days', 7).format('YYYY-MM-DD'),//开始日期默认时候是当前日期的7天前
            maxDate : moment().format('YYYY-MM-DD')
        });
         
        $('#search_datetimepicker2').datetimepicker({
            language: 'locale',
            pickTime: false,
            defaultDate : moment().subtract('days', 1).format('YYYY-MM-DD'),//结束日期默认时候是当前日期的前一天
            maxDate : moment().format('YYYY-MM-DD')
        });
    }

    //获取群周报列表
    Statistic.groupWeeklyopt = {
        pageStr: '',
        curPage: 1, //当前页
        total: 0, //总记录数
        pageSize: 10, //每页显示条数
        totalPage: 0,//总页数
        pageBox:'#paginate-groupWeeklyMod'
    }
    Statistic.groupWeeklyList = function(current) {
        $.ajax(app.url + '/WebRooms/getWeekStat', {
            data:{
                rid:app.roomid, //群id
                curpage:current || 1, //当前页
                perpage: Statistic.groupWeeklyopt.pageSize//每页显示条数
            },
            success:function(v){
                if(v.sign != 1){
                    alert(v.data);
                    return;
                }
                var WeeklyList = [];
                var vdata = v.data;

                 Statistic.groupWeeklyopt.curPage = current || 1;
                 Statistic.groupWeeklyopt.total = v.rows;
                 Statistic.groupWeeklyopt.totalPage = Math.ceil(Statistic.groupWeeklyopt.total/Statistic.groupWeeklyopt.pageSize);
                 //console.log('total:'+Statistic.groupWeeklyopt.total+'tpage:'+Statistic.groupWeeklyopt.totalPage)
                //群周报标题
                var WeeklyTitle = app.roomname +"周报";
                $('#groupWeekly_title').html(WeeklyTitle);
                //遍历资料数据
                $.each(vdata , function(Weeklynum,Weeklyinfo){

                    var info = Weeklyinfo;
                    //dataTable实例模板
                    var d = {
                        //'DT_RowId': 'row_' + info.id,  //横向id
                        'DT_RowClass': 'groupWeekly_item Weeklyitems', //横向class
                        '0': info.friday || '',  //日期
                        '1': info.msgnum || '',//周发言条数
                        '2': info.member || '',  //去重周发言人数
                        '3': info.speaknum || '', //日发言人数总和
                        '4': info.loginnum || '0' //本周登录人数
                    };
                    WeeklyList.push(d);
                });
                //dataTable插入表格
                // console.log(spaceList)
                $('#groupWeekly_items').html('').append('<table class="table table-hover users_items userlist"></table>');
                $('#groupWeekly_items table').dataTable({
                    'bRetrieve': true,
                    'bDestroy': true,
                    'bSort':false,
                    'bAutoWidth': false, // 禁止计算宽度
                    //'iDisplayLength': 10, // 每页显示数
                    'bInfo': false,  // 隐藏页数信息
                    'bFilter': false,  //搜索框
                    'bPaginate': false,  //取消分页器
                    'bLengthChange': false, // 禁用选择每页显示数
                    // 'bServerSide': false,
                    // 'bProcessing': true,
                    'sPaginationType': 'bootstrap',

                    // "sDom": '<"bottom"p>',
                    // "sDom": "<'dt-top-row'><'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
                    'aoColumns': [{
                        'sTitle': '日期',
                        'sClass': 'btn_viewuser text-left'
                    },{
                        'sTitle': '周发言条数',
                        'sClass': 'btn_viewuser text-left'
                    },{
                        'sTitle': '去重周发言人数',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '日发言人数总和',
                        'sClass': 'btn_viewuser text-left'
                    }, {
                        'sTitle': '本周登录人数',
                        'sClass': 'btn_viewuser text-left'
                    }],
                    'aaData': WeeklyList
                });
                Statistic.groupWeeklysetPageBar();
                app.resize();
            }  //success
        });  //ajax
    }

    Statistic.groupWeeklysetPageBar = function(){
            var o = this.groupWeeklyopt;
            if(o.totalPage < 1){
                return;
            }
            //页码大于最大页数
            if(o.curPage > o.totalPage){
                o.curPage = o.totalPage;
            }
            //页码小于1
            if(o.curPage<1) {
                o.curPage=1
            }
            o.pageStr = '<ul class="pagination pagination-sm">';
            //如果是第一页
            if(o.curPage==1){
                o.pageStr += '<li class="disabled"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
            }else{
                o.pageStr += '<li class="prev"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
            }

            var len = o.totalPage > 5 ? 5 : o.totalPage;      //分页器如果大于五且curPage>=3 && <=总数-2时，始终保持在中间
            if (o.totalPage < 5) {
                for (var i = 1; i <= len; i++) {
                    var page = i;
                    var className = o.curPage == page ? 'active' : 'item';
                    o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                }
            } else {
                if (o.curPage >= 3 && o.curPage <= o.totalPage - 2) {
                    for (var j = 1; j <= len; j++) {
                        var page = o.curPage - 3 + j;
                        var className = o.curPage == page ? 'active' : 'item';
                        o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                    }
                } else {
                    for (var k = 1; k <= len; k++) {
                        console.log(o.curPage)
                        var page = o.curPage < 3 ? k : o.totalPage - 5 + k;
                        var className = o.curPage == page ? 'active' : 'item';
                        o.pageStr += '<li class="' + className + '" data-page="' + page + '"><a href="javascript:void(0)">' + page + '</a></li>';
                    }
                }
            }

            //如果是最后页
            if(o.curPage >= o.totalPage){
                o.pageStr += '<li class="disabled"><a href="#"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>';
            }else{
                o.pageStr += '<li class="next"><a href="#"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>';
            }
            o.pageStr += '</ul>';
            $(o.pageBox).html(o.pageStr);
    }
    Statistic.groupWeeklycreateMod = function() {
        //创建群周报右侧整体模板
        var tpl = '';
        tpl += '<div class="panel-heading">';
        tpl += '    <div class="btn-group pull-right"><button type="button" class="btn btn-default btn-sm btn_goback"><i class="fa fa-arrow-circle-left fa-3"></i><b class="btn_title">返回</b></button></div>';
        tpl += '    <h5 class="text-center Weekly-title" id="groupWeekly_title"></h5>';
        tpl += '</div>';

        tpl += '<div class="panel-body users_form panel_content">';
        tpl += '<div id="groupWeekly_items"><table class="table table-hover users_items userlist"></table></div>';
        tpl += '<div class="col-sm-12" id="paginate-groupWeeklyMod"></div>';
        tpl += '</div>';

        //插入群周报外框架
        $('#content_message').hide();
        if ($('#groupWeekly').length === 0) {
            $(app.box.content).append('<div id="groupWeekly" class="panel panel-default h600 panel_list"></div>');
        }
        var box = $('#groupWeekly');
        box.html(tpl).show().siblings('.panel_list').hide();
    }

})()


