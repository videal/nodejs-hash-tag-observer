var request = require('request');
var config = require('../config/index');
var io = require('../index');
var instagram = require('./api/instagram');
var twitter = require('./api/twitter');

var basket = {};

io.on('connection', function(socket) {
    console.log('connected');
    
    socket.on('startListening', function(data) {
        console.log('Starging listening tag: ' + data.tag);
        
        if (!basket[data.tag]) {
            basket[data.tag] = [];
        }

        for (var prop in basket) {
            if (prop != data.tag) {
                for (var i = 0; i < basket[prop].length; i++) {
                    if (basket[prop][i]) {
                        if (basket[prop][i].socket == socket.id) {
                            delete basket[prop][i];
                        }
                    }
                }
            }
        }

        instagram.subscribe(data.tag);
        twitter.subscribe(data.tag, function(tweet) {
            var tw = {
                    resource: 'twitter',
                    data: {
                        show: tweet.user.profile_image_url,
                        text: tweet.text,
                        fullName: tweet.user.name,
                        userName: tweet.user.screen_name,
                        sort_id: 1
                    }
                };
                console.log(tw);
                io.to(socket.id).emit('showTweet', tw);
        });

        basket[data.tag].push({
            socket: socket.id
        });
    });

    socket.on('disconnect', function(data) {
        console.log(data);
    });
});


var JsonFromUrl = function(url, callback) {
    request({
        url: url
    }, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var json = JSON.parse(body);
            callback(json);
        }
    });
};

module.exports = function(app) {
    app.get('/callback', function(req, res) {
        instagram.handshake(req, res);
    });

    app.post('/callback', function(req, res) {
        var data = req.body;
        data.forEach(function(tag) {
            var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + 
            '/media/recent?client_id=' + config.get('instagram:clientId');

            JsonFromUrl(url, function(data) {

                var text = '-';
                if (data.data[0].caption)
                    text = data.data[0].caption.text.trim();

                sendMessage("show",
                {
                        resource: 'instagram',
                        data: {
                            show: data.data[0].images.low_resolution.url,
                            text: text,
                            fullName:  data.data[0].caption.from.full_name,
                            userName: data.data[0].caption.from.username,
                            sort_id: 1
                        }
                    },
                    tag.object_id
                );
            });
        });
        res.end();
    });

    function sendMessage(event, post, tag) {
        console.log('emit tag: ' + tag);
        var to = basket[tag];
        if (to) {
            for (var i = 0; i < to.length; i++) {
                if (to[i]) {
                    io.to(to[i].socket).emit(event, post);
                }
            }
        }
    }
};