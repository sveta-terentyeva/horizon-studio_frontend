function initMap() {
  const mapEl = document.querySelector(".js-location__map-el");

  const mapOptions = {
    zoom: 15,
    center: { lat: 34.0433683, lng: -118.2345218 },
  };

  const map = new google.maps.Map(mapEl, mapOptions);

  const marker = new google.maps.Marker({
    position: { lat: 34.0433683, lng: -118.2345218 },
    map: map,
  });

  // Custom HTML content for the InfoWindow
  const contentString = `
    <div style="font-size: 18px; font-weight: bold;">
      Horizon Studio
    </div>
  `;

  // Create an InfoWindow with the custom content
  const infoWindow = new google.maps.InfoWindow({
    content: contentString
  });

  // Open the InfoWindow near the marker
  infoWindow.open(map, marker);
}

document.addEventListener("DOMContentLoaded", function () {
  initMap();
});
