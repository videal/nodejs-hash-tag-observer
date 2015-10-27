var Instagram = require('instagram-node-lib');
var config = require('../../../config/index');

Instagram.set('client_id', config.get('instagram:clientId'));
Instagram.set('client_secret', config.get('instagram:clientSecret'));
Instagram.set('callback_url', config.get('instagram:callbackUrl'));
Instagram.set('redirect_uri', config.get('instagram:redirectUri'));

Instagram.subscriptions.unsubscribe_all({
    object: 'all'
});

exports.subscribe = function(tag) {
    Instagram.subscriptions.subscribe({
        object: 'tag',
        object_id: tag,
        aspect: 'media',
        callback_url: config.get('instagram:callbackUrl'),
        type: 'subscription',
        id: '#'
    });
};

exports.handshake = function(req, res) {
    Instagram.subscriptions.handshake(req, res);
};