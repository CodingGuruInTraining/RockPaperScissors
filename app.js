var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var players = [];
var submits = 0;
var rockWinners = [];
var paperWinners = [];
var scissorWinners = [];
var allArrays = [];
allArrays.push(rockWinners);
allArrays.push(paperWinners);
allArrays.push(scissorWinners);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    console.log('connection made!');
    // Example communication.
    socket.emit('message', 'We are connected!');
// Broadcast isn't working like this, but doesn't crash anything
    socket.broadcast.emit('message2', 'I guess we have a newcomer');

    socket.on('setUsername', function(username) {
        // Creates object variable to hold username.
        // TODO figure out how cookies could be used instead:
        socket.username = username;
        players.push(socket);
        console.log(socket.username + " added");
    });

    socket.on('selectedWeapon', function(choice) {
        socket.weapon = choice;
        console.log(socket.username + " chose " + choice);
        submits++;

        switch (choice) {
            case "rock":
                rockWinners.push(socket);
                break;
            case "paper":
                paperWinners.push(socket);
                break;
            case "scissors":
                scissorWinners.push(socket);
                break;
        }

        if (submits == players.length) {

            for (var x = 0; x < players.length; x++) {
                for (var y = 0; y < players.length; y++) {
                    if (players[x] != players[y]) {
                        if (players[x].weapon == players[y].weapon) {
                            console.log("tie");
                            break;
                        }
                        else if (players[x].weapon == "rock") {
                            if (players[y].weapon == "paper") {
                                console.log("Player " + players[y].username + " wins");
                            } else {
                                console.log("Player " + players[x].username + " wins");
                            }
                        }
                        else if (players[x].weapon == "paper") {
                            if (players[y].weapon == "scissors") {
                                console.log("Player " + players[x].username + " wins");
                            } else {
                                console.log("Player " + players[y].username + " wins");
                            }
                        }
                    }


                }
            }

            // var rockWinners = [];
            // var paperWinners = [];
            // var scissorWinners = [];



            // var allArrays = [];
            // allArrays.push(rockWinners);
            // allArrays.push(paperWinners);
            // allArrays.push(scissorWinners);

            // console.log(allArrays.length + " arrays in array");
            //
            // console.log(allArrays[0].length + " rocks");
            // console.log(allArrays[1].length + " papers");
            // console.log(allArrays[2].length + " scissors");





            // for (var i = 0; i < allArrays.length; i++) {
            //     // console.log("array has " + arr.length);
            //     // console.log(arr.name);
            //     // console.log(arr);
            //     if (allArrays[i].length > 1) {
            //         console.log("tie");
            //     }
            //     else if (allArrays[i].length == 1) {
            //         console.log("Player " + allArrays[i][0].username + " wins!");
            //     }
            // }







            submits = 0;


            // if (players[0].weapon == players[1].weapon) {
            //
            // }
            // else if (players[0].weapon == "rock" && players[1].weapon == "paper") {
            //
            // }
            // else if (players[0].weapon == "paper" && players[1].weapon == "scissors") {
            //
            // }
            //
            // for (var i = 0; i < players.length; i++) {
            //     if (players[i])
            //     // for (var i = 0; i < players.length; i++) {
            //     //
            //     // }
            // }
        }
    });
});

server.listen(3000);




// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var index = require('./routes/index');
// var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', index);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;






// MOST helpful site I've come across! (structure above adopted from site):
// https://openclassrooms.com/courses/ultra-fast-applications-using-node-js/socket-io-let-s-go-to-real-time