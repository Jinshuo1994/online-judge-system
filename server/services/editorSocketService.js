var redisClient = require('../modules/redisClient')
const TIMEOUOT_IN_CLIENTS = 3600;

var sessionPath="/temp_sessions/";

module.exports = function(io) {
    // collaboration sessions
    var collaborations = [];
    // map from socketId to sessionId
    var socketIdToSessionId = [];

    var sessionPath = "/temp_sessions";

    io.on('connection', socket => {
        let sessionId = socket.handshake.query['sessionId'];


        //map between socketId and sessionId
        socketIdToSessionId[socket.id] = sessionId;
        // add socket.id to corresponding collaboration session participants

        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            redisClient.get(sessionPath + '/' + sessionId, function (data) {
               if (data) {
                   console.log("session terminated previously; pulling back from Redis", data);
                   collaborations[sessionId] = {
                       'cachedChangedEvents': JSON.parse(data),
                       participants: []
                   }
               } else {
                   console.log("creating new session");
                   collaborations[sessionId] = {
                       'cachedChangedEvents': [],
                       participants: []
                   }
               }
                collaborations[sessionId]['participants'].push(socket.id);
            });
        }

        io.on('disconnect', function() {
            let sessionId = socketIdToSessionId[socket.id];
            console.log('socket ' + socket.id + 'disconnected')

            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                let index = participants.indexOf(socket.id);
                if (index >= 0) {
                    participants.splice(index, 1);
                    if (participants.length == 0) {
                        console.log('last participants left, Storing in Redis');
                        let key = sessionPath + '/' + sessionId;
                        let value = JSON.stringify(collaborations[sessionId]['cachedChangedEvents']);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUOT_IN_CLIENTS);
                        delete collaborations[sessionId];
                    }
                }
            }
        })



        // socket event listeners
        socket.on('change', delta => {
            console.log("change" + socketIdToSessionId[socket.id] + " " + delta);
            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                collaborations[sessionId]['cachedChangedEvents'].push('change', delta, Date.now());
            }
            forwardEvents(socket.id, "change", delta);
        })

        socket.on('cursorMove', cursor => {
            console.log("cursorMove" + socketIdToSessionId[socket.id] + " " + cursor);
            let sessionId = socketIdToSessionId[socket.id];
            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;
            forwardEvents(socket.id, 'cursorMove', JSON.stringify(cursor))
        })

        socket.on('restoreBuffer', () => {
            let sessionId = socketIdToSessionId[socket.id];
            console.log('restoring buffer for session: ' + sessionId + ', socket: ' + socket.id);
            if (sessionId in collaborations) {
                let changeEvents = collaborations[sessionId]['cachedChangedEvents'];
                console.log(changeEvents)
                for (let i = 0; i < changeEvents.length; i++) {
                    socket.emit(changeEvents[i][0], changeEvents[i][1]);
                }
            }
        });


        function forwardEvents(socketId, eventName, dataString) {
            let sessionId = socketIdToSessionId[socketId];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socketId != participants[i]) {
                        io.to(participants[i]).emit(eventName, dataString);
                    }
                }
            } else {
                console.log("WARNING: could not tie socket_id to any collaboration")
            }
        }

    });
}

