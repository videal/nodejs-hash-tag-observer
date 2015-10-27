App.controller('homeController', ['$scope', 'Socket', function($scope, Socket) {
    Socket.connect();
    $scope.posts = [];
    $scope.loadingDots = {'visibility': 'hidden'}; 
    $scope.spinnerClass = "spinner";
    var last = '';
    var id_counter = 1;
    var currentTag ='';

    $scope.startListening = function(tag) {
        if (currentTag != tag) {
            $scope.posts = [];
            currentTag = tag;
            $scope.loadingDots = {'visibility': 'visible'};
            $scope.spinnerClass = "animated fadeIn spinner";
            Socket.emit('startListening', {
            tag: tag
        });
        }
    };

   Socket.on('show', function(data) {
        if (last != data.data.show) {
            $scope.loadingDots = {'visibility': 'hidden'}; 
            $scope.spinnerClass = "animated fadeOut spinner";
            last = data.data.show;
            id_counter += 1;
            data.data.sort_id = id_counter;
            $scope.posts.push(data);
        }
    });

    Socket.on('showTweet', function(tweet) {
        $scope.loadingDots = {'visibility': 'hidden'}; 
        id_counter += 1;
        tweet.data.sort_id = id_counter;
        $scope.posts.push(tweet);
    });
}]);