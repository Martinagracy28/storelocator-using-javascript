var map;
var markers = [];
var infoWindow;
function initMap() {
	var losAngeles={lat:35.063380,lng:-118.358080}
	map = new google.maps.Map(document.getElementById('map'), {
		center: losAngeles,
		zoom: 4
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
    
}
function searchStores(){
	var foundStores = [];
	var zipcode = document.getElementById('zip-code-input').value;
	if(zipcode){
		stores.forEach(function(store){
		var postal = store.address.postalCode.substring(0,5);
		console.log(postal);
		if(postal == zipcode){
			foundStores.push(store);
		}
		
	});

	}
	else{
		foundStores = stores;
	}
	//console.log(foundStores);
	clearLocations();
	displayStores(foundStores);
	showStoresMarker(foundStores);
	setOnClickListener();
}
function clearLocations(){
	infoWindow.close();
         for (var i = 0; i < markers.length; i++) {
           markers[i].setMap(null);
         }
         markers.length = 0;
}
function setOnClickListener(){
	var storeElements = document.querySelectorAll('.store-container');
	storeElements.forEach(function(elem, index){
		elem.addEventListener('click', function(){
			google.maps.event.trigger(markers[index], 'click');
		})
	});
}
function displayStores(stores){
	var storesHtml = "";
	stores.forEach(function(store,index){
		var address = store.addressLines;
		var phone = store.phoneNumber;
		storesHtml += `
			<div class="store-container">
				<div class="store-container-background">
	          		<div class="store-number-container">
	            		<div class="store-number">
	              			${index+1}
	            		</div>
	          		</div>
	          		<div class="store-info-container">
	            		<div class="store-address">
	              			<span>${address[0]},</span>
	              			<span> ${address[1]}</span>  
	            		</div>
	            		<div class="store-phone-number">
	              			${phone}
	            		</div>  
	          		</div>
          		</div>
        	</div>
        `
	});
	document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarker(stores){
	var bounds = new google.maps.LatLngBounds();
	stores.forEach(function(store, index){
		var latlng = new google.maps.LatLng(
			store.coordinates.latitude,
            store.coordinates.longitude);
		var name = store.name;
		var address = store.addressLines[0];
		var status = store.openStatusText;
		var phone = store.phoneNumber;
		createMarker(latlng, name, address, status, phone, index);
		bounds.extend(latlng);
	})
	map.fitBounds(bounds);
}

function createMarker(latlng, name, address, status, phone, index) {
    var html = `
    <div class="store-info-window">
    	<div class="info-name">
    		${name}
    	</div>
    	<div class="info-status">
    		${status}
    	</div>
    	<div class="info-address">
    		<div class="circle">
    			<i class="fas fa-location-arrow"></i>
    			
    		</div>
    		${address}
    	</div>
    	<div class="info-phone">
    		<div class="circle">
    			<i class="fas fa-mobile-alt"></i>
    		</div>
    		${phone}
    	</div>
    </div>
    

    `
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: `${index+1}`
    });
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
          });
    markers.push(marker);
}