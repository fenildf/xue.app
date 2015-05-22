
/* [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ 事件绑定 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */

$(function() {
    $('body').append('<div id="debug_box" class="" style="display:none;"></div>');
    $('#skin_bg').removeClass().addClass('skin_12');
    //刷新页面删除锁定cookie
    $.removeCookie('LockedRoom');

    try {
         var sessid = $.cookie('app_sessid');
         var version = $.cookie('app_version');
        // 如果存在sessid && version则直接重连服务器
        if (sessid && (version||version == 0)) {
            app.Websocket.onConnected(sessid,version);
        } else {
             /**
              ****判断是否记住用户名
              **/
             app.historyusername = '';
             app.historychecked = '';
             
             try{
               var usernamelocalstorage = $.LS.get("username");
               if(usernamelocalstorage && usernamelocalstorage!='null'){
                     app.historyusername = usernamelocalstorage;
                     app.historychecked = 'checked';
               } 

            }catch(e){

            }
            var loginbar = app.tpl.loginbar.replace('$historyusername$', app.historyusername).replace('$historychecked$', app.historychecked);
            $(app.box.loginbar).html(loginbar);
        }
       
    } catch (e) {
        alert(e);
    }

    // 获取验证码
    changeVerificationImg('codeimg');

    //切换验证码
    $('body').on('click', '.change_codeimg', function() {
        changeVerificationImg('codeimg');
    });

    //点击登录按钮登录
    $('body').on('click', app.btn.login, function() {
        app.login();
    });

    // 回车登录
    $('body').on('keydown', app.box.username + ',' + app.box.password + ',' + app.box.imgcode, function(v) {
        if (v.keyCode == 13) {
			app.login();
        }
    });

    // 房间列表点击事件
    $(app.box.roomlist).on('click', '.roomitem', function() {
        var that = $(this),
            id = that.data('roomid');
        $('#roomtitle').text(that.find('.roomtitle').text());
        that.addClass('list-group-item-info').siblings('.roomitem').removeClass('list-group-item-info');

        // 取消新消息的小红点
        that.find('.room_newmsg').removeClass('new_tips').text(0).hide();
        app.roomname = that.find('.roomtitle').text();
        app.ls.set('roomname', app.roomname);
        app.ls.set('roomid', id);
        app.Websocket.checkInRoom(id);
        // 设置title全部新消息数
        app.setAllNewNumber();
        
    });

    // 获取房间历史消息
    $(app.btn.history).on('click', function() {
        app.getHistory();
    });


    // 发送按钮点击事件
    $(app.btn.send).click(function() {
        if(app.roomlist[app.roomid].speakstate === 1){
            return false;
        }
        app.sendMessage();
    });

    // 回车发送
    $(app.box.textarea).on('keydown', function(eve) {
        var that = $(this);
        var v = eve || window.event;
        if (v.keyCode == 13 && v.shiftKey) {
            var _val = that.val();
            _val += '\r\n';
            that.val(_val);
        } else if (v.keyCode == 13) {
            app.sendMessage();
            setTimeout(function() {
                that.height(20);
            }, 1);
            return false;
        }

    });

    // 表情按钮
    $(app.btn.emotes).popover({
        placement: 'top',
        html: true,
        trigger: 'click',
        title: '',
        content: function(a) {
            if(app.roomlist[app.roomid].speakstate === 1){
                return false;
            }
            return app.emote.getHtml();
        }
    });
    $(app.btn.emotes).on('show.bs.popover', function() {
        $(app.btn.images).popover('hide');
    });
    $(app.btn.images).on('show.bs.popover', function() {
        $(app.btn.emotes).popover('hide');
    });

    // 点击表情图标
    $(app.box.sendfrom).on('click', '.con_foot_btns .emote_item', function() {
        var k = $(this).data('key'),
            input = $(app.box.textarea);
        pos = getCursortPosition(input[0]);
        s = input.val();
        var v = s.substring(0, pos) + '[e]' + k + '[/e]' + s.substring(pos);
        input.val(v);
        input.focus();
        $(app.btn.emotes).popover('hide');
    });

    // 鼠标移入弹出层，取消body绑定的隐藏pop事件
    $('.popover').on('mouseover', function() {
        $(document).off('mousedown');
    });

    // 鼠标移出弹出层，绑定body点击时隐藏pop的事件
    $('.popover').on('mouseout', function() {
        $(document).on('mousedown', function() {
            app.hidePopover(ev);
        });
    });

    // 绑定body点击时隐藏pop的事件
    $(document).on('mousedown', function(ev) {
        app.hidePopover(ev);
    });

    //锁定房间信息
    $('body').on('click','#LockedRoom',function(){
         var flag = $(this).attr('flag');
         if(flag == '0'){
            $(this).text('解锁');
            $.cookie('LockedRoom','Locked');
            $(this).attr('flag','1');
         } else if(flag == '1'){
            $(this).text('锁定');
            $.removeCookie('LockedRoom');
            $(this).attr('flag','0');
         }

    })

    // 点击图片上传
    $(app.box.sendfrom).on('change', '#fileToUpload', function() {
        if(app.roomlist[app.roomid].speakstate === 1){
            return false;
        }
        app.ajaxFileUpload();
    });

    $(app.btn.images).on('mouseover', function() {
        if(app.roomlist[app.roomid].speakstate === 1){
            return false;
        }
        if ($(this).next('#fileToUpload').length === 0) {
            $(this).after('<input id="fileToUpload" type="file" size="45" name="img" accept="image/*" />');
        }
    });

    // 左侧底部按钮切换
    $('.side_button .btn').on('click', function() {
        var that = $(this),
            tar = that.data('target');
        that.removeClass('btn-default').addClass('btn-primary').siblings('.btn').removeClass('btn-primary').addClass('btn-default');
        $(tar).fadeIn('fast');
        $(tar).siblings('.side_collapse').hide();
    });


    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<[ 群管理部分 ]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

    // 右侧头部“群成员”按钮点击
    $(app.btn.users).on('click', function() {
        $('#groupUsers').empty();
        app.getRoomUsers();
    });

	// 查看群公告列表
    $('body').on('click', '#btn_notices', function(){
        xue.log(!app.roomid);
        if(!app.roomid){
            return false;
        }
        app.getNoticeList();
    });

    // 查看群公告
    $('body').on('click', '.btn_notice_add', function(){
    	app.getNotice();
    });
	
	$('body').on('click', '.btn_notice_submit', function(){
		app.addNotice()
	});
    
	$('#content_message').on('click', '.btn_notice_close', function(){
		$(this).parent().hide();
	});

    
    // -----------------------  用户管理部分  ---------------------- //
    
    // 显示禁言时长区域
    $('body').on('click', '.Photo_btn_ban', function() {
             $('#banSelectDateBg').show();
    });

    //禁言
    $('body').on('click', '.btn_selectdate', function() {
      
        var that = $(this),
            item = that.parents('.Photoroomuser_item'),
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
            app.PhotobanUser(data.userid,data.nickname,days);
        }
    });

    // 解禁
    $('body').on('click', '.Photo_btn_unban', function() {
        var that = $(this),
            item = that.parents('.Photoroomuser_item'),
            data = item.data();
        if (data.userid) {
            app.PhotounbanUser(data.userid);
        }
    });

    // 移出
    $('body').on('click', '.Photo_btn_kick', function() {
        var that = $(this),
            item = that.parents('.Photoroomuser_item'),
            data = item.data();
        var con = window.prompt('请填写移出的理由');
        if (con) {
            if (data.userid) {
                app.PhotokickUser(data.userid, con);
            }
        }
    });

    // ----------------------- 群成员部分 ---------------------- //
	
    // 禁言选择日期
    $(app.box.content).on('click', '.btn_ban', function() {
        var that = $(this),
            item = that.parents('tr.roomuser_item'),
            data = item.data();
        var userid = item.attr('id');
        var datainfo = data.id || userid;
        var nickname = item.find('td').eq(1).text();
        var userAccounts = item.find('td').eq(0).text();
        app.banUserDate(datainfo,userAccounts,nickname);
    });

    // 禁言
    $('body').on('click', '.btn_banDate', function() {
        var that = $(this),
            item = that.parents('.banUser_SelectDate');
        var userid = item.attr('id');
        userid = userid.replace('row_', '');
        var days = item.find('input.SelectDate:radio:checked').val();
         if (days=="1天"||days=="7天") {
                days = parseInt(days);
         }else if (days=="永久") {
                days = '-1';
         }else{
             alert("请选择禁言日期!");
             return;
         };
        if (userid) {
            app.banUser(userid,days);
            app.win.close();
        }
    });

    // 解禁
    $(app.box.content).on('click', '.btn_unban', function() {
        var that = $(this),
            item = that.parents('tr.roomuser_item'),
            data = item.data();
        var userid = item.attr('id');
        userid = userid.replace('row_', '');
        if (data.id || userid) {
            app.unbanUser(data.id || userid);
        }
    });

    // 移出
    $(app.box.content).on('click', '.btn_kick', function() {
        var that = $(this),
            item = that.parents('tr.roomuser_item'),
            data = item.data();
        var con = window.prompt('请填写移出的理由');
        if (con) {
            var userid = item.attr('id');
            userid = userid.replace('row_', '');
            if (data.id || userid) {
                app.kickUser(data.id || userid, con);
            }
        }
    });

    // 点击筛选按钮
    $(app.box.content).on('click', '.btn_search_user', function() {
        var val = $('.input_search_user').val();
        app.tempSearchUserName = val;
        app.getRoomUsers(val);
    });

    // 筛选用户框中回车提交
    $(app.box.content).on('keydown', '.input_search_user', function(e) {
        if (e.keyCode == 13) {
            app.getRoomUsers();
        }
    });

    // 添加群成员
    $(app.box.content).on('click', '.btn_adduser', function() {
        var username = window.prompt('如需添加多个成员，账号请用英文逗号隔开');
        if (username) {
            app.addRoomUser(username);
        } else if (username !== null) {
            alert('请输入正确的用户名');
        }
    });

    // 加群申请列表中的申请状态筛选
    $(app.box.content).on('click', '.btn_search_apply', function() {
        var that = $('#applyUsers').find('.apply_type'),
            tp = that.val();
        app.getApplyList(tp);
    });

    // 通过
    $(app.box.content).on('click', '.btn_through', function() {
        var that = $(this),
            item = that.parents('tr'),
            data = item.data();
        app.throughApply(data.name, data.rid);
    });

    // 拒绝
    $(app.box.content).on('click', '.btn_refuse', function() {
        var that = $(this),
            item = that.parents('tr'),
            data = item.data();
        var con = window.prompt('请填写拒绝的理由');
        if (con) {
            app.refuseApply(data.name, data.rid, con);
        }
    });



    // 所有的返回操作：显示聊天界面，隐藏当前操作界面
    $(app.box.content).on('click', '.btn_goback', function() {
        var that = $(this), target = that.data('target');
        var msgbox = target ? $(target) : $('#content_message');

        msgbox.show().siblings('.panel').hide();
    });

    // 关闭房间对话框
    $(app.box.content).on('click', '.btn_close', function() {
        $(app.box.content).hide();
    });

    // 退出
    $('body').on('click', app.btn.logout, function() {
        if (window.confirm('确认退出家长会网页版？')) {
            $('body').append('<div class="fullmask"></div>');
            $('.fullmask').height($('body,html').height());
            app.logout();
        }
    });
    
    // 图片预览插件：http://fancyapps.com/fancybox
    $(".fancybox-button").fancybox({
    	wrapCSS: 'imgreview',
        prevEffect: 'none',
        nextEffect: 'none',
        closeBtn: true,
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
	 * 图片旋转工具条
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

    // 查看用户信息
    $('body').on('click', '.btn_viewuser', function() {
        var that = $(this);
        var roomuser_item_num = parseFloat(that.parents('.roomuser_item').size());
        if (roomuser_item_num>0) {
            var data = that.parents('.roomuser_item').data();
            var par = that.parents('.roomuser_item');
            var msgusername = '';
            if (that.closest('.msg-list').size()>0) {
                  msgusername = that.closest('.msg-list').find('.msg-username').html().replace(':', '')
            };
            //判断是点头头像查看资料还是点击群成员表格查看资料
            var tableclick = 0;
            if (that.closest('#message_box').size()>0) {
                 tableclick = parseInt(that.closest('#message_box').size());
            };
            var userid = data.id || par.attr('id');
            userid = userid.replace('row_', '');
            var uid = data.id || userid;
            uid = uid.replace('\\40','@');
            if (uid) {
                app.getUserInfo(uid, data.rid || null, msgusername, tableclick);
            }
        };
        
    });

    // 点击用户姓名后在输入框中插入@此用户
    $(app.box.content).on('click', '.msg-username', function(){
        var val = $(this).html();
        val = '@'+val.replace(':','');
        var input = $(app.box.textarea),
        pos = getCursortPosition(input[0]),
        s = input.val();
        if(s.indexOf(val) >=0){
            input.focus();
            return;
        }
        input.focus();
        
        var v = s.substring(0, pos) + val + ' ' + s.substring(pos);
        input.val(v);
        input.focus();
    });

    // 打开（折叠）换肤功能区
    $('body').on('click', '.style_handle', function() {
        var box = $('#style_list'),
            that = $(this);
        if (box.hasClass('style_hide')) {
            box.animate({
                right: 0
            }, 'normal', function() {
                box.addClass('style_show').removeClass('style_hide');
                that.html('<i class="glyphicon glyphicon-chevron-right"></i>');
            });
        } else {
            box.animate({
                right: -96
            }, 'normal', function() {
                box.addClass('style_hide').removeClass('style_show');
                that.html('<i class="glyphicon glyphicon-chevron-left"></i>');
            });
        }
    });

    // 点击换肤
    $('body').on('click', '#style_list .style_item', function() {
        var that = $(this),
            box = $('#skin_bg'),
            val = that.data('val');
        box.removeClass().addClass(val);
    });

    // 输入框自动调整高度
    $(app.box.textarea).autoResize({
        // 文本框改变大小时触发事件，这里改变了文本框透明度:  
        onResize: function() {
            $(this).css({
                opacity: 0.8
            });
        },
        // 动画效果回调触发事件，这里改变了文本框透明度:  
        animateCallback: function() {
            $(this).css({
                opacity: 1
            });
        },
        // 动画效果持续时间（ms），默认150:  
        animateDuration: 10,
        // 每次改变大小时，扩展（缩小）的高度（像素），默认20:  
        extraSpace: 14,
        //当文本框高度大于多少时，不再扩展，出现滚动条，默认1000
        limit: 150
    });

    // 鼠标移入后隐藏默认提示
    xue.placeholder('#username,#password');

    // 加经验
    $('body').on('click', '.userinfo_dialog .add_exp_btn', function() {
        var parents = $(this).parents('.userinfo_dialog');
        var user = parents.data('userid'),
            room = parents.data('roomid') || app.roomid,
            val = parents.find('.add_exp_val:visible').val();

        app.addExpByAdmin(user, room, val);
    });

    // 发金币
    $('body').on('click', '.userinfo_dialog .add_gold_btn', function(){
        var parents = $(this).parents('.userinfo_dialog');
        var user = parents.data('userid'),
            room = parents.data('roomid') || app.roomid,
            val  = parents.find('.add_gold_val:visible').val();
        app.addGoldByAdmin(user, room, val);
    });

    // 绑定音频播放事件
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

    // 绑定修改用户信息事件
    $(app.box.content).on('click', '#userinfo_submit', function() {
        var val = $('#userinfo_val').val();
        if (val.length > 300) {
            alert('简介内容不能超过300字');
            return false;
        }
        if (val.length <= 0) {
            alert('简介内容不能为空');
            return false;
        }
        app.setUserInfo();
    });
    
    // ----------------------- 互动题部分 ---------------------- //

    // 弹出互动题上传面板
    $(app.box.content).on('click', '.question_btn_add', function(){
        app.questions.add();
    });

    // 编辑互动题
    $(app.box.content).on('click', '.btn_question_edit', function(){
        app.questions.add(this);
    });

    // 互动题上传面板中选择文件的事件
    $(app.box.content).on('change', '.question_input_files', function(){
        var that = $(this), target = that.data('target');
        if($(target).length > 0){
            $(target).val(that.val());
        }
    });

    // 提交互动题
    $(app.box.content).on('click', '#question_add_submit', function(){
        var that = $(this), form = that.data('target');
        if($(form).length > 0){
            that.button('loading');
            app.questions.upload(form);
        }
        return false;
    });
  
    // 互动题上传列表中的发布按钮事件
    $('body').on('click', '.btn_question_pub', function(){
        var that = $(this), id = that.data('id');
        app.questions.sendLayer(id);
        
    });

    // 互动题发布按钮
    $('body').on('click', '#question_pub_submit', function(){
        var form = $('.question_pub_form');
        var firstGold = $('input.firstGold').val(),
            firstNum = $('input.firstNum').val(),
            secondGold = $('input.secondGold').val(),
            secondNum = $('input.secondNum').val(),
            thirdGold = $('input.thirdGold').val(),
            thirdNum = $('input.thirdNum').val(),
            gold_type = $('input[name="question_pub_gold_type"]').val();
            if(gold_type == 2){
                app.questions.send(form);
                return
            }
        var totalGod = 0;
        var gold = [firstGold, secondGold, thirdGold],
            num = [firstNum, secondNum, thirdNum]
        
        for (var i = 0; i < 3; i++) {
            if (gold[i] != '' && num[i] == '') {
                alert('请填写' + (i + 1) + '等奖的人数');
                return false;
            }
            if (num[i] != '' && gold[i] == '') {
                alert('请填写' + (i + 1) + '等奖的金币数');
                return false;
            }
        }

        totalGod = (parseInt(firstGold)*parseInt(firstNum) || 0) + (parseInt(secondGold)*parseInt(secondNum) || 0) + (parseInt(thirdGold)*parseInt(thirdNum) || 0);
        console.log(totalGod);
        if (totalGod > 10000) {
            alert('总悬赏不能超过10000！');
        }
        if (totalGod <= 10000 && totalGod >= 2000) {
            if (confirm('确定悬赏' + totalGod + '个金币吗')) {
                app.questions.send(form);
            }
        }
        if (totalGod < 2000 && totalGod >= 0) {
            app.questions.send(form);
        }
        return false;
    });

    // 互动题上传列表中的删除按钮事件
    $(app.box.content).on('click', '.btn_question_del', function(){
        var that = $(this), item = that.parents('.questions_item');
        app.questions.del(that.data('id'), function(){
            item.remove();
        });
    });

    // 查看发布记录
    $(app.box.content).on('click', '.question_btn_getrecord', function(){
        app.questions.getRecord();
    });

    // 查看抢金榜
    $(app.box.content).on('click', '.btn_question_record_view', function(){
        var that = $(this), id = that.data('id');
        app.questions.getGoldList(id);
    });

    // 预览互动题
    $(app.box.content).on('click', '.btn_question_preview', function(){
        var that = $(this);
        var dataInfo = {
            id : that.data('id'), 
            title : that.data('title'), 
            answer : that.data('answer'), 
            question_img_path : that.data('question'),
            analysis_img_path : that.data('analysis')
        }
        app.questions.preview(dataInfo);
        
    });

    // 重发互动题
    $(app.box.content).on('click', '.btn_question_record_resend', function(){
        var that = $(this), id = that.data('id');
        app.questions.resend(id);
    });
    
    // 切换发放类型
	$('body').on('click', 'input[name="question_pub_type"]', function(){
		var that = $(this), tar = $(that.data('target'));
		xue.log(tar);
		tar.show().siblings('.quest_pub_type_box').hide();
		$('input[name="question_pub_gold_type"]').val(that.val());
	}); 


    /* ================= 左侧我的设置里面的功能 ============= */


    // 展示加群申请列表
    $('#side_setting').on('click', '.btn_apply_num', function() {
        $(this).find('.new_tips').hide().text(0);
        $('.side_button .btn').find('.new_tips').hide().text(0);
        app.getApplyList();
    });

    // 编辑老师信息
    $(app.box.setting).on('click', '.btn_userinfo_edit', function() {
        app.editUserInfo();
    });
    
    // 我的互动题
    $(app.box.setting).on('click', '.btn_questions', function(){
        app.questions.getList();
    });


    // ----------------------- 群空间部分 ---------------------- //


    // 获取群空间列表
    $(app.box.content).on('click','#btn_roomspace', function(){
        app.spaces.createMod();
        app.spaces.getList();
    });
    $(app.box.content).on('click', '#paginate-mod li.item', function(){
        var p = $(this).data('page');
        if(p){
            app.spaces.getList(p);
        }
    });
    $(app.box.content).on('click', '#paginate-mod li.prev', function(){
        var that = $(this), p = that.parent().find('li.active').data('page');
        if(p){
            app.spaces.getList(p-1);
        }
    });
    $(app.box.content).on('click', '#paginate-mod li.next', function(){
        var that = $(this), p = that.parent().find('li.active').data('page');
        if(p){
            app.spaces.getList(p+1);
        }
    });

    //置顶群空间资料
    $(app.box.content).on('click','.btn_topdatum', function(){
        var that = $(this);
        var datumid = that.data('datumid');
        console.log(datumid)
        app.spaces.isTopDatum(datumid,1);
    });

    //取消置顶
    $(app.box.content).on('click','.btn_untopdatum', function(){
        var that = $(this);
        var datumid = that.data('datumid');
        app.spaces.isTopDatum(datumid,2);
    });

    //删除空间资料
    $(app.box.content).on('click','.btn_deldatum', function(){
        var that = $(this);
        var datumid = that.data('datumid');
        if(window.confirm('确认要删除吗？')){
            app.spaces.delDatum(datumid);
        }   
    });

    //添加资料
    $(app.box.content).on('click','.btn_space_upload', function(){
        app.spaces.add();
    });

    //选择空间资料上传类型
    $(app.box.content).on('click','.spaces_add_form ul li', function(e){
        app.spaces.changType(this);
    });

    //上传空间资料
    $(app.box.content).on('click','#spaces_add_submit', function(e){
        app.spaces.upLoad(this);
    });



    // ----------------------- 群统计部分 ---------------------- //


    // 获取群日报列表
    $(app.box.content).on('click','#btn_Daily', function(){
        app.Statistics.groupDailycreateMod();
        app.Statistics.groupDailyList();
    });

    $(app.box.content).on('click', '#paginate-groupDailyMod li.item', function(){
        var p = $(this).data('page');
        var StartDate = $('#Daily_date1').val();
        var EndDate = $('#Daily_date2').val();
        if(p){
            app.Statistics.groupDailyList(StartDate,EndDate,p);
        }
    });

    $(app.box.content).on('click', '#paginate-groupDailyMod li.prev', function(){
        var that = $(this), p = that.parent().find('li.active').data('page');
        var StartDate = $('#Daily_date1').val();
        var EndDate = $('#Daily_date2').val();
        if(p){
            app.Statistics.groupDailyList(StartDate,EndDate,p-1);
        }
    });

    $(app.box.content).on('click', '#paginate-groupDailyMod li.next', function(){
        var that = $(this), p = that.parent().find('li.active').data('page');
        var StartDate = $('#Daily_date1').val();
        var EndDate = $('#Daily_date2').val();
        if(p){
            app.Statistics.groupDailyList(StartDate,EndDate,p+1);
        }
    });
    
    $(app.box.content).on('click','#btn_dateSearch', function(){
        //app.Statistics.groupDailycreateMod();
        var StartDate = $('#Daily_date1').val();
        var EndDate = $('#Daily_date2').val();
        app.Statistics.groupDailyList(StartDate,EndDate);
    });
    

    // 获取群周报列表
    $(app.box.content).on('click','#btn_Weekly', function(){
        app.Statistics.groupWeeklycreateMod();
        app.Statistics.groupWeeklyList();
    });

    $(app.box.content).on('click', '#paginate-groupWeeklyMod li.item', function(){
        var p = $(this).data('page');
        if(p){
            app.Statistics.groupWeeklyList(p);
        }
    });

    $(app.box.content).on('click', '#paginate-groupWeeklyMod li.prev', function(){
        var that = $(this), p = that.parent().find('li.active').data('page');
        if(p){
            app.Statistics.groupWeeklyList(p-1);
        }
    });
    
    $(app.box.content).on('click', '#paginate-groupWeeklyMod li.next', function(){
        var that = $(this), p = that.parent().find('li.active').data('page');
        if(p){
            app.Statistics.groupWeeklyList(p+1);
        }
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

$(window).resize(app.resize);