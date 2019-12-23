// Store our API endpoint inside queryUrl
// NB: Default time horizon is from the present time (i.e.,right now) up tp 30 days ago - that's what we want
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson" +
  "&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


  var circleArray = new Array();

  // Loop through the cities array and create one marker for each earthquake object
  for (var i = 0; i < earthquakeData.length; i++) {

    coordinates = [earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]]
    properties = earthquakeData[i].properties;

    var color = "";
    if (properties.mag < 1) {
      color = "hsl(110, 81%, 50%)";
    }
    else if (properties.mag < 2) {
      color = "#dbf300";
    }
    else if (properties.mag < 3) {
      color = "#e2b00e";
    }
    else if (properties.mag < 4) {
      color = "rgb(226, 92, 14)";
    }
    else if (properties.mag < 5) {
      color = "rgb(204, 14, 14)";
    }

    // Add circles to map
    var myCircle = L.circle(coordinates, {
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      radius: (properties.mag * 15000)
    }).bindPopup("<h3>" + properties.place + "</h3> <hr> <h3>Magnitude: " + properties.mag.toFixed(1) + "</h3>" + "<hr> <h4>Occurence: " +  new Date(properties.time) + "</h4>" + "</h3> <hr> Coordinates:" + coordinates + "</h3>") ;
    //Add the cricle to the array
    circleArray.push(myCircle);
  }


  //Create the layer for the circles
  var earthquakes = L.layerGroup(circleArray);

  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Satellite Map": satellitemap,
    "Outdoors Map": outdoorsmap,
    "Light Map": lightmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap,earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
