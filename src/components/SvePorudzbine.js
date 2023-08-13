import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const SvePorudzbine = () => {
  var token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  console.log(decodedToken["Id"]);

  const [porudzbine, setPorudzbine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [korisnici, setKorisnike] = useState([]);

  //funkcija koja nam formatira datum iz 2023-08-12T17:06:22.196 u 12-08-2023 17:06 i govori status
  const formatDateGetStatus = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const date = new Date(dateString);
    const currentTime = new Date();

    if (date <= currentTime) {
      return <span style={{ color: 'green' }}>Isporuceno</span>;
    } else {
      return <span style={{ color: 'orange' }}>U toku je isporuka...</span>;
    }
  };

  //funcija koja na idKorisnika daje njegov username
  const getUsernameKorisnika = (id) => {
    const korisnik = korisnici.find((korisnik) => korisnik.id === id);
    return korisnik ? korisnik.korisnickoIme : "Nepoznat korisnik";
  };

  useEffect(() => {
    fetch(`https://localhost:44388/Porudzbina/allPorudzbine`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setPorudzbine(data);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        console.error("Greska prilikom dohvatanja svih porudzbina sa servera.");
      });

    fetch(`https://localhost:44388/Korisnik/allKorisnike`, {
      method: "GET",
      headers: {
        "Contetnt-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setKorisnike(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Greska prilikom dohvatanja svih korisnika sa servera.");
      });
  }, []);

  return (
    <div>
      <h1>Prikaz svih porudzbina</h1>
      {loading ? (
        <p>Učitavanje...</p>
      ) : porudzbine.length === 0 ? (
        <p>Trenutno nema porudzbina</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ color: "#279980" }}>Kupac</th>
              <th style={{ color: "#279980" }}>Adresa dostave</th>
              <th style={{ color: "#279980" }}>Komentar</th>
              <th style={{ color: "#279980" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {porudzbine.map((porudzbina) => (
              <tr key={porudzbina.id}>
                <td>{getUsernameKorisnika(porudzbina.korisnikId)}</td>{" "}
                {/*ovde*/}
                <td>{porudzbina.adresaDostave}</td>
                <td>{porudzbina.komentar}</td>
                <td>{formatDateGetStatus(porudzbina.vremeIsporuke)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SvePorudzbine;
