/**
 * 历史记录文件优化
 * @version 1.0
 * @anthor : DuXinli
 * @upload : 2015-4-23 by DuXinli
 */

/* [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ 华丽的分割线 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */

/**
 * fancybox
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 * http://fancyapps.com/fancybox/#docs
 * cn : http://xufukun.com/tools/fancybox2/index.html
 */
app.isfirefox = /firefox/g.test(navigator.userAgent.toLowerCase());
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

/* <<<<<<<<<<<<<<<<<<<<<<<<<<< 业务相关 >>>>>>>>>>>>>>>>>>>>>>>>>>>>> */


/**
 * 替换内容--接收的时候转义回来方法
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



/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[ 群管理部分 ]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/**
 * 移出群方法
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
            }else{
                $('.btn_kick,.btn_ban,.user_gold_item').remove();
                $('.userstate').text('(此用户已不在该群)');
            }
        }
    });
};

/**
 * 禁言方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.banUser = function(user,day) {
    $.ajax(app.url + '/WebRooms/banUser', {
        data: {
            username: user, //申请人账号
            rid: app.roomid, //申请加入群ID
            days: day //禁言天数 1 or 7 or永久
        },
        success: function(v) {
            if (v.sign != 1) {
                alert(v.data);
            }else{
                $('.btn_ban').removeClass('btn-default').addClass('btn-warning').removeClass('btn_ban').addClass('btn_unban').text('解禁');
                $('#banSelectDateBg').hide();
            }

        }
    });
};

/**
 * 解禁方法
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
            }else{
                $('.btn_unban').removeClass('btn-warning').addClass('btn-default').removeClass('btn_unban').addClass('btn_ban').text('禁言');
            }
        }
    });
};

/**
 * 查看用户资料方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
app.getUserInfo = function(user, rid, tp) {
    $.ajax(app.url + '/WebRooms/seeUserInfo', {
        data: {
            username: user, //申请人账号
            rid: rid || $.cookie('app_roomid') || app.roomid //申请加入群ID
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
             * @type {string}
             */
            var btnGroup = '', kickText = '', BtnselectDate = '';
            if ((app.usertype == 2 || app.usertype == 3) && v.role !== 1 && v.controller ==1) {
                if (v.isRoomUser != 1) {
                    btnGroup = '';
                    BtnselectDate = '';
                    kickText = '(此用户已不在该群)';
                } else {

                    if (d.speakstate) {
                        btnGroup = '<a type="button" href="javascript:void(0);" class="btn btn-warning btn-xs btn_unban pull-right" data-loading-text="Loading...">解禁</a>';
                    } else {
                        btnGroup = '<a type="button" href="javascript:void(0);" class="btn btn-default btn-xs btn_ban pull-right" data-loading-text="Loading...">禁言</a>';
                    }
                    if(app.usertype == 2){
                        btnGroup += '<a type="button" class="btn btn-default btn-xs btn_kick pull-right" data-loading-text="Loading...">移出</a>';
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
            tpl += '<div class="panel panel-default userinfo_dialog roomuser_item" data-userid="' + user + '" data-roomid="' + (rid || app.roomid) + '" style="margin-bottom:0;min-height:240px;">';
            tpl +=      '<div class="panel-heading"><p class="btn-group pull-right"><a href="javascript:app.win.close();" class="btn btn-default btn-xs pull-right">关闭</a> '+ btnGroup + '</p> 用户详细资料 <span clas="userstate">'+ kickText +'</span>'+BtnselectDate+'</div>';
            tpl +=      '<div class="panel-body">';
            tpl +=          '<div class="panel-right">';
            if (d.himgbig) {
                tpl +=          '<div class="room_userpic pull-right"><a href="' + d.himgbig + '" target="_blank"><img class="img-rounded img-thumbnail" data-url="' + d.himgbig + '" alt="" src="' + d.himgbig + '"></a></div>';
            }
            tpl += '        </div>';

            tpl += '        <form class="form-horizontal" role="form">';
            tpl += '            <div class="form-group">';
            tpl += '                <label class="col-sm-2 control-label">家长会昵称</label>';
            tpl += '                <div class="col-sm-10"><p class="form-control-static">' + d.nickname + '</p></div>';
            tpl += '            </div>';
            tpl += '            <div class="form-group">';
            tpl += '                <label class="col-sm-2 control-label">账号</label>';
            tpl += '                <div class="col-sm-10"><p class="form-control-static">' + user + '</p></div>';
            tpl += '            </div>';
            tpl += '            <div class="form-group">';
            tpl += '                <label class="col-sm-2 control-label">账号类别</label>';
            tpl += '                <div class="col-sm-10"><p class="form-control-static">' + (d.type == 2 ? '学科' : (d.type == 3 ? '老师' : '用户')) + '</p></div>';
            tpl += '            </div>';
            tpl += '            <div class="form-group">';
            tpl += '                <label class="col-sm-2 control-label">用户等级</label>';
            // tpl += '                <div class="col-sm-10"></div>';
            tpl += '                <div class="col-sm-10">';
            tpl += '                    <p class="form-control-static user_exp">' + d.stulevel + ' (' + d.levelname + ') ';
            tpl += '                    </p>';
            tpl += '                </div>';
            tpl += '            </div>';
            // 发金币
            if((v.goldType == 1 || v.goldType == 2) && !rid && v.isRoomUser == 1){
                tpl += '            <div class="form-group user_gold_item">';
                tpl += '                <label class="col-sm-2 control-label">金币</label>';
                tpl += '                <div class="col-sm-10">';
                tpl += '                    <div class="form-control-static user_gold">';
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
                tpl += '                </div>';
                tpl += '                ';
                tpl += '            </div>';
            }

            if (d.gradename) {
                tpl += '            <div class="form-group">';
                tpl += '                <label class="col-sm-2 control-label">当前年级</label>';
                tpl += '                <div class="col-sm-10"><p class="form-control-static">' + d.gradename + '</p></div>';
                tpl += '            </div>';
            }
            if (d.areaname) {
                tpl += '            <div class="form-group">';
                tpl += '                <label class="col-sm-2 control-label">省份</label>';
                tpl += '                <div class="col-sm-10"><p class="form-control-static">' + d.areaname + '</p></div>';
                tpl += '            </div>';
            }
            if (d.cityname) {
                tpl += '            <div class="form-group">';
                tpl += '                <label class="col-sm-2 control-label">城市</label>';
                tpl += '                <div class="col-sm-10"><p class="form-control-static">' + d.cityname + '</p></div>';
                tpl += '            </div>';
            }
            if (app.usertype == 2) {
                tpl += '            <div class="form-group">';
                tpl += '                <label class="col-sm-2 control-label">电话</label>';
                tpl += '                <div class="col-sm-10"><p class="form-control-static">' + d.mobile + '</p></div>';
                tpl += '            </div>';
                tpl += '            <div class="form-group">';
                tpl += '                <label class="col-sm-2 control-label">所属群</label>';
                tpl += '                <div class="col-sm-10"><p class="form-control-static">' + d.joinRoom + '</p></div>';
                tpl += '            </div>';
            }
            tpl += '        </form>';
            tpl += '    </div>';
            tpl += '</div>';

            var scroll_top = 0;
            
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
                beforeLoad:function(){
                    $('body').css('overflow','hidden');
                    if(app.isfirefox){
                       scroll_top = $(window).scrollTop(); 
                    }   
                },
                afterClose:function(){
                    $('body').css('overflow','visible');
                    if(app.isfirefox){
                        setTimeout(function(){
                            $(window).scrollTop(scroll_top);
                        },300)
                    }       
                },
                helpers: {overlay: {css: {}}}
            });
        }
    });
};

/**
 * 加金币方法
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
 * 语音相关方法
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
        return this;
    };
    audio.clear = function(id){
        this.id = null;
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


/* [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ 事件绑定 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */

$(function() {

    /**
     * 图片预览插件：http://fancyapps.com/fancybox
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    var pic_scroll_top = 0;
    $(".fancybox-button").fancybox({
    	wrapCSS: 'imgreview',
        prevEffect: 'none',
        nextEffect: 'none',
        closeBtn: true,
        beforeLoad:function(){
            $('body').css('overflow','hidden');
            if(app.isfirefox){
                pic_scroll_top = $(window).scrollTop(); 
                }   
            },
        afterClose:function(){
                $('body').css('overflow','visible');
                if(app.isfirefox){
                    setTimeout(function(){
                         $(window).scrollTop(pic_scroll_top);
                    },300)
                }       
            },
        afterLoad : function(){

        	var tpl = '<div class="imgreview_toolbar" style="display:none;">'
        			+ 	'<a href="javascript:void(0);" class="view_bigimg text-muted" target="_blank"><i class="fa fa-external-link"></i>查看大图</a>'
        			+ 	'<a href="javascript:void(0);" class="rotate_left text-muted"><i class="fa fa-undo"></i>向左转</a>'
        			+ 	'<a href="javascript:void(0);" class="rotate_right text-muted"><i class="fa fa-repeat"></i>向右转</a>'
        			+ '</div>';
        	$('.fancybox-outer').prepend(tpl);
        	setTimeout(function(){
        		
        		var img = $('.imgreview .fancybox-image');
	        	img.attr('id','imgview');
	        	$('.imgreview .view_bigimg').attr('href', img.attr('src'));
				// 计算图片旋转后偏移的差值
	        	var num = Math.abs((img.height() / 2) - (img.width() / 2));

	        	app.imgtoolbar.param = {
					right: $('.imgreview .imgreview_toolbar .rotate_right'),
					left: $('.imgreview .imgreview_toolbar .rotate_left'),
					img: $('#imgview'),
					width : $('#imgview').width(),
					height : $('#imgview').height(),
					num : num,
					rot: 0
				};;
        	}, 10);
        }
    });

	$('body').on('mouseover', '.imgreview', function(){
		$('.imgreview_toolbar').show();
	});
	$('body').on('mouseout', '.imgreview', function(){
		$('.imgreview_toolbar').hide();
	});
	
    /**
     * 图片旋转工具条事件
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
	$('body').on('click','.imgreview .imgreview_toolbar .rotate_right', function(){
		var toolbar = app.imgtoolbar;
		toolbar.right();
		$(this).blur();
		var opt = toolbar.param;
		var rot = opt.rot;
		var img = opt.img;
		var w = 0, h = 0, l = 0, t = 0;
		if(rot == 1 || rot == -1){
			w = opt.height;
			h = opt.width;
			// 当 宽度 > 高度的时候 left偏移为负数
			l = (opt.width > opt.height) ? -(opt.num) : opt.num;
			// 当高度 > 宽度的时候 top 偏移为负数
			t = (opt.height > opt.width) ? -(opt.num) : opt.num;
		}else{
			w = opt.width;
			h = opt.height;
			l = 0;
			t = 0;
		}
		img.css({
			width : opt.width,
			height : opt.height,
			left : l,
			top : t
		});
		var top = Math.abs((img.height() / 2) - (img.width() / 2));
		img.wrap('<div class="imgreview_wrap"></div>');
		img.parent().css({
			width : w,
			height : h
		});
		img.parents('.fancybox-inner').css({
			width : w,
			height : h
		});
		img.parents('.fancybox-wrap').width(w+30);
		$.fancybox.reposition();

		return false;
	});
	$('body').on('click', '.imgreview .imgreview_toolbar .rotate_left', function(){
		var toolbar = app.imgtoolbar;
		toolbar.left();
		$(this).blur();
		var opt = toolbar.param;
		var rot = opt.rot;
		xue.log(rot);
		var img = opt.img;
		var w = 0, h = 0, l = 0, t = 0;
		if(rot == 1 || rot == -1){
			w = opt.height;
			h = opt.width;
			l = (opt.width > opt.height) ? -(opt.num) : opt.num;
			t = (opt.height > opt.width) ? -(opt.num) : opt.num;
		}else{
			w = opt.width;
			h = opt.height;
			l = 0;
			t = 0;
		}
		img.css({
			width : opt.width,
			height : opt.height,
			left : l,
			top : t
		});
		img.wrap('<div class="imgreview_wrap"></div>');
		img.parent().css({
			width : w,
			height : h
		});
		img.parents('.fancybox-inner').css({
			width : w,
			height : h
		});
		img.parents('.fancybox-wrap').width(w+30);
		$.fancybox.reposition();

		return false;
	});

     
    /**
     * 查看用户信息事件
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    $('body').off('click', '.btn_viewuser').on('click', '.btn_viewuser', function() {
        var that = $(this),
            data = that.parents('.roomuser_item').data();
        var par = that.parents('.roomuser_item');
        var userid = data.id || par.attr('id');
        userid = userid.replace('row_', '');
        var uid = data.id || userid;
        uid = uid.replace('\\40','@');
        if (uid) {
            app.getUserInfo(uid, data.rid || null);
        }
    });

    /**
     * 绑定音频播放事件
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    $('body').on('click', '.msg-audio', function() {

        var that = $(this),
            from = that.parents('.msg-list'),
            url = that.data('url'),
            id = from.attr('mid'),
            act = that.hasClass('active') ? true : false;
            if(app.audio.id){
                app.audio.stop();
                if(act){
                    return false;
                }
            }
            app.audio.dom = that;
            app.audio.id = id;
            app.audio.url = url;
            app.audio.create(id, url).play();
    });

    // ----------------------- 用户管理部分 ---------------------- //
    
    /**
     * 显示禁言时长区域事件
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    $('body').on('click', '.btn_ban', function() {
        $('#banSelectDateBg').show();
    });
    
    /**
     * 禁言事件
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    $('body').on('click', '.btn_selectdate', function() {
        var that = $(this),
            item = that.parents('.roomuser_item'),
            days = that.text(),
            data = item.data();
            if (days=="1天"||days=="7天") {
                days = parseInt(days);
            }else if (days=="永久") {
                days = '-1';
            }else{
                return;
            };

       if (data.userid) {
            app.banUser(data.userid,days);
        }
    });

    /**
     * 解禁事件
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    $('body').on('click', '.btn_unban', function() {
        var that = $(this),
            item = that.parents('.roomuser_item'),
            data = item.data();
        if (data.userid) {
            app.unbanUser(data.userid);
        }
    });

    /**
     * 移出事件
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    $('body').on('click', '.btn_kick', function() {
        var that = $(this),
            item = that.parents('.roomuser_item'),
            data = item.data();
        var con = window.prompt('请填写移出的理由');
        if (con) {
            if (data.userid) {
                app.kickUser(data.userid, con);
            }
        }
    });
     
    /**
     * 发金币事件
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    $('body').on('click', '.userinfo_dialog .add_gold_btn', function(){
        var parents = $(this).parents('.userinfo_dialog');
        var user = parents.data('userid'),
            room = parents.data('roomid') || app.roomid,
            val  = parents.find('.add_gold_val:visible').val();
        app.addGoldByAdmin(user, room, val);
    });
});

app.imgtoolbar = {};
(function(){
	var imgbar = app.imgtoolbar;
	imgbar.param = {
		right: $('.imgreview .imgreview_toolbar .rotate_right'),
		left: $('.imgreview .imgreview_toolbar .rotate_left'),
		img: $('#imgview'),
		rot: 0
	};
	imgbar.right = function(){
		this.param.rot +=1;
		if(this.param.rot > 2){
			this.param.rot = -1;	
		}
		this.param.img[0].className = "rot"+this.param.rot;
	};
	imgbar.left = function(){
		this.param.rot -=1;
		if(this.param.rot < -1){
			this.param.rot = 2;	
		}
		this.param.img[0].className = "rot"+this.param.rot;
	};
})();




/* ===================== 历史记录显示部分 ======================== */

/**
 * 历史记录显示方法
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
$(function () {
	var app_params = app.ls.get();
    $.extend(app, app_params);
    $('.history_roomname').text($.cookie('app_roomname') || app.roomname);
    $('#datetimepicker2').datetimepicker({
        language: 'locale',
        pickTime: false,
        defaultDate : moment().format('YYYY-MM-DD'),
        minDate : moment().subtract(6, 'days').format('YYYY-MM-DD'),
        maxDate : moment().format('YYYY-MM-DD')
    }).change(function(){
    	app.history.get();
    });
    app.history.get();
    $('#pagecount').on('click', 'li.item', function(){
    	var p = $(this).data('page');
    	if(p){
    		app.history.get(p);
    		$(this).removeClass('item').addClass('active');
    		$(this).siblings('li').removeClass('active');
    	}
    });
    $('#pagecount').on('click', 'li.prev', function(){
    	var that = $(this), eq = that.parent().find('li.active').index();
    	if(eq){
    		app.history.get(eq-1);
    	}
    });
    $('#pagecount').on('click', 'li.next', function(){
    	var that = $(this), eq = that.parent().find('li.active').index();
    	if(eq){
    		app.history.get(eq+1);
    	}
    });
});
app.history = {};
(function(){
	var h = app.history;
	h.opt = {
		pageStr : '',
		curPage : 1, //当前页
		total : null, //总记录数
		pageSize : null, //每页显示条数
		totalPage : null, //总页数
		date : null, // 查询的日期
		lasttime : null	// 最后发布的时间
	};
	/**
	 * 地址：http://www.jzh.com/WebRooms/getMsg
	 * 参数：
		rid        群ID
		curpage    第几页
		stime      时间
	 * 返回:
	 		{
				"sign": 1,	// 1：正常; 2：退出；0：错误
				"rows": 6,	// 总条数
				"perpage": 2, // 每页条数
				"pages": 3, // 总页数
				"data": [
					"92<-.->marco\\40100tal.com<-.->\u6b66\u6770\u8001\u5e08<-.-><-.->1415684791416<-.->user<-.->img<-.->1415684791416<-.->http:\/\/r04.xesimg.com\/roommsg\/32c9fd7baad4395d5d577214fa7c484f_small.jpg<:>http:\/\/x03.xesimg.com\/roommsg\/32c9fd7baad4395d5d577214fa7c484f_big.jpg<-.->\u8001\u5e08",
					"903<-.->jeffjzh9\\40125.com<-.->\u6d4b\u8bd5\u8001\u5e08<-.-><-.->1415684795416<-.->user<-.->voice<-.->1415684795416<-.->http:\/\/x03.xesimg.com\/jzh_audio\/2014\/10\/23\/14140546072044.mp3<:>2<-.->\u8001\u5e08"
				]
			};
	 */
	h.get = function(cur){
		var o = this.opt;
		var curpage = cur || 1;
		var ajaxData = {
			rid    :  this._getRoomID(),  // 群ID      92
			curpage  :  curpage, // 第几页    
			stime    :  this._getDate() // 时间     2014-11-11
		};
		$.ajax(app.url + '/WebRooms/getMsg', {
			data: ajaxData,
			success: function(s) {
				if(s.sign == 2){
					alert(s.data);
					window.location.href = app.url;
					return;
				}
				if (s.sign != 1) {
					alert(s.data);
					return;
				}
				o.curPage = curpage;
				o.total = s.rows;
				o.pageSize = s.perpage;
				o.totalPage = s.pages;
				h._setPageBar();
				h.setDom(s.data);
			}
		});
		return;
	};
	h.setDate = function(){
		h.opt.date = h._getDate();
		return h.opt.date;
	};
	
	// 获取查询的历史记录日期
	h._getDate = function(){
		var todays = $('#history_date').val() || moment().format('YYYY-MM-DD');
		return todays;
	};
	// 获取房间ID
	h._getRoomID = function(){
		var rid = $.cookie('app_roomid') || app.roomid || 92;
		return rid;
	};
	// 设置分页
	h._setPageBar = function(){
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
//		o.pageStr = "<span>共"+o.total+"条</span><span>"+o.curPage+"/"+o.totalPage+"</span>";
		o.pageStr = '<ul class="pagination pagination-sm">';
//		o.pageStr += '<ul class="pagination pagination-sm">';
		//如果是第一页
		if(o.curPage==1){
//			o.pageStr += "<span>首页</span><span>上一页</span>";
			o.pageStr += '<li class="disabled"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
		}else{
//			o.pageStr += "<span><a href='javascript:void(0)' rel='1'>首页</a></span><span><a href='javascript:void(0)' rel='"+(o.curPage-1)+"'>上一页</a></span>";
			o.pageStr += '<li class="prev"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
		}
		for(var i=0,len = o.totalPage; i < len ; i++){
			var page = i+1;
			if(o.curPage == page){
				o.pageStr += '<li class="active"><a href="#">' + page + '<span class="sr-only">(current)</span></a></li>';
			}else{
				o.pageStr += '<li class="item" data-page="'+ page +'"><a href="#">' + page + '</a></li>';
			}
		}
		//如果是最后页
		if(o.curPage >= o.totalPage){
//			o.pageStr += "<span>下一页</span><span>尾页</span>";
			o.pageStr += '<li class="disabled"><a href="#"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>';
		}else{
//			o.pageStr += "<span><a href='javascript:void(0)' rel='"+(parseInt(o.curPage)+1)+"'>下一页</a></span><span><a href='javascript:void(0)' rel='"+o.totalPage+"'>尾页</a></span>";
			o.pageStr += '<li class="next"><a href="#"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>';
		}
		o.pageStr += '</ul>';
		$("#pagecount").html(o.pageStr);
	};
	// 设置历史记录内容
	h.setDom = function(data){
		var box = $('.message_history');
		if (data.length < 1) {
			box.html('暂无内容');
			return;
		}
        try{

          app.usercode = app.ls.get("usercode");

        }catch(e){
            //alert(e);

        }  
        var msginfo = '',
            msghead = '',
            nickname = '',
            cls = 'color-default',
            tpCls = 'msg-list-default',
            msgCls = 'alert-info',
            voice = null,
            avatar = '',
            lasttime = null,
            levelName = '';
        box.html('');        
		$.each(data, function(k, v) {
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
            if(v.contentType == Protocol.Message.ContentType.PACKAGE_MSG_CONTENT_AUDIO){//语音消息
               voice = v.audioMessageBody;
               avatar = voice.headImg;
               levelName = voice.levelName;
               nickName = voice.nickName;
            }
            var fromuser = v.fromId;
            if (fromuser == app.username) {
                nickname = '我';
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
            
            avatar = avatar || app.path.img +'/defult_head_img.png';

            // 增加聊天时间
            var msgtime = xue.date('m月d日 H:i', v.sendTime / 1000);
            var time_new = parseInt(v.sendTime / 1000 / 60);


            if (lasttime) {
                var last_time = parseInt(lasttime / 1000 / 60);
                var time_isnew = time_new > last_time ? true : false;
                if (time_isnew) {
                    msginfo += '    <p class="msg-time" data-time="' + v.sendTime + '"> ' + msgtime + ' </p>';
                }
            } else {
                msginfo += '    <p class="msg-time" data-time="' + v.sendTime + '"> ' + msgtime + ' </p>';
            }
            
            lasttime = v.sendTime;


            msginfo += '<div mid="' + v.sendTime + '" class="msg-list ' + tpCls + '" data-time="' + v.sendTime + '">';
            
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
            msginfo +=     '</div>';
		});

		box.html(msginfo);

        // 替换报名链接，后面追加用户加密串及家长会标示符
        var signup = box.find('a.msg_links');
        if(signup.length > 0){
            signup.each(function(){
                var a = $(this), links = a.attr('href');
                if(links.indexOf('xueersi.com/AxhSignup/detail/')>=0){
                    a.attr('href',links + '/'+ app.usercode +'/1');
                }
            });
        }

        if(h.opt.curPage === 1){
            setTimeout(function(){
                $(window).scrollTop(0);
            }, 100);
        }
	};
})();

