//客户端连接的服务器
//该服务器负责维护客户端的session对象
module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
		this.app = app;
};

var handler = Handler.prototype;

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
//msg就是客户端发送的请求对象
//session很重要，代表服务器端和客户之间的会话，之后的聊天功能就要用到这个session
handler.enter = function(msg, session, next) {
	var self = this;
	var rid = msg.rid;//channelid
	var uid = msg.username + '*' + rid//这里的uid是username和rid的合并(gate中的uid只是username)

    //sessionService主要负责管理客户端连接session, session对象主要作用是维护当前王佳的状态信息，比如玩家ID，所连的服务器ID等
    //对session完成一些基本操作，包括创建session、session绑定用户id、获取session绑定的用户id等。
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	//如果session中已经存在sessionService 说明已登陆 不能重复登录
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;
	}
    //session -->session代表的是客户端的session
    //Bind current session with the user id.
    //It would push the uid to frontend server and bind uid to the frontend internal session
	session.bind(uid);//将uid(username*rid)绑定到当前的session
    //Set the key/value into backend session
	session.set('rid', rid);//session.settings[rid] = rid;
    //Push the key/value in backend session to the front internal session
    //session同步，在改变session之后需要同步，以后的请求处理中就可以获取最新session
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));//监听“close”事件 调用onUserLeave()

	//put user into channel 远程调用chatRemote.add()
    //session保存服务器rid 会判断rid
	self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
		next(null, {//得到的user是同一channel的用户列表(数组)，将这用户列表传给客户端
			users:users
		});
	});
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};