module.exports = function(app) {
	return new ChatRemote(app);
};

var ChatRemote = function(app) {
	this.app = app;
	this.channelService = app.get('channelService');
};

/**
 * Add user into chat channel.
 *
 * @param {String} uid unique id for user；username*rid
 * @param {String} sid server id
 * @param {String} name channel name ；channel的名字，一般就是rid roomid
 * @param {boolean} flag channel parameter flag用于控制是获取channel还是创建channel
 *
 */
ChatRemote.prototype.add = function(uid, sid, name, flag, cb) {
    //channelService和之前的sessionService类似，用与管理channel
    //当flag为true且名为那么的channel不存在，则会创建channel，否则返回名为name的channel
	var channel = this.channelService.getChannel(name, flag);
	var username = uid.split('*')[0];//获取用户名username
	var param = {
		route: 'onAdd',
		user: username
	};
    //向该通道推送消息给客户端
    //route就是客户端要监听的事件
    //我们可以自定义的route，然后在客户端使用pomelo.on(“onXXX”,cb)就能监听自定义的route
	channel.pushMessage(param);

	if( !! channel) {//判断channel的合法性，如果合法，就将userid和serverid放入channel中，将用户添加到channel里面。
        console.log('------add uid:',uid);
        console.log('------add sid:',sid);
		channel.add(uid, sid);
	}
	cb(this.get(name, flag));
};

/**
 * Get user from chat channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
//获取名为name的channel，并返回该channel下的所有uid
ChatRemote.prototype.get = function(name, flag) {
	var users = [];
	var channel = this.channelService.getChannel(name, flag);
	if( !! channel) {
        //get members from this channel
		users = channel.getMembers();
	}
	for(var i = 0; i < users.length; i++) {
		users[i] = users[i].split('*')[0];
	}
	return users;
};

/**
 * Kick user out chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
ChatRemote.prototype.kick = function(uid, sid, name) {
	var channel = this.channelService.getChannel(name, false);
	// leave channel
	if( !! channel) {
        //remove user form channel
		channel.leave(uid, sid);
	}
	var username = uid.split('*')[0];
	var param = {
		route: 'onLeave',
		user: username
	};
	channel.pushMessage(param);
};
