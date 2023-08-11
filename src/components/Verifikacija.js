import React, { useState, useEffect } from "react";
import PrikazVerifikacija from "./PrikazVerifikacija";

const Verifikacija = () => {
  const [prodavac, setProdavce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString)
      .toLocaleDateString("en-US", options)
      .replace(/\//g, "-");
  };

  useEffect(() => {
    //slanje tokena u zaglavlju svakog zahteva
    var token = localStorage.getItem("token");
    if (!token) {
      console.error("Token nije prisutan u localStorage-u.");
      return; // Ovde možete izvršiti odgovarajuće akcije ukoliko token nije prisutan.
    }

    // Pretpostavićemo da se JWT token sastoji iz tri dela (header, payload, signature) razdvojenih tačkom.
    var tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.error("Neispravan format tokena.");

      return; // Ovde možete izvršiti odgovarajuće akcije ukoliko format nije ispravan.
    }

    fetch("https://localhost:44388/Korisnik/neverProdavce", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok.`);
        }
        return response.json();
      })
      .then((data) => {
        setProdavce(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Greska prilikom dobavljanja podataka sa servera:",
          error
        );
        setLoading(false);
      });
  }, []);

  const handleVerifikacija = (index, email) => {
    // Implementirajte logiku za verifikaciju
    console.log(`Verifikacija prodavca sa indeksom ${index}`);
    setEmail(email);

    const emailData = {
      Receiver: email,
      Subject: "Registracija(WEB2)",
      Body: "Postovani, vasa registracija je odobrena.",
    };

    fetch(`https://localhost:44388/Korisnik/verProdavca?idKorisnika=${index}`, {
      method: "POST",
      body: JSON.stringify(index),
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        //ovde odradi fetch za post za slanje mejla
        fetch("https://localhost:44388/Email/emailService", {
          body: JSON.stringify(emailData),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        })
          .then((Response) => Response.json())
          .then((data) => {
            console.log("Poslali mejl da smo validirali nalog.");
          })
          .catch((error) => {
            //obrada greske
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOdbijVerifikaciju = (index, email) => {
    // Implementirajte logiku za odbijanje verifikacije
    console.log(`Odbijanje verifikacije prodavca sa indeksom ${index}`);

    setEmail(email);
    const emailData = {
      Receiver: email,
      Subject: "Registracija(WEB2)",
      Body: "Postovani, vasa registracija je odbijena.",
    };

    fetch(
      `https://localhost:44388/Korisnik/neverProdavca?idKorisnika=${index}`,
      {
        method: "POST",
        body: JSON.stringify(index),
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        //fetch za odbijanje verifikacije
        fetch("https://localhost:44388/Email/emailService", {
          body: JSON.stringify(emailData),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        })
          .then((Response) => Response.json())
          .then((data) => {
            console.log("Poslali mejl da odbijemo validaciju.");
          })
          .catch((error) => {
            //obrada greske
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1 style={{ color: "#279980" }}>
        Prodavci koji cekaju na verifikaciju naloga
      </h1>

      {loading ? (
        <p>Učitavanje...</p>
      ) : prodavac.length === 0 ? (
        <p>Trenutno nema korisnika koji cekaju na verifikaciju.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Slika</th>
              <th>Korisnicko Ime</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Email</th>
              <th>Datum rodjenja</th>
              <th>Adresa</th>
              <th>Postarina</th>
            </tr>
          </thead>
          <tbody>
            {prodavac.map((prodavac) => (
              <tr key={prodavac.id}>
                <td>{prodavac.slikaKorisnika}</td>
                <td>{prodavac.korisnickoIme}</td>
                <td>{prodavac.ime}</td>
                <td>{prodavac.prezime}</td>
                <td>{prodavac.email}</td>
                <td>{formatDate(prodavac.datumRodjenja)}</td>
                <td>{prodavac.adresa}</td>
                <td>{prodavac.postarina}</td>
                <td>
                  <button
                    onClick={() =>
                      handleVerifikacija(prodavac.id, prodavac.email)
                    }
                  >
                    Verifikuj
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleOdbijVerifikaciju(prodavac.id, prodavac.email)
                    }
                  >
                    Odbij verifikaciju
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <br />
        <PrikazVerifikacija />
      </div>
    </div>
  );
};

export default Verifikacija;
