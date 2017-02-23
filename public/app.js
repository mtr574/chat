app = angular.module('app', []);

app.controller('main', function($scope, $http) {
    var socket = io.connect()
    $scope.messages = []
        
    $http.get('/connections').then(function(response) {
        $scope.connections = response.data.connections
    })

    // post new message
    $scope.sendMsg = function() {
        msg = $scope.messageInput
        socket.emit('send message', msg)
        //$scope.messages.push(msg)
        $scope.messageInput = null
    }

    socket.on('new message', function (data){
      $scope.messages.push(data.msg)
      $scope.$apply() 
    });
})

app.directive('messageLog', function() {
    return {
        restrict: 'E',
        template: '<div class="message__wrapper" ng-repeat="msg in messages">{{ msg }}</div>'
    }
})

app.directive('sendMessage', function() {
    return {
        restrict: 'E',
        template: '<input type="text" ng-model="messageInput" placeholder="write something nice" autofocus="true"><button type="button" ng-click="sendMsg()">Send</button>'
    }
})
