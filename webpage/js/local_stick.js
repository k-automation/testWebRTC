

_lastSlideTs = 0;


_stickAreaElem = document.getElementById('stickArea');


function setManualMode() {
	console.log('set Manual mode');
	wSock1.conn.send('MANUAL');
}

function setHoldMode() {
	console.log('set Hold mode');
	wSock1.conn.send('HOLD');
	window.requestedThrottle = 0.0;
	window.requestedSteering = 0.0;
	doDrive();
}

function setTurnLeft45() {
	console.log('set turn left 45');
	wSock1.conn.send('TURNLEFT45');
}
function setTurnLeft90() {
	console.log('set turn left 90');
	wSock1.conn.send('TURNLEFT90');
}

function setTurnRight45() {
	console.log('set turn right 45');
	wSock1.conn.send('TURNRIGHT45');
}
function setTurnRight90() {
	console.log('set turn right 90');
	wSock1.conn.send('TURNRIGHT90');
}

function setTurn180() {
	console.log('set turn 180');
	wSock1.conn.send('TURN180');
}

function toggleArmDisarm() {
	console.log('toggle arm/disarm');
	wSock1.conn.send('ARMDISARM');
}



function doDrive() {


	/////////////////////////////////////////////////////////////////////////
	// This is for moving the dot in stickArea
	// the percentage of top and left is between 0% to 100%
	var x_posFloat = (1.0 - window.requestedSteering) / 2;
	var y_posFloat = (1.0 - window.requestedThrottle) / 2;
	
	if (x_posFloat < 0.0) {
		x_posFloat = 0.0;
	} else if (x_posFloat > 1.0) {
		x_posFloat = 1.0;
	}

	if (y_posFloat < 0.0) {
		y_posFloat = 0.0;
	} else if (y_posFloat > 1.0) {
		y_posFloat = 1.0;
	}

	console.log("x_posFloat: " + String(x_posFloat));
	console.log("y_posFloat: " + String(y_posFloat));

	var x_posPercent = Math.round(x_posFloat * 100);
	var y_posPercent = Math.round(y_posFloat * 100);

	
	_stickAreaElem.style.left = String(x_posPercent) + '%';
	_stickAreaElem.style.top = String(y_posPercent) + '%';

	/////////////////////////////////////////////////////////////////////////
	// This is for sending back to the rover, the value range is -1.0 to 1.0
	if (window.requestedSteering < -1.0){
		window.requestedSteering = -1.0;
	} else if (window.requestedSteering > 1.0){
		window.requestedSteering = 1.0;
	}

	if (window.requestedThrottle < -1.0){
		window.requestedThrottle = -1.0;
	} else if (window.requestedThrottle > 1.0){
		window.requestedThrottle = 1.0;
	}


	ts = +new Date();

	// Send at max 10fps
	if ((ts - _lastSlideTs) > 100) {
		//var throttlePercent = Math.round(window.requestedThrottle * 100);
		//console.log('THROTTLE:' + String(throttlePercent));

		// we don't need to send a zillion decimal places across the net:
		var steeringString = String(window.requestedSteering * 0.99).slice(0,6);
		var thorttleString = String(window.requestedThrottle * 0.99).slice(0,6);
		console.log('str: ' + String(window.requestedSteering) + '  thr: ' + String(window.requestedThrottle));
		wSock1.conn.send('STR:' + steeringString +":THR:" + thorttleString);
	}
}


function doStopButton() {
	//console.log("   *********** STOP!!!");
	window.requestedSteering = 0.0;
	window.requestedThrottle = 0.0;
	doDrive();
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
		// var shortString = String(window.requestedThrottle * 0.99).slice(0,6);
		// wSock1.conn.send('THROTTLE:' + shortString);
		var steeringString = String(window.requestedSteering * 0.99).slice(0,6);
		var thorttleString = String(window.requestedThrottle * 0.99).slice(0,6);
		wSock1.conn.send('STR:' + steeringString +":THR:" + thorttleString);
	}, 600);

};





