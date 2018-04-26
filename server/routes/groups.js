var mongodb = require('mongodb'),
    DB=require('./DBClient.js'),
    config=require('./config.js'),
    BSON=require('mongodb').BSONPure,
    thrift = require('./thriftClient'),
    GroupStorage = require('./gen-nodejs/GroupManager.js'),
    groupTypes = require('./gen-nodejs/group_types');

exports.findById = function(req, res) {
    var id = req.params.id;
        DB.client(function(db){
            DB.collection(db,config.dbGroup,function(collection){
                collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                    //console.log(item);
                    res.send(item);
                    //DB.sent("成功");
                    DB.close(db);
                });
        });
    });
};
 
exports.findAll = function(req, res) {
    DB.client(function(db){
        DB.collection(db,config.dbGroup,function(collection){
            collection.find().toArray(function(err, items) {
                res.send(items);
//                DB.sent("找到");
                //console.log(items);
                DB.close(db);
            });
        });
    });
};
 
/*exports.add = function(req, res) {
    var group = req.body;
    DB.client(function(db){
        DB.collection(db,config.dbGroup,function(collection){
            collection.findOne({'title':group.title},{},function(err, result) {
                if (result) {
                    res.send(result);
                    DB.close(db);
                    DB.sent("组已存在");
                } else {
                    collection.insert(group, {safe:true}, function(err, result) {
                                res.send(result);
                                DB.sent("添加成功");
                                DB.close(db);
                    });
                }
            });
        });
    });
};*/

exports.add = function(req, res){
    var group=req.body;  
	var groupRemote = new groupTypes.Group(group);
	thrift.client(GroupStorage,'Group',function(connection,client){
	    thrift.call(client,'add',[groupRemote],function(msg){
            var result={};
            result.msg=msg;
            res.writeHead(200, {"Content-Type": "text/html"});
            var str = JSON.stringify(result);
            //console.log(str);
            res.end(str);
            thrift.close(connection);
		});
	});
};

exports.update = function(req, res) {
    var id = req.params.id;
    var group = req.body;
    delete group._id;
    DB.client(function(db){
        DB.collection(db,config.dbGroup,function(collection){
            collection.update({'_id':new BSON.ObjectID(id)}, group, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    //console.log(result);
                    res.send(group);
                    DB.sent("更新成功");
                    DB.close(db);
                }
            });
        });
    });
};

/*exports.update = function(req, res){
	var group=req.body;
	var groupRemote = new groupTypes.Group(group);	
	thrift.client(GroupStorage,'Group',function(connection,client){
	    thrift.call(client,'update',[groupRemote,group.class_id],function(msg){
		   var result={};
		   result.msg=msg;
		   res.writeHead(200, {"Content-Type": "text/html"});
		   var str = JSON.stringify(result);
		   //console.log(str);
		   res.end(str);		   
		   thrift.close(connection);
		});
	});
};*/
 
exports.delete = function(req, res) {
    var id = req.params.id;
    DB.client(function(db){
        DB.collection(db,config.dbGroup,function(collection){
            collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    var result={};
                    result.msg='删除成功';
                    res.writeHead(200, {"Content-Type": "text/html"});
                    var str = JSON.stringify(result);
                    //console.log(str);
                    res.end(str);
                    DB.close(db);
                }
            });
        });
    });
};

exports.tatistical = function(){
    var map = function() {
        if(this.age>10&&this.age<20){
            //emit({class_id:this.class_id,age:this.age},1);
            emit({age:"10<age<20"},1);
        }
        if(this.age>=20&&this.age<30){
            //emit({class_id:this.class_id,age:this.age},1);
            emit({age:"20=<age<30"},1);
        }
        if(this.age>=30&&this.age<40){
            //emit({class_id:this.class_id,age:this.age},1);
            emit({age:"30=<age<40"},1);
        }
        };

    var reduce = function(key,value) {
        var x = 0;
        value.forEach(function (value) {x += value;});
        return x;
    };
    var finalize = function(key, value) {
        return { count:value};
    };

    DB.client(function(db){
        DB.collection(db,config.dbGroup,function(collection){
            collection.mapReduce(map,reduce,{out:{replace:'group1'},finalize:finalize},  function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    DB.close(db);
                }
            });
        });
    });
};
 
