

// Override with your own STUN servers if you want
var rtc_configuration = {iceServers: [{urls: "stun:stun.services.mozilla.com"},
                                      {urls: "stun:stun.l.google.com:19302"}]};

function VideoThing(elemId) {

	var self = this;
	self.elemId = elemId;
	self.elem = document.getElementById(elemId);

	self.setWsConn = function(ws_conn) {
		self.ws_conn = ws_conn;
	};

	self.icies = [];

	/*
		Typically, the order is:
		-----------------------
		createCall()
		rx SDP "offer" -> onIncomingSDP() -> setRemoteDescription()
		    this triggers onRemoteTrack()
		    then "Remote SDP set"
		then tx SDP "answer"
	*/


	self.createCall = function() {
		console.log(self.elemId, 'Creating RTCPeerConnection');

		self.peer_connection = new RTCPeerConnection(rtc_configuration);
		self.peer_connection.ontrack = self.onRemoteTrack;
		self.peer_connection.onicecandidate = self.onIceCandidate;
	};


	self.onIncomingSDP = function(sdp) {
		console.log(self.elemId, ' *** this.onIncomingSDP()');
		self.remoteSdp = sdp;
		self.peer_connection.setRemoteDescription(sdp).then(() => {
			setStatus("Remote SDP set");
			if (sdp.type != "offer")
				return;
			setStatus("Got SDP offer");

			// createAnswer() is a Promise
			self.peer_connection.createAnswer().then(self.onLocalDescription).catch(setError);

		}).catch(setError);
	};


	self.onRemoteTrack = function(evt) {
		console.log('  ########  This is onRemoteTrack() ........ WHEE!!!');
		self._remoteTrackEvent = evt;
		if (self.elem.srcObject !== evt.streams[0]) {
			console.log('  .... incoming stream');
			self.elem.srcObject = evt.streams[0];
		}
	};


	self.onLocalDescription = function(desc) {
		console.log(self.elemId, ' *** this.onLocalDescription()');
		console.log("Got local description: " + JSON.stringify(desc));

		self.peer_connection.setLocalDescription(desc).then(function() {
			setStatus("Sending SDP " + desc.type);
			var sdp = {'sdp': self.peer_connection.localDescription}
			self.localSdp = sdp;
			self.ws_conn.send(JSON.stringify(sdp));
		});
	};



	self.close = function () {
		self.elem.pause();
		self.elem.src = '';
		self.elem.load();

		if (self.peer_connection) {
			self.peer_connection.close();
			self.peer_connection = null;
		}
	}


	self.onIceCandidate = function (evt) {
		console.log(self.elemId, ' *** this.onIceCandidate()');

		self.icies.push(evt.candidate);
		// We have a candidate, send it to the remote party with the same uuid
		if (evt.candidate == null) {
			console.log("ICE Candidate was null, done");
			return;
		}
		self.ws_conn.send(JSON.stringify({'ice': evt.candidate}));
	};




	self.onIncomingICE = function(ice) {
		var candidate = new RTCIceCandidate(ice);
		self.peer_connection.addIceCandidate(candidate).catch(setError);
	};

}

