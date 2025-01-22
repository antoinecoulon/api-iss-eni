// Récupérer les coordonnées de la station spatiale internationale (ISS) en temps réel
fetch("http://api.open-notify.org/iss-now.json")
  .then((response) => response.json())
  .then((resources) => {
    console.log(resources.iss_position);

    const $resultDiv = document.querySelector("#results");
    const coordinates = `Latitude: ${resources.iss_position.latitude} - Longitude: ${resources.iss_position.longitude}`;

    $resultDiv.innerHTML = coordinates;

    let issLatitude = resources.iss_position.latitude;
    let issLongitude = resources.iss_position.longitude;

    // Initialiser la carte avec la librairie Leaflet
    const map = L.map("map").setView([issLatitude, issLongitude], 5);

    // Importer la carte OpenStreetMap
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Personnaliser le marqueur
    const myIcon = L.icon({
      iconUrl: "my-icon.png",
      iconSize: [32, 32],
      //   iconAnchor: [22, 94],
      //   popupAnchor: [-3, -76],
    });
    // Ajouter un marqueur
    const marker = L.marker([issLatitude, issLongitude], {
      icon: myIcon,
    }).addTo(map);

    // Mettre à jour la position du marqueur toutes les 3 secondes
    setInterval(() => {
      fetch("http://api.open-notify.org/iss-now.json")
        .then((response) => response.json())
        .then((resources) => {
          const newLatitude = resources.iss_position.latitude;
          const newLongitude = resources.iss_position.longitude;

          // Mettre à jour la position du marqueur
          marker.setLatLng([newLatitude, newLongitude]);

          // Centrer la carte sur la nouvelle position
          map.setView([newLatitude, newLongitude], map.getZoom());

          // Mettre à jour les coordonnées affichées
          $resultDiv.innerHTML = `Latitude: ${newLatitude} - Longitude: ${newLongitude}`;
        })
        .catch((err) => console.error(err));
    }, 3000);
  })
  .catch((err) => {
    console.error(err);
    document.querySelector(".error").innerHTML = `<strong>${err}</strong>`;
  })
  .finally((completed) => console.log("Completed Request"));

// Récupérer les informations des astronautes dans l'espace
fetch("http://api.open-notify.org/astros.json")
  .then((response) => response.json())
  .then((resources) => {
    console.log(resources);
    let numberOfAstronauts = resources.number;
    const divPeople = document.getElementById("people-list");
    divPeople.innerHTML = `Il y a <strong>${numberOfAstronauts}</strong> astronautes dans l'espace :`;

    let astronauts = resources.people;
    for (let astronaut of astronauts) {
      const li = document.createElement("li");
      li.textContent = `${astronaut.craft} ${astronaut.name}`;
      divPeople.appendChild(li);
    }
  });
