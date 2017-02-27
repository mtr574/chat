app = angular.module('app', ['firebase']);

app.controller('main', function($scope, $http, $firebaseArray) {
    // Configuration
    var socket = io.connect()
    
    // Init Firebase
    var config = {
        apiKey: "AIzaSyCz4fS4jdhsuoXFiDDkMbpQr3wvNSKnnQk",
        authDomain: "chatwithnate-1334f.firebaseapp.com",
        databaseURL: "https://chatwithnate-1334f.firebaseio.com",
        storageBucket: "chatwithnate-1334f.appspot.com",
        messagingSenderId: "327018653042"
    };
    firebase.initializeApp(config);
    var url = config.databaseURL;

    $scope.messages = []

    $http.get('/connections').then(function(response) {
        $scope.connections = response.data.connections
    })

    // post new message
    $scope.sendMsg = function() {
        msg = $scope.messageInput
        if (msg !== null) {
            socket.emit('send message', msg)
            $scope.messageInput = null
        }
    }

    socket.on('new message', function(data) {
        $scope.messages.push({
            time: Date().now,
            content: data.msg
        })
        $scope.$apply()
    });
    
    // Service worker: cache app shell
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }
    
    // Init Firebase connection
    var fireRef = firebase.database().ref()
    //$scope.messages = $firebaseArray(fireRef)
})

app.directive('messageLog', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/message.html'
    }
})

app.directive('sendMessage', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/input.html'
    }
})