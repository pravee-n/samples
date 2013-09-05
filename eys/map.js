$( document ).ready( function () {
	var myLatlng = new google.maps.LatLng(37.790234970864, -122.39031314844);
	var circumferenceLatlng;

	function distanceBetweenLatlng (p1, p2) {
		if (!p1 || !p2) {
			return 0;
		}

		var R = 6371; // Radius of the Earth in km
		var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
		var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d;
	};

	(function initialize() {
		var mapOptions = {
			center: myLatlng,
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

		var marker = new google.maps.Marker({
			map: map,
			draggable: true,
			position: myLatlng,
			title: 'Move me!'
		});

		var circle = new google.maps.Circle({
			map: map,
			center: myLatlng,
			strokeWeight: 2,
			radius: 50000
		});

		circle.bindTo('center', marker, 'position');

		var circumferenceMarker = new google.maps.Marker({
			map: map,
			draggable: true,
			title: 'Drag me!'
		});

		var circleBounds = circle.getBounds();
		if ( circleBounds ) {
			var lng = circleBounds.getNorthEast().lng();
			circumferenceLatlng = new google.maps.LatLng(circle.getCenter().lat(), lng);
			circle.set( 'resizer_position', circumferenceLatlng );
		}

		circumferenceMarker.bindTo('position', circle, 'resizer_position');

		google.maps.event.addListener(circle, 'center_changed', function(){
            var circleBounds = circle.getBounds();
			if ( circleBounds ) {
				var lng = circleBounds.getNorthEast().lng();
				var circumferenceMarkerPosition = new google.maps.LatLng(circle.getCenter().lat(), lng);
				circle.set( 'resizer_position', circumferenceMarkerPosition );
			}
        });

        google.maps.event.addListener(circumferenceMarker, 'drag', function() {
			var circumferenceMarkerPos = circle.get('resizer_position');
  			var center = circle.get('center');
  			var distance = distanceBetweenLatlng(center, circumferenceMarkerPos);
  			circle.set('radius', distance * 1000 );
		});

	})();

} );