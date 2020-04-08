var ingredients = [];

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});


function displayRecipes() {
	$.ajax({
		url: 'https://api.edamam.com/search?q=' + ingredients + '&app_id=b8fa8ec0&app_key=2e99e135530eaed01cb9620b24c1f1c0'
	}).then(function(response) {
		
		var intCalories = (response.hits[0].recipe.calories)/(response.hits[0].recipe.yield);
		var calories = (Math.floor(intCalories));
		var results = response.hits;

		for (i = 0; i < results.length; i++) {
			var intCalories = (results[i].recipe.calories)/(results[i].recipe.yield);
			var calories = (Math.floor(intCalories));
			console.log(calories);
			var recipeDiv = $('<div>');
			var recipeImage = $('<img>');
			var recipeCaption = $('<div>');
			var recipeBtnDiv = $('<div>');
			var caloriesP = $('<p>');
			recipeCaption.addClass('caption');
			recipeCaption.append($('<h3>').text(results[i].recipe.label));
			recipeCaption.addClass('text-center');
			caloriesP.text(calories + ' calories per serving');
			recipeCaption.append(caloriesP)
			recipeBtnDiv.append($('<a>').append($('<button>').addClass('btn btn-primary').text('Go to recipe')).attr('href',results[i].recipe.url).attr('target','_blank'));
			recipeBtnDiv.append($('<button>').text('Activity').addClass('btn btn-primary recipeButton'));
			recipeCaption.append(recipeBtnDiv);
			recipeImage.attr('src', results[i].recipe.image);
			recipeDiv.addClass('thumbnail col-md-4 recipe');
			recipeDiv.append(recipeImage);
			recipeDiv.append(recipeCaption);
			$('#recipeDisplay').prepend(recipeDiv);

			if (calories < 50) {
				console.log("This recipe IS FRIDGEfit! Burn it off by walking to the kitchen and getting some ice cream.")
			} else if (calories >= 50 && calories <= 100) {
				console.log("Way to be healthy! Burn off those 'lil calories with some thumb exercises as you text your friends about how healthy you are!")
			} else if (calories > 100 && calories < 300) {
				console.log("You know how to burn off all those calories? Clean your fridge inside and out! Besides, you never know what ingredients you may find for your next recipe!")
			} else if (calories >= 300 && calories < 500) {
				console.log("O M FRIDGEFit G! You are so healthy! Jump up and down to celebrate and then you'll have burned off those calories in no time!")
			} else if (calories >= 500 && calories < 750) {
				console.log("Now would be a really good time to take your dog on a walk to burn off those calories. Oh, don't have one? Yeah, just take yourself on a walk...")
			} else if (calories >= 750 && calories < 1000) {
				console.log("LOL your fridge is slighttttly judging you right now...")
			} else if (calories >= 1000 && calories < 2000) {
				console.log("Okay, you should totally take a walking trip to the farthest grocery store to burn off all those calories...")
			} else if (calories >= 2000) {
				console.log("Looking for a way to burn off those calories? We know there's a mountain by the name of Everest that could use some climbing...")
			};
		};
		$('#numIngredients').html(ingredients.length);
			for (var j = 0; j < ingredients.length; j++) {
			var ingredientDiv = $('<div>').text(ingredients[j]);
			var ingredientClose = $('<button>').text('x').addClass('ingredientListBtn').attr('name', ingredients[j]);
			ingredientDiv.append(ingredientClose);
			$('#ingredients-list').prepend(ingredientDiv);
		};
	});
};

$('#ingredientsSearchBtn').on('click', function(event){
	event.preventDefault();
	var ingredient = $('#ingredientsSearchBar').val().trim();
	var ingredientStr = String(ingredient);

	ingredients.push(ingredient);
	$('#ingredientsSearchBar').val('');
	$('#ingredients-list').empty();
	displayRecipes();
	console.log(ingredients);
});

$(document).on('click', '.ingredientListBtn', function() {
	$($(this).parent()).remove();

});

		var streetAddress = "";
		var city = "";
		var state = "";
		var groceryChoice;
		var groceryStoresArray = [];
		var centerArray = [];
		var positionArray = [];
		var groceryNameArray = [];
		var groceryInfoObject = {name:[], address:[], ID:[]};
		var addressEdit = [];
		var infoArray = [];
		var infoURL;
		var chosenGroceryName;

		$("#map").hide();

	$(".zipbutton").on( "click", function(event) {
		event.preventDefault();
		zipCode = $(".zipinput").val().trim();
		$("#map").show();
		groceryStoresArray = [];
		centerArray = [];
		positionArray = [];
		groceryInfoObject = {name:[], address:[], url:[]};
		
		$(".zipinput").keyup(function(event) {
			if (event.keyCode == 13) {
			  $(".zipbutton").click();
			}
		  });
		  
$.ajax({
	url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=grocery+stores+in+' + zipCode + '&radius=1&key=AIzaSyC10w2038KqjWrYLulCTPIC3RNqTMd9g74'
}).then(function(response) {

	for (i = 0; i < 9; i++){
		var groceryChoice = response.results[i].geometry.location;
		var groceryName = response.results[i].name;
		groceryInfoObject.name.push(groceryName);
		var groceryAddress = response.results[i].formatted_address;
		groceryInfoObject.address.push(groceryAddress);
		addressEdit = groceryAddress.split(/[ ,]+/).join("+");
		groceryInfoURL(addressEdit);
		groceryInfoObject.url.push(infoURL);
		var groceryString = JSON.stringify(groceryChoice);
		var groceryStores = groceryString.replace(/"/g,'').replace(/lat/g, '').replace(':', '').replace(/lng/g, ' ').replace(/""/g, '').replace(/:/g, '').replace(/{/g, '').replace(/}/g, '');
		groceryStoresArray.push(groceryStores)
		var commaPos = groceryStores.indexOf(',');
		var coordinatesLat = parseFloat(groceryStoresArray[i].substring(0, commaPos));
		var coordinatesLong = parseFloat(groceryStoresArray[i].substring(commaPos + 1, groceryStoresArray[i].length));
		var centerPoint = new google.maps.LatLng(coordinatesLat, coordinatesLong);
		var position = new google.maps.LatLng(coordinatesLat, coordinatesLong);
		centerArray.push(centerPoint);
		positionArray.push(position);
		initMap(positionArray, groceryInfoObject)}
	})})

	function groceryInfoURL(address) {
		infoURL = "https://www.google.com/maps/dir/?api=1&destination=" + address + "&travelmode=walking";
	}

	function initMap(){
	var map;
	var infowindow;

	var map = new google.maps.Map(document.getElementById("map"), {
	zoom: 13,
	center: positionArray[0],
	mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	var infowindow = new google.maps.InfoWindow({});

	var marker, i;

	for (i = 0; i < 9; i++) {

		marker = new google.maps.Marker({
			position: positionArray[i],
			map: map
	});

	// function locate(){
	// 	if ("geolocation" in navigator){
	// 		navigator.geolocation.getCurrentPosition(function(position){ 
	// 			var currentLatitude = position.coords.latitude;
	// 			var currentLongitude = position.coords.longitude;
	// 			var infoWindowHTML = "Latitude: " + currentLatitude + "<br>Longitude: " + currentLongitude;
	// 			var infoWindow = new google.maps.InfoWindow({map: map, content: infoWindowHTML});
	// 			var currentLocation = { lat: currentLatitude, lng: currentLongitude };
	// 			infoWindow.setPosition(currentLocation);
	// 		});}}


	google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
	
		chosenGroceryName = groceryInfoObject.name[i];
		infowindow.setContent('<div id="groceryinfo"><strong>' + groceryInfoObject.name[i] + '</strong><br>' +
		groceryInfoObject.address[i] + '<br>' + '<a href=' +  groceryInfoObject.url[i] + ' target="_blank">' + "Click to burn off this meal from your location" + "</a>" + '<br></div>')

		infowindow.open(map, marker);
	
		var origin1 = positionArray[i];
		var destinationA = groceryInfoObject.address[i];
		console.log(destinationA);
		var service = new google.maps.DistanceMatrixService;
		service.getDistanceMatrix({
		origins: [origin1],
		destinations: [destinationA],
		travelMode: 'WALKING',
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		avoidHighways: true,
		}, function(response, status) {
		if (status !== 'OK') {
			alert('Error was: ' + status);
		} else {
			var originList = response.originAddresses;
			console.log(response);
			var destinationList = response.destinationAddresses;
			var outputDiv = document.getElementById('output');
			outputDiv.innerHTML = '';

			var showGeocodedAddressOnMap = function(asDestination) {
			var icon = asDestination ? destinationIcon : originIcon;
			return function(results, status) {
				if (status === 'OK') {
				map.fitBounds(bounds.extend(results[0].geometry.location));
				markersArray.push(new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					icon: icon
				}));
				} else {
				alert('Geocode was not successful due to: ' + status);
				}
			};
			};

			for (var i = 0; i < originList.length; i++) {
			var results = response.rows[i].elements;
			for (var j = 0; j < results.length; j++) {
				outputDiv.innerHTML += outputDiv.innerHTML += `Take a nice brisk walk to ` + `<strong>` + chosenGroceryName + `</strong>` +  ` to pick up any remaining ingredients ANNNND burn off some calories! It'll only take you ` + results[j].distance.text + `, or ` + results[j].duration.text + `, to get there from ZIP code ` + zipCode + `. GET MOVIN'!`;}}}});

	
	}
	}
	)(marker, i));
		
	}
	}