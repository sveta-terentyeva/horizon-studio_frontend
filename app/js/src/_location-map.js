async function initMap() {
  const mapEl = document.querySelector(".js-location__map-el");

  try {
    // Fetch the map settings from the API
    const response = await fetch('/api/googleMapSettings');
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch Google Map settings');
    }

    // Parse the JSON data from the response
    const data = await response.json();
    const { zoom, location, contentString } = data;

    // Set up map options using data from the API
    const mapOptions = {
      zoom: zoom,
      center: location,
    };

    // Initialize the map with the specified options
    const map = new google.maps.Map(mapEl, mapOptions);

    // Create a marker for the location
    const marker = new google.maps.Marker({
      position: location,
      map: map,
    });

    // Create an InfoWindow with custom content
    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // Open the InfoWindow near the marker
    infoWindow.open(map, marker);
  } catch (error) {
    // Handle any errors that occur during the fetch or map initialization
    console.error("Error loading Google Map settings:", error);
  }
}

// Wait for the DOM to load before initializing the map
document.addEventListener("DOMContentLoaded", function () {
  initMap();
});
