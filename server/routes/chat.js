var nowjs = require('now');

var Chat = function (server) {
  everyone = nowjs.initialize(server);
      everyone.now.distributeMessage = function(msg){
        everyone.now.receiveMessage(this.now.name, msg);

        };
};
exports.start = function(server){
    var chat=Chat(server);
};