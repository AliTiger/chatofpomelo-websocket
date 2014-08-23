module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.queryEntry = function(msg, session, next) {
	var uid = msg.uid;
	if(!uid) {//uid为空 说明用户不存在
		next(null, {
			code: 500
		});
		return;
	}
	// // get all connectors 获取所有的connector
	var connectors = this.app.getServersByType('connector');
	if(!connectors || connectors.length === 0) {
		next(null, {
			code: 500
		});
		return;
	}
	// here we just start `ONE` connector server, so we return the connectors[0] 
	var res = connectors[0];
    //返回connector的host和port
	next(null, {
		code: 200,
		host: res.host,
		port: res.clientPort
	});//将该服务器的host和客户端端口clientPort返回给客户端
};
