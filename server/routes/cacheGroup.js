var redis=require('redis');
var mongodb = require('mongodb');
var config=require('./config');
var DB=require('./DBClient');
var then = require('thenjs');

exports.init=function(){
    var redisClient = redis.createClient();
    redisClient.on("error", function (err) {
        console.log("redis Error " + err);
    });
        redisClient.flushdb(function() {
            redisClient.flushdb(function () {
                DB.client(function (db) {
                    DB.collection(db, config.dbGroup, function (collection) {
                        var counter=0;
                        collection.find().toArray(function (err, docs) {
                            for (var i = 0; i < docs.length; i++) {
                                var group = docs[i];
                                var title = group.title;
                                var g = JSON.stringify(group);
                                redisClient.rpush('group', g,function (error, res){
                                    if (error) {
                                        console.log(error);
                                    }
                                        counter++;
                                        if(counter==docs.length){
                                            redisClient.end();
                                        }

                                });
                            }
                        });
                    });
                });

            })

        });
};

exports.add=function(group){
    var redisClient = redis.createClient();
    redisClient.on("error", function (err) {
        console.log("redis Error " + err);
    });
    var g=JSON.stringify(group);
    redisClient.lpush('group', g, function(error, res){
        if(error) {
            console.log(error);
        } else {
             //console.log(res);
            console.log("333333333333333 ");
        }
        redisClient.end();
        console.log("4444444444444444 ");
    });
};

exports.update=function(group){
    var title=group.title;
    var redisClient = redis.createClient();
    redisClient.on("error", function (err) {
        console.log("redis Error " + err);
    });
    var g=JSON.stringify(group);
    redisClient.hset('group',class_id, g, function(error, res){
        if(error) {
            console.log(error);
        } else {
            console.log(res);
        }
        redisClient.end();
    });
};

/*exports.add=function(){
    var redisClient = redis.createClient();
    redisClient.on("error", function (err) {
        console.log("redis Error " + err);
    });
    var thenObj=then(function(defer,group){
        var title=group.title;
        var g=JSON.stringify(group);
        redisClient.lpush('group', g, function(error, res){
            if(error) {
                console.log(error);
            }
            defer(null,group);
        });
    }).then(function(defer,group){
        DB.client(function(db){
            DB.collection(db,config.dbGroup,function(collection){
                collection.findOne({'group':group.title},{},function(err, result) {
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
                    defer(null,group);
                });
            });
        });
    }).then(function (defer,group) {
        redisClient.end();
        defer();
    });
};*/

exports.query=function(){
    var redisClient = redis.createClient();
    redisClient.on("error", function (err) {
        console.log("redis Error " + err);
    });
    redisClient.llen('group',function(err, len) {
        if(err) {
            console.log(err);
        } else {
            console.log('len:'+len);
        }
        redisClient.end();
    });
};






