import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const StarePorudzbine = () => {
  const [porudzbine, setPorudzbine] = useState([]);
  const [preostaloVreme, setPreostaloVreme] = useState({});

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return new Date(dateString)
      .toLocaleDateString("en-US", options)
      .replace(",", "");
  };

  useEffect(() => {
    var token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    console.log(decodedToken["Id"]);
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

    fetch(
      `https://localhost:44388/Porudzbina/allPorudzbineProdavcaStare?korisnikId=${decodedToken["Id"]}`,
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
      })
      .catch((error) => {
        console.error(
          "Greška prilikom dobavljanja podataka sa servera:",
          error
        );
      });
  }, []);

  const calculateRemainingTime = (endTime) => {
    const currentTime = new Date().getTime();
    const endTimeMillis = new Date(endTime).getTime();
    return Math.max(0, endTimeMillis - currentTime);
  };

  useEffect(() => {
    // ... ostatak vašeg postojećeg useEffect-a ...

    // Pokretanje intervala za ažuriranje preostalog vremena svake sekunde
    const interval = setInterval(() => {
      const updatedRemainingTimes = {};

      porudzbine.forEach((porudzbina) => {
        const remainingTime = calculateRemainingTime(porudzbina.vremeIsporuke);
        updatedRemainingTimes[porudzbina.id] = remainingTime;
      });

      setPreostaloVreme(updatedRemainingTimes);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [porudzbine]);

  const formatRemainingTime = (remainingTime) => {
    const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    const minutes = Math.floor(
      (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
    );
    const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  

  return (
    <div>
      <h1 style={{ color: "#279980" }}>Moje porudzbine</h1>
      <table>
        <thead>
          <tr>
            <th style={{ color: "#279980" }}>Adresa Dostave</th>
            <th style={{ color: "#279980" }}>Komentar</th>
            <th style={{ color: "#279980" }}>Vreme isporuke</th>
          </tr>
        </thead>
        <tbody>
          {porudzbine.map((porudzbina, index) => (
            <tr key={index}>
              <td>{porudzbina.adresaDostave}</td>
              <td>{porudzbina.komentar}</td>
              <td>
                  {/* Prikaz preostalog vremena */}
                  {preostaloVreme[porudzbina.id] > 0
                    ? formatRemainingTime(preostaloVreme[porudzbina.id])
                    : "Isporuceno"}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StarePorudzbine;
