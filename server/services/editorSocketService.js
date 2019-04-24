
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

        if (!(sessionId in collaborations)) {
            collaborations[sessionId] = {
                'participants': []
            }
        }

        collaborations[sessionId]['participants'].push(socket.id);

        // socket event listeners
        socket.on('change', delta => {
            console.log("change" + socketIdToSessionId[socket.id] + " " + delta);
            forwardEvents(socket.id, "change", delta);
        })

        socket.on('cursorMove', cursor => {
            console.log("cursorMove" + socketIdToSessionId[socket.id] + " " + cursor);
            let sessionId = socketIdToSessionId[socket.id];
            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;
            forwardEvents(socket.id, 'cursorMove', JSON.stringify(cursor))
        })

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

