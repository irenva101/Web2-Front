import { Link} from "react-router-dom";
import React from "react";
import jwtDecode from "jwt-decode";
import "../../src/Pocetna.css";

const centerContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  textAlign: "center",
};

const linkStyle = {
  margin: "10px 0",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "5px",
};

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
  const getUserVerification=()=>{
    var token = localStorage.getItem("token");
    const decodedToken=jwtDecode(token);
    return decodedToken["Verifikovan"];
  }
  
  var role = getUserRole();
  var verification=getUserVerification();
  console.log(role);
  console.log(verification);
  
  
    const commonLinkStyle={ textDecoration: "none", fontSize: "18px", marginBottom: "10px" };
  

  return (
    <div style={centerContentStyle}>
      <h1  className="page-title">Pocetna stranica</h1>
  
      {(role === "Kupac" || role === "Prodavac" || role === "Admin") && (
        <div className="link-section">
        <>
          <Link to="/ulogovan-korisnik/profil" style={{ ...commonLinkStyle, color: "#007bff" }}>
            Profil
          </Link>
          <p></p>
        </>
        </div>
      )}
      {role === "Kupac" && (
        <>
         <div className="link-section">
          <Link
            to="/ulogovan-korisnik/pregled-artikala"
            style={{ ...commonLinkStyle, color: "#007bff" }}
            >
            Nova porudzbina
          </Link>
          <p></p>
            </div>
          
            <div className="link-section">
          <Link
            to="/ulogovan-korisnik/prethodne-porudzbine"
            style={{ ...commonLinkStyle, color: "#007bff" }}
          >
            Prethodne porudzbine
          </Link>
          <p></p>
        </div>
        </>
      )}
  
      {role === "Prodavac" &&  verification==="True" &&(
        <>
         <div className="link-section">
          <Link
            to="/ulogovan-korisnik/dodaj-artikal"
            style={{ ...commonLinkStyle, color: "#007bff" }}
          >
            Dodaj artikal
          </Link>
          </div>
          <p></p>
          <div className="link-section">
          <Link
            to="/ulogovan-korisnik/moje-porudzbine"
            style={{ ...commonLinkStyle, color: "#007bff" }}
          >
            Moje porudzbine
          </Link>
          </div>
          <p></p>
          <div className="link-section">
          <Link
            to="/ulogovan-korisnik/nove-porudzbine"
            style={{ ...commonLinkStyle, color: "#007bff" }}
          >
            Nove porudzbine
          </Link>
          </div>
          <p></p>
        </>
      )}
  
      {role === "Admin" && (
        <>
         <div className="link-section">
          <Link
            to="/ulogovan-korisnik/verifikacija"
            style={{ ...commonLinkStyle, color: "#007bff" }}
            >
            Verifikacija
          </Link>
            </div>
            <div className="link-section">
          <p></p>
          <Link
            to="/ulogovan-korisnik/sve-porudzbine"
            style={{ ...commonLinkStyle, color: "#007bff" }}
          >
            Sve porudzbine
          </Link>
          </div>
        </>
        
      )}
    </div>
  );
};

export default UlogovanKorisnik;
