const carica = () => {
    return new Promise((resolve, reject) => {
        fetch('https://ws.cipiaceinfo.it/cache/get', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            key: myToken,
          },
          body: JSON.stringify({
            key: myKey,
          }),
        })
          .then((r) => r.json())
          .then((r) => {
            console.log(r);
            let temp = r.result;
            temp.forEach((item) => {
                places.push({ name: item.name, coords: [parseFloat(item.coords.lat), parseFloat(item.coords.lon)] });
            });
            resolve();
          })
          .catch((error) => {
            console.error('Errore durante il download:', error);
            reject(error);
          });
      });
}
let places = [];
let nome_posto = document.getElementById("nome_posto");
const button = document.getElementById("button");
const myToken = '3f69d78a-4667-4c9a-a383-1ef9fafccc56';
const myKey = 'Mappa_1';

button.onclick = () => {
    let posto = nome_posto.value;
    let url = `https://us1.locationiq.com/v1/search?key=pk.14e9e9594c31470d8daa53f275925ea9&q=${posto}&format=json`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
       let lat = parseFloat(data[0]["boundingbox"][0]);
       let lon = parseFloat(data[0]["boundingbox"][2]);
       places.push({ name: posto, coords: [lat, lon] });
       fetch('https://ws.cipiaceinfo.it/cache/set', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            key: myToken,
          },
          body: JSON.stringify({
            key: myKey,
            value: places,
          }),
       })
       .then((r) => r.json())
       .then((r) => {
          console.log(r.result);
       });
    });
};

carica().then(() => {
    let zoom = 12;
    let maxZoom = 19;
    let map = L.map('map').setView(places[0].coords, zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: maxZoom,
       attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    places.forEach((place) => {
       const marker = L.marker(place.coords).addTo(map);
       marker.bindPopup(`<b>${place.name}</b>`);
    });
});