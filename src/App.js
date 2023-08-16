import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PocetnaStranica from "./components/PocetnaStranica";
import Registracija from "./components/Registracija";
import Logovanje from "./components/Logovanje";
import UlogovanKorisnik from "./components/UlogovanKorisnik";
import Profil from "./components/Profil";
import PregledArtikala from "./components/PregledArtikala";
import PrethodnePorudzbine from "./components/PrethodnePorudzbine";
import DodavanjeArtikla from "./components/DodavanjeArtikla";
import StarePorudzbine from "./components/StarePorudzbine";
import NovePorudzbine from "./components/NovePorudzbine";
import Verifikacija from "./components/Verifikacija";
import PrikazVerifikacija from "./components/PrikazVerifikacija";
import SvePorudzbine from "./components/SvePorudzbine";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const App = () => {
  const [user, setUser] = useState({});
  const [temp, setTemp] = useState(false);

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    var userObject = jwtDecode(response.credential);
    var email = userObject.email;
    var ime = userObject.given_name;
    console.log(userObject);

    setUser(userObject);
    document.getElementById("signInDiv").hidden=true;

    //slanje zahteva POST na server
    fetch(
      `https://localhost:44388/Korisnik/getKorisnikToken?email=${email}&ime=${ime}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log("Response from server:", data);
        var jwtToken = data["token"];
        localStorage.setItem("token", jwtToken);
        setTemp(true);
        window.location.href = "/ulogovan-korisnik/profil";
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "220695539326-hv8bcrgthi6ikj1sf0n1g2j2grbc4v9d.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    setTemp(false);

    google.accounts.id.prompt();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PocetnaStranica />} />
          <Route exact path="/pocetna-stranica" element={<PocetnaStranica />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="/logovanje" element={<Logovanje />} />
          <Route path="/ulogovan-korisnik/profil" element={<Profil />} />
          <Route path="ulogovan-korisnik" element={<UlogovanKorisnik />} />
          {/*Kupac moze da vidi */}
          <Route
            path="/ulogovan-korisnik/pregled-artikala"
            element={<PregledArtikala />}
          />
          <Route
            path="/ulogovan-korisnik/prethodne-porudzbine"
            element={<PrethodnePorudzbine />}
          />
          {/*Prodavac moze da vidi */}
          <Route
            path="/ulogovan-korisnik/dodaj-artikal"
            element={<DodavanjeArtikla />}
          />
          <Route
            path="/ulogovan-korisnik/moje-porudzbine"
            element={<StarePorudzbine />}
          />
          <Route
            path="/ulogovan-korisnik/nove-porudzbine"
            element={<NovePorudzbine />}
          />
          {/*Admin moze da vidi */}
          <Route
            path="/ulogovan-korisnik/verifikacija"
            element={<Verifikacija />}
          />
          <Route
            path="/ulogovan-korisnik/prikaz-verifikacija"
            element={<PrikazVerifikacija />}
          />
          <Route
            path="/ulogovan-korisnik/sve-porudzbine"
            element={<SvePorudzbine />}
          />
        </Routes>
      </BrowserRouter>
      <p></p>
      <div hidden id="signInDiv">

      </div>
    </div>
  );
};

export default App;
