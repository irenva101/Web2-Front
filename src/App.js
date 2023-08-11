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
import ProtectedRoute from "./helpers/ProtectedRoute";

const App = () => {
  return (
    <div>
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
            element={
              <ProtectedRoute
                allowedRoles={["Kupac"]}
                component={PregledArtikala}
              />
            }
          />
          <Route
            path="/ulogovan-korisnik/prethodne-porudzbine"
            element={
              <ProtectedRoute
                allowedRoles={["Kupac"]}
                component={PrethodnePorudzbine}
              />
            }
          />
          {/*Prodavac moze da vidi */}

          <Route
            path="/ulogovan-korisnik/dodaj-artikal"
            element={
              <ProtectedRoute
                allowedRoles={["Prodavac"]}
                component={DodavanjeArtikla}
              />
            }
          />
          <Route
            path="/ulogovan-korisnik/moje-porudzbine"
            element={
              <ProtectedRoute
                allowedRoles={["Prodavac"]}
                component={StarePorudzbine}
              />
            }
          />
          <Route
            path="/ulogovan-korisnik/nove-porudzbine"
            element={
              <ProtectedRoute
                allowedRoles={["Prodavac"]}
                component={NovePorudzbine}
              />
            }
          />
          {/*Admin moze da vidi */}
          <Route
            path="/ulogovan-korisnik/verifikacija"
            element={
              <ProtectedRoute
                allowedRoles={["Admin"]}
                component={Verifikacija}
              />
            }
          />
          <Route
            path="/ulogovan-korisnik/prikaz-verifikacija"
            element={
              <ProtectedRoute
                allowedRoles={["Admin"]}
                component={PrikazVerifikacija}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
