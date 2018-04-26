var thrift = require('thrift');
var config = require('./config');

exports.client=function(server,type,callBack){
    var connection = thrift.createConnection(config["thriftIP"], config["thriftPort"], {transport: thrift.TFramedTransport});
	connection.on('error', function(err) {
	  console.error("thrift err:"+err);
	});
	var client = thrift.createClient(server, connection);
	callBack(connection,client);
};

exports.call=function(client,method,args,callBack){
   fun=client[method];
   var f=function(err, msg){
       if (err) { console.error("thrift err:"+err); return;}
      callBack(msg);
   };
   args.push(f);
   fun.apply(client,args);
};

exports.close=function(connection){
   connection.end();
};