import { Link} from "react-router-dom";
import React from "react";
import jwtDecode from "jwt-decode";

const UlogovanKorisnik = () => {
  const getUserRole = () => {
    var token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  };

  var role = getUserRole();
  console.log(role);

  return (
    <div>
      <h1 style={{ color: "#279980" }}>Pocetna stranica</h1>
      

      {(role === "Kupac" || role === "Prodavac" || role === "Admin") && (
        <>
          <Link to="/ulogovan-korisnik/profil">Profil</Link>
          <p></p>
        </>
      )}
      {role === "Kupac" && (
        <>
          <Link to="/ulogovan-korisnik/pregled-artikala">Nova porudzbina</Link>
          <p></p>
          <Link to="/ulogovan-korisnik/prethodne-porudzbine">
            Prethodne porudzbine
          </Link>
          <p></p>
        </>
      )}

      {role === "Prodavac" && (
        <>
          <Link to="/ulogovan-korisnik/dodaj-artikal">Dodaj artikal</Link>
          <p></p>
          <Link to="/ulogovan-korisnik/moje-porudzbine">Moje porudzbine</Link>
          <p></p>
          <Link to="/ulogovan-korisnik/nove-porudzbine">Nove porudzbine</Link>
          <p></p>
        </>
      )}

      {role === "Admin" && (
        <>
          <Link to="/ulogovan-korisnik/verifikacija">Verifikacija</Link>
          <p></p>
          <Link to="/ulogovan-korisnik/sve-porudzbine">Sve porudzbine</Link>
        </>
      )}
      
    </div>
  );
};

export default UlogovanKorisnik;
