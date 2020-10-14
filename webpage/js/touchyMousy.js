
var throttleElem = document.getElementById('throttleDiv');

window.trackThrottle = false;
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


function getThrottlePosition(pageX, pageY) {
	//console.log(pageX, pageY)
	//var x = 2*(pageX + window.scrollX - throttleElem.offsetLeft - (throttleElem.width / 2)) / throttleElem.width;
	var y = -2*(pageY + window.scrollY - throttleElem.offsetTop - (throttleElem.offsetHeight/ 2)) / throttleElem.offsetHeight;
	console.log("pageY: " + String(pageY));
	console.log("window.scrollY: " + String(window.scrollY));
	console.log("throttleElem.offsetTop: " + String(throttleElem.offsetTop));
	console.log("throttleElem.offsetHeight: " + String(throttleElem.offsetHeight));
	console.log("y: " + String(y));


	return y;
}




if (isTouchDevice()) { // This is a touch device (e.g., a smartphone)

	throttleElem.ontouchstart = function (evt) {
		window.trackThrottle = true;
		window.requestedThrottle = getThrottlePosition(evt.touches[0].clientX, evt.touches[0].clientY);
		doThrottle();
	};

	throttleElem.ontouchmove = function (evt) {
		if (window.trackLightness) {
			window.requestedThrottle = getThrottlePosition(evt.touches[0].clientX, evt.touches[0].clientY);
			doThrottle();
			evt.preventDefault();
		}
	};

	window.ontouchend = function () {
		window.trackThrottle = false;
	};

} else {  // This is a mouse device (e.g., a desktop computer)

	throttleElem.onmousedown = function(evt) {
		if (evt.button == 0) {
			window.trackThrottle = true;
			window.requestedThrottle = getThrottlePosition(evt.clientX, evt.clientY);
			doThrottle();
		}
	};

	throttleElem.onmousemove = function(evt) {
		if (window.trackThrottle) {
			window.requestedThrottle = getThrottlePosition(evt.clientX, evt.clientY);
			doThrottle();
		}
	};

	window.onmouseup = function(evt) {
		if (evt.button == 0) {
			window.trackThrottle = false;
		}
	};
}



