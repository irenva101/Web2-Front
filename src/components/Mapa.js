import { Icon } from "leaflet";
import React, { useState, useEffect } from "react";
import otkaceno from "../images/correct.png";
import mapa from "../mapa.css";
import "leaflet/dist/leaflet.css";
import "../services/MapaService";
import jwtDecode from "jwt-decode";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Mapa = () => {
  const [porudzbine, setPorudzbine] = useState([]);
  const [final, setFinal] = useState([]);
  const [selectedPorudzbinaId, setSelectedPorudzbinaId] = useState(null);
  const [isporuceno, setIsIsporuceno] = useState(false);
  const [statusPorudzbine, setStatusPorudzbine] = useState({});

  const customIcon = new Icon({
    iconUrl: require("../images/marker-icon.png"),
    iconSize: [38, 38],
  });

  useEffect(() => {
    var token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);

    fetch(
      `https://localhost:44388/Porudzbina/allPorudzbineProdavcaNove?korisnikId=${decodedToken["Id"]}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPorudzbine(data);

        const initialStatus = {};
        data.forEach((porudzbina) => {
          initialStatus[porudzbina.id] = false;
        });
        setStatusPorudzbine(initialStatus);

        const promises = data.map(async (porudzbina) => {
          try {
            // Geokodiranje adreseDostave preko Nominatim servisa
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              porudzbina.adresaDostave + ", Novi Sad, Srbija"
            )}`;
            const response = await fetch(nominatimUrl);
            const geocodeData = await response.json();

            if (geocodeData.length > 0) {
              const { lat, lon } = geocodeData[0];
              // Dodajte latitude i longitude u porudžbinu
              porudzbina.geocode = [parseFloat(lat), parseFloat(lon)];
            }
          } catch (error) {
            console.error("Greška prilikom geokodiranja adrese:", error);
          }
          return porudzbina;
        });

        Promise.all(promises)
          .then((porudzbineWithGeocode) => {
            setFinal(porudzbineWithGeocode);
          })
          .catch((error) => {
            console.error(
              "Greška prilikom dobavljanja geokodiranih podataka:",
              error
            );
          });
      })
      .catch((error) => {
        console.error(
          "Greška prilikom dobavljanja podataka sa servera:",
          error
        );
      });
  }, []);

  useEffect(() => {
    var token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    if (selectedPorudzbinaId !== null) {
      // Izgradite URL sa ID-om selektovane porudžbine
      const requestUrl = `https://localhost:44388/Porudzbina/isporuciPorudzbinu?porudzbinaId=${selectedPorudzbinaId}`;

      // Sada možete izvršiti zahtev na bekend koristeći fetch ili axios ili drugi biblioteke
      // Na primer:
      fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
      })
        .then((response) => {
          // Obradite odgovor od bekenda ovde
          setIsIsporuceno(true);
        })
        .catch((error) => {
          console.error("Greška prilikom slanja zahteva na bekend:", error);
        });

      // Resetujte selectedPorudzbinaId nakon što ste završili slanje zahteva
      setSelectedPorudzbinaId(null);
    }
  }, [selectedPorudzbinaId]);

  return (
    <MapContainer center={[45.267136, 19.833549]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {final.map((marker) => (
        <Marker key={marker.id} position={marker.geocode} icon={customIcon}>
          <Popup>
            <p>{marker.adresaDostave}</p>
            {statusPorudzbine[marker.id] ? (
              <img
                src={otkaceno}
                alt="Isporuceno"
                className="manja-ikona"
              />
            ) : (
              <button
                onClick={() => {
                  // Ovde označavate porudžbinu kao isporučenu
                  setStatusPorudzbine((prevStatus) => ({
                    ...prevStatus,
                    [marker.id]: true,
                  }));
                  setSelectedPorudzbinaId(marker.id);
                }}
              >
                Posalji porudzbinu
              </button>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Mapa;
