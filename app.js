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

var rocks = [];
var papers = [];
var scissors = [];


var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    console.log('connection made!');



    socket.on('setUsername', function(username) {
        // Creates object variable to hold username.
        // TODO figure out how cookies could be used instead:
        socket.username = username;
        players.push(socket);
        console.log(socket.username + " added");
        socket.broadcast.emit('message', 'I guess we have a newcomer, ' + socket.username);
    });
// Broadcast isn't working like this, but doesn't crash anything


    socket.on('selectedWeapon', function(choice) {
        socket.weapon = choice;
        console.log(socket.username + " chose " + choice);
        submits++;

        switch (choice) {
            case "ROCK":
                rocks.push(socket);
                break;
            case "PAPER":
                papers.push(socket);
                break;
            case "SCISSORS":
                scissors.push(socket);
                break;
        }

        if (submits == players.length) {


            if (rocks.length > 0 && papers.length > 0) { emitWins(papers, rocks); }
            if (rocks.length > 0 && scissors.length > 0) { emitWins(rocks, scissors); }
            if (papers.length > 0 && scissors.length > 0) { emitWins(scissors, papers); }
            if (rocks.length > 1) { emitTies(rocks); }
            if (papers.length > 1) { emitTies(papers); }
            if (scissors.length > 1) { emitTies(scissors); }

            submits = 0;
            rocks.length = 0;
            papers.length = 0;
            scissors.length = 0;
        }
    });
});

function emitWins(winners, losers) {
    for (var x = 0; x < winners.length; x++) {
        for (var y = 0; y < losers.length; y++) {
            io.sockets.emit('outcome', winners[x].username + " beats " + losers[y].username);
            break;
        }
    }
}

function emitTies(tiers) {
    var tiersStr = "";
    for (var x = 0; x < tiers.length - 1; x++) {
        tiersStr += tiers[x].username + ", ";
    }
    tiersStr += tiers[tiers.length -1].username;
    io.sockets.emit('outcome', tiersStr + " Tied");
}

server.listen(3000);

// MOST helpful site I've come across! (structure above adopted from site):
// https://openclassrooms.com/courses/ultra-fast-applications-using-node-js/socket-io-let-s-go-to-real-time