

_lastSlideTs = 0;


_throttleSliderElem = document.getElementById('throttleSlider');





function setManualMode() {
	console.log('set Manual mode');
	wSock1.conn.send('MANUAL');
}

function setHoldMode() {
	console.log('set Hold mode');
	wSock1.conn.send('HOLD');
	window.requestedThrottle = 0.0;
	doThrottle();
}


function doThrottle() {


	// Position of the slider isn't quite the same thing as the throttle:
	var posFloat = (1.0 - window.requestedThrottle) / 2;
	if (posFloat < -1.0) {
		posFloat = -1.0;
	} else if (posFloat > 1.0) {
		posFloat = 1.0;
	}

	var posPercent = Math.round(posFloat * 100);


	_throttleSliderElem.style.top = String(posPercent) + '%';

	ts = +new Date();

	// Send at max 10fps
	if ((ts - _lastSlideTs) > 100) {
		//var throttlePercent = Math.round(window.requestedThrottle * 100);
		//console.log('THROTTLE:' + String(throttlePercent));

		// we don't need to send a zillion decimal places across the net:
		var shortString = String(window.requestedThrottle * 0.99).slice(0,6);
		console.log(' --- THROTTLE:' + shortString);
		wSock1.conn.send('THROTTLE:' + shortString);
	}
}


function doStopButton() {
	//console.log("   *********** STOP!!!");
	window.requestedThrottle = 0.0;
	doThrottle();
}



vid1 = new VideoThing('stream1');
wSock1 = new WebSocketHandler('wss://at-drive.com:8443/', 'rasheed001a', vid1);

vid2 = new VideoThing('stream2');
wSock2 = new WebSocketHandler('wss://at-drive.com:8443/', 'rasheed001b', vid2);


window.onload = function () {
	wSock1.connect();
	wSock2.connect();

	// Keep-alive to the motors:
	//   (if the motors don't hear from us after a timeout, then they will stop)
	setInterval(function () {
		// we don't need to send a zillion decimal places across the net:
		var shortString = String(window.requestedThrottle * 0.99).slice(0,6);
		wSock1.conn.send('THROTTLE:' + shortString);
	}, 600);

};





