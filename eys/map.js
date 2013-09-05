$( document ).ready( function () {
	var myLatlng = new google.maps.LatLng(37.790234970864, -122.39031314844);
	var circumferenceLatlng;
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
			circumferenceLatlng = new google.maps.LatLng(map.getCenter().lat(), lng);
			circle.set( 'resizer_position', circumferenceLatlng );
		}
		// circumferenceMarker.setPosition( circumferenceLatlng );

		circumferenceMarker.bindTo('position', circle, 'resizer_position');

		google.maps.event.addListener(circle, 'center_changed', function(){
            var circleBounds = circle.getBounds();
			if ( circleBounds ) {
				var lng = circleBounds.getNorthEast().lng();
				var circumferenceMarkerPosition = new google.maps.LatLng(circle.getCenter().lat(), lng);
				circle.set( 'resizer_position', circumferenceMarkerPosition );
			}
        });

	})();

} );