let coordinates = [41.7, 44.8];
let businesses = [];
let map = {};
let zoomIn;
let zoomOut;
window.onload = async () => {
  //let coords = await getCoords();
  // coordinates = coords;
  buildMap();
};

// async function getCoords() {
//   const pos = await new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
//   return [pos.coords.latitude, pos.coords.longitude];
// }

// build leaflet map
function buildMap() {
  map = L.map("map").setView(coordinates, 15);
  // add openstreetmap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  // create and add geolocation marker
  const marker = L.marker(coordinates);
  marker.addTo(map).bindPopup("<p1><b>You are here</b><br></p1>").openPopup();
  zoomIn = document.querySelector(".leaflet-control-zoom-in");
  zoomOut = document.querySelector(".leaflet-control-zoom-out");
}

// get foursquare businesses
async function getFoursquare(business) {
  let limit = 5;
  let lat = coordinates[0];
  let lon = coordinates[1];

  let response = await fetch(
    `https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8=",
      },
    }
  );

  let data = await response.json();
  let places = data.results;
  console.log(places);
  return places;
}

// process foursquare array
function processBusinesses(data) {
  let nearbyBusinesses = data.map((element) => {
    let location = {
      name: element.name,
      lat: element.geocodes.main.latitude,
      long: element.geocodes.main.longitude,
    };
    return location;
  });
  businesses = nearbyBusinesses;
}

// add business markers
function addMarkers() {
  businesses.forEach((business) => {
    let marker = L.marker([business.lat, business.long]);
    marker.addTo(map).bindPopup(`<p1>${business.name}</p1>`).openPopup();
    console.log("processing");
  });
}

// business submit button
document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();
  let business = document.getElementById("business").value;
  let data = await getFoursquare(business);
  let process = await processBusinesses(data);
  addMarkers();
  console.log("submitted");
});
