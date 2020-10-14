

function WebSocketHandler (url, peer_id, vidThing) {

	var self = this;
	self.url = url;
	self.peer_id = peer_id;
	self.vid1 = vidThing;

	self.connect = function() {
		console.log('Connecting to server:', self.url);
		self.conn = new WebSocket(self.url);

		self.vid1.setWsConn(self.conn);

		self.conn.addEventListener('open', self.onServerOpen);
		self.conn.addEventListener('error', self.onServerError);
		self.conn.addEventListener('close', self.onServerClose);
		self.conn.addEventListener('message', self.onServerMessage);
	};

	self.onServerOpen = function(evt) {
		self.conn.send('HELLO ' + self.peer_id);
		setStatus("Registering with server");
	};

	self.onServerError = function(evt) {
		setError("Unable to connect to server, did you add an exception for the certificate?")
		// Retry after 3 seconds
		window.setTimeout(self.connect, 3000);
	};

	self.onServerClose = function(evt) {
		setStatus('Disconnected from server');

		self.vid1.close();

		// Reset after a second
		window.setTimeout(self.connect, 1000);
	};


	self.onServerMessage = function(evt) {
		console.log("Received " + evt.data);

		if (evt.data === 'HELLO') {
			setStatus("Registered with server, waiting for call");
			return;
		} else if (evt.data.startsWith('ADC0: ')) {
			console.log("whee:", evt.data);
			var pieces = evt.data.split(":");
			var voltsElem = document.getElementById('voltage');
			voltsElem.innerHTML = pieces[1];
			return;
		} else if (evt.data.startsWith("ERROR")) {
			self.handleIncomingError(evt.data);
			return;
		}

		if (evt.data.startsWith("OFFER_REQUEST")) {
			// The peer wants us to set up and then send an offer
			//if (!peer_connection) {
			//	createCall(null).then (generateOffer);
			//}
			console.log('... unsupported');

		} else {
			// Handle incoming JSON SDP and ICE messages
			try {
				var msg = JSON.parse(evt.data);
			} catch (e) {
				if (e instanceof SyntaxError) {
					self.handleIncomingError("Error parsing incoming JSON: " + evt.data);
				} else {
					self.handleIncomingError("Unknown error parsing response: " + evt.data);
				}
				return;
			}

			// Incoming JSON signals the beginning of a call
			if (msg != null) {
				//if (msg.peer_id === self.vid1.peer_id) {
					if (!self.vid1.peer_connection) {
						self.vid1.createCall();
					}

					if (msg.sdp != null) {
						self.vid1.onIncomingSDP(msg.sdp);
					} else if (msg.ice != null) {
						self.vid1.onIncomingICE(msg.ice);
					} else {
						self.handleIncomingError("Unknown incoming JSON: " + msg);
					}
				//}
			}
		}
	}

	self.handleIncomingError = function(error) {
		setError("ERROR: " + error);
		self.conn.close();
	};
}


