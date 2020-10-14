// _stickAreaElem = document.getElementById('stickArea');
var stickElem = document.getElementById('stickDiv');
var dragElem = document.getElementById('stickArea');

window.trackStick = false;
window.requestedSteering = 0.0;
window.requestedThrottle = 0.0;


// Disable the default drag-n-drop behavior of the imgs:
//throttleElem.ondragstart = function() {
//	return false;
//};

function isTouchDevice() {
	// Stackoverflow #4817029
	return !!('ontouchstart' in window) // works on most browsers 
		|| !!('onmsgesturechange' in window); // works on ie10
}


function getXPosition(pageX) {
	//console.log(pageX, pageY)
	var x = -2*(pageX + window.scrollX - stickElem.offsetLeft - (stickElem.offsetWidth / 2)) / stickElem.offsetWidth;

	console.log("x: " + String(x))

	return x;
}

function getYPosition(pageY) {
	//console.log(pageX, pageY)

	var y = -2*(pageY + window.scrollY - stickElem.offsetTop - (stickElem.offsetHeight/ 2)) / stickElem.offsetHeight;
	// console.log("pageY: " + String(pageY));
	// console.log("window.scrollY: " + String(window.scrollY));
	// console.log("throttleElem.offsetTop: " + String(throttleElem.offsetTop));
	// console.log("throttleElem.offsetHeight: " + String(throttleElem.offsetHeight));
	// console.log("y: " + String(y));

	console.log("y: " + String(y))


	return y;
}

function showCoords(event) {
  var x = event.clientX;
  var y = event.clientY;
  var coor = "X coords: " + x + ", Y coords: " + y;
  document.getElementById("demo").innerHTML = coor;
}

function clearCoor() {
  document.getElementById("demo").innerHTML = "";
}


if (isTouchDevice()) { // This is a touch device (e.g., a smartphone)

	// stickElem.ontouchstart = function (evt) {
	// 	window.trackThrottle = true;
	// 	window.requestedSteering = getXPosition(evt.touches[0].clientX);
	// 	window.requestedThrottle = getYPosition(evt.touches[0].clientY);
	// 	doDrive();
	// };

	// stickElem.ontouchmove = function (evt) {
	// 	//if (window.trackLightness) {
	// 		window.requestedSteering = getXPosition(evt.touches[0].clientX);
	// 		window.requestedThrottle = getYPosition(evt.touches[0].clientY);
	// 		doDrive();
	// 		evt.preventDefault();
	// 	//}
	// };

	// window.ontouchend = function () {
	// 	window.trackThrottle = false;
	// 	dragElem.requestedSteering = 0.0;
	// 	dragElem.requestedThrottle = 0.0;
	// 	// Make the stick returns to middle again
	// 	_stickAreaElem.style.left = '50%';
	// 	_stickAreaElem.style.top = '50%';
	// };

	// dragElem.addEventListener('ontouchstart', function(evt){
	// 	window.trackThrottle = true;
	// 	window.requestedSteering = getXPosition(evt.touches[0].clientX);
	// 	window.requestedThrottle = getYPosition(evt.touches[0].clientY);
	// 	doDrive();
	// });

	dragElem.addEventListener('touchmove', function(evt){
		//if (window.trackLightness) {
			window.requestedSteering = getXPosition(evt.touches[0].clientX);
			window.requestedThrottle = getYPosition(evt.touches[0].clientY);
			doDrive();
			evt.preventDefault();
		//d}
	});

	dragElem.addEventListener('touchend', function(evt){
		window.trackThrottle = false;
		window.requestedSteering = 0.0;
		window.requestedThrottle = 0.0;
		// Make the stick returns to middle again
		dragElem.style.left = '50%';
		dragElem.style.top = '50%';
	});


} else {  // This is a mouse device (e.g., a desktop computer)

	stickElem.onmousedown = function(evt) {
		if (evt.button == 0) {
			window.trackThrottle = true;
			window.requestedSteering = getXPosition(evt.clientX);
			window.requestedThrottle = getYPosition(evt.clientY);
			doDrive();
		}
	};

	stickElem.onmousemove = function(evt) {
		if (window.trackThrottle) {
			window.requestedSteering = getXPosition(evt.clientX);
			window.requestedThrottle = getYPosition(evt.clientY);
			doDrive();
		}
	};

	stickElem.onmouseup = function(evt) {
		if (evt.button == 0) {
			window.trackThrottle = false;
			window.requestedSteering = 0.0;
			window.requestedThrottle = 0.0;

		}
		// Make the stick returns to middle again
		_stickAreaElem.style.left = '50%';
		_stickAreaElem.style.top = '50%';

	};
}





