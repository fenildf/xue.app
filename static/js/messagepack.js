/*
 * 客户端消息协议解析封装
 */
if (typeof Message === 'undefined') {
  Message = {};
};

Message.MessagePack = function(){
	/**
	 * 消息头长度
	 */
	this.headerLength = 4;
};

(function (p){
	/**
	 * 消息打包
	 * @param {thrift object} message 一个thrift的结构的message对象
	 * @return {ArrayBuffer} 返回一个二进制流
	 */
	p.getBuff = function(message){
		var transport = new Thrift.BinaryHttpTransport(null);
		var protocol = new Thrift.BinaryProtocol(transport);
		message.write(protocol);

		/*获取一个thrift对象二进制流*/
		var buff = protocol.transport.flush(true);

		/*自定义消息格式 消息长度+消息*/
		var newBuff = new Uint8Array(this.headerLength + buff.byteLength);
		newBuff.set(buff, this.headerLength);
		//return buff;
		return newBuff;
	};

	/**
	 * 消息解析
	 * @param {Thrift ArrayBuffer Stream} bin 一个thrift message打包的二进制流
	 * @return {Thrift Object} 返回一个thrift message 对象
	 */
	p.decode = function(bin){
		/*截取4个头字节*/
		var data1 = new Uint8Array(bin);
		var data2 = new Uint8Array(bin.byteLength - 4);
		data2.set([].slice.call(data1,4));

		var transport = new Thrift.BinaryHttpTransport(null, data2.buffer);
		transport.received = data2.buffer;
		var protocol = new Thrift.BinaryProtocol(transport);

		/*声明一个thrift message对象*/
		var message = new Protocol.Message.Message();
		message.read(protocol);

		return message;
	};
})(Message.MessagePack.prototype);
