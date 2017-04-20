var http = require('http');
var fs = require('fs');

// Creates server and sends client page.
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Empty array to hold current players.
var players = [];
// Counter for players who selected weapon.
var submits = 0;

// Empty arrays to hold players based on their weapon.
var rocks = [];
var papers = [];
var scissors = [];

var io = require('socket.io').listen(server);

// Defines actions to take once websocket connects.
io.sockets.on('connection', function(socket) {
    console.log('connection made!');

    // Sets player attribute and sends message to other players.
    socket.on('setUsername', function(username) {
        // Creates object variable to hold username.
        // TODO figure out how cookies could be used instead:
        socket.username = username;
        players.push(socket);
        socket.broadcast.emit('message', socket.username + ' has joined the game.');
    });

    // Actions for selecting weapon.
    socket.on('selectedWeapon', function(choice) {
        socket.weapon = choice;
        submits++;
        // Assigns player to appropriate array.
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
        // Checks if all players have made a selection before
        // comparing.
        if (submits == players.length) {
            // Runs each array through a compare function.
            if (rocks.length > 0 && papers.length > 0) { emitWins(papers, rocks); }
            if (rocks.length > 0 && scissors.length > 0) { emitWins(rocks, scissors); }
            if (papers.length > 0 && scissors.length > 0) { emitWins(scissors, papers); }
            if (rocks.length > 1) { emitTies(rocks); }
            if (papers.length > 1) { emitTies(papers); }
            if (scissors.length > 1) { emitTies(scissors); }

            // Clears objects for next game.
            submits = 0;
            rocks.length = 0;
            papers.length = 0;
            scissors.length = 0;
        }
    });
});

function emitWins(winners, losers) {
    // Loops through both arrays and transmits message to all players.
    for (var x = 0; x < winners.length; x++) {
        for (var y = 0; y < losers.length; y++) {
            io.sockets.emit('outcome', winners[x].username + " beats " + losers[y].username);
            break;
        }
    }
}

function emitTies(tiers) {
    // Loops through array and creates string of players' usernames who
    // tied. The message is then transmitted to all players.
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