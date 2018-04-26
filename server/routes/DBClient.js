var config = require('./config.js');
var  mongodb = require('mongodb');

exports.client=function(callBack){
    var  server  = new mongodb.Server(config.dbIP, config.dbPort, {auto_reconnect:true}),
         db = new mongodb.Db(config.db, server, {safe:true});
    db.open(function(err,db){
        callBack(db);
    });
};

exports.collection=function(db,collectionName,callBack){

    db.collection(collectionName,{safe:true},function(err,collection){
        callBack(collection);
    });
};

exports.findOne=function(collection,query,callBack){
    collection.findOne(query,function(err, doc){
        callBack(doc);
    });
};

exports.find=function(collection,query,callBack){
    collection.find(query).toArray(function(err,docs){
        callBack(docs);
    });
};

exports.close=function(db){
    db.close(function (err, result) {
        if (err) {
            //console.log("close db connection error:" + err);
        } else {
            //console.log("close db connection success!");
        }
    });
};

exports.sent=function(data){
    if(data){
       console.log(data);
    }
};