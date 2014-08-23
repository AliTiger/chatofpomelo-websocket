var chatRemote = require('../remote/chatRemote');
var MAX_MSG_LENGTH = 30;//发送消息最长字数限制

//状态码
var LENGTH_ILLEGAL = 10;//长度不合法
var SEND_FAIL = 20;//私聊发送消息失败
var ONLINE = 30;//不在线

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next step callback
 *
 */
//解释下参数
// msg就是客户端发送的对象
// session就是服务器端与当前用户的会话
// next相当于把结果发送给客户端
handler.send = function(msg, session, next) {
    var self = this;
	var rid = session.get('rid');//房间号
	var username = session.uid.split('*')[0];//用户名
    var content = msg.content;//消息内容
    var msgLength;//消息长度
    var propNameLength = 1;//道具名称占一个字符 &
    var emojiLength = 1;//表情占一个字符 #1001
    var channelService = this.app.get('channelService');
    msgLength = content.length;

    //道具
    if(content.indexOf('[')!=-1 && content.lastIndexOf(']')!=-1){
        //计算除去[1001]之外的字符长度
        msgLength = content.substring(0,content.indexOf('[')).length;
        msgLength += content.substring(content.lastIndexOf(']')+1).length;
        //var propName = content.split('[')[1].split(']')[0];
        msgLength += propNameLength;
    }
    //表情
    if(content.indexOf('#')!=-1){
        msgLength -= 5;//#1001
        msgLength += emojiLength;
    }
    console.log('msgLength--:',msgLength);
    if(msgLength > MAX_MSG_LENGTH){
        next(null,{
            status:LENGTH_ILLEGAL//消息字数超过规定限制
        });
        return;
    }else{
        //消息过滤非法词汇 fuckWord
        var param = {
            msg: content,
            from: username,
            target: msg.target
        };
        console.log('====param:',param);
        //根据用户发送的rid，获取对应的channel
        var channel = channelService.getChannel(rid, false);

        //判断发送对象，是广播还是发送给特定用户
        if(msg.target == '*') {
            //向所有用户发送消息
            channel.pushMessage('onReceive', param,[],function(err){
                if(err){
                    next(null,{
                        status:SEND_FAIL//私聊发送消息失败
                    });
                    return;
                }
            });
        } else {
            var tuid = msg.target + '*' + rid;//li*1 对应 li session.bind('li*1');
            var tsid = channel.getMember(tuid)['sid'];//服务器ID
            console.log('========tuid:',tuid);
            console.log('========tsid:',tsid);

            //判断对方是否在线 获取用户在线状态
            var online = channel.getMember(tuid);
            console.log('======online:',!!online);
            if(!!online){
                console.log('对方在线对方在线对方在线对方在线对方在线对方在线');
                //向当个用户发送消息 私聊
                channelService.pushMessageByUids('onReceive', param, [{
                    uid: tuid,
                    sid: tsid
                }]);
            }else{
                console.log('对方不在线对方不在线对方不在线对方不在线对方不在线');
                next(null,{
                    status:ONLINE//对方不在线
                });
                return;
            }
        }
    }
};

//判断用户在线 测试通过
handler.online = function(msg,session,next){
    var uid = msg.target;
    var rid = session.get('rid');
    var channelService =  this.app.get('channelService');
    var channel = channelService.getChannel(rid,false);
    var tuid = uid+"*"+rid;
    var online = channel.getMember(tuid);
    console.log('==============online');
    if(!!online){
        //用户在线 则将角色ID返回给客户端
        next(null,{
            userId:uid
        });
    }else{
        //否则返回错误状态
        next(null,{
            status:30
        });
    }
};

//系统广播消息
handler.broadcast = function(msg,session,next){
    var self = this;
    var channelService = self.app.get('channelService');

    var param = {
        msg: content,
        from: username,
        target: msg.target
    };
    //系统广播
    channelService.broadcast('connector','onBroadcast',param,{binded:true},function(err){
        console.log('err:',err);
        if(err){
            next(null,{
                status:40//系统广播消息失败
            });
        }
    });
};