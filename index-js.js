let cordinate = [
  {
     coords: [45.4639102, 9.1906426]
  }
]
let places =[];
import { API_KEY } from './.gitignore/config.js';
let nome_posto = document.getElementById("nome_posto")
const button = document.getElementById("button")
button.onclick = () => {
  let posto = nome_posto.value;
  const url = `https://us1.locationiq.com/v1/search?key=${API_KEY}&q=${posto}&format=json&`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
     console.log(data[0]["boundingbox"][0],data[0]["boundingbox"][2])
     let lat = data[0]["boundingbox"][0]
     let lon = data[0]["boundingbox"][2]
     places.push({name : posto, coords : [lat , lon]})
     mappa();
  })
}
let zoom = 12;
let maxZoom = 19;
let map = L.map('map').setView(cordinate[0].coords, zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: maxZoom,
  attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
function mappa(){
  places.forEach((place) => {
     const marker = L.marker(place.coords).addTo(map);
     marker.bindPopup("<b>${place.name}</b>");
  });
}