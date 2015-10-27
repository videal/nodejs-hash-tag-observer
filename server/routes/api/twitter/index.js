var config = require('../../../config/index');

var Twit = require('twit');
var T = new Twit({
    consumer_key: config.get('twitter:consumerKey'),
    consumer_secret: config.get('twitter:consumerSecret'),
    access_token: config.get('twitter:accessToken'),
    access_token_secret: config.get('twitter:accessTokenSecret')
});

exports.subscribe = function(tag, callback) {
    var stream = T.stream('statuses/filter', {
        track: '#' + tag
    });
    stream.on('tweet', callback);
};