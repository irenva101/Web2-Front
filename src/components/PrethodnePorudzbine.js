import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const PrethodnePorudzbine = () => {
  const [porudzbine, setPorudzbine] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("naziv");
  const [sortOrder, setSortOrder] = useState("asc");
  const [preostaloVreme, setPreostaloVreme] = useState({});

  const [formData, setFormData] = useState({
    korisnikId: 0,
    adresaDostave: "string",
    komentar: "string",
    artikli: [
      {
        prodavacId: 0,
        naziv: "string",
        cena: 0,
        kolicina: 0,
        opis: "string",
        slika: "string",
      },
    ],
    vremeIsporuke: "2000-18-06T18:48:23.437Z",
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date
      .getDate()
      .toString()
      .padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    var token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    var index = decodedToken["Id"];
    //console.log(decodedToken["Id"]);

    fetch(
      `https://localhost:44388/Porudzbina/allPorudzbineKorisnika?idKorisnika=${index}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
      }
    )
      .then((responce) => responce.json())
      .then((data) => {
        //obrada odgovora servera
        setPorudzbine(data);
        console.log(data);
        //console.log(data[0]["vremeIsporuke"]);
      })
      .catch((error) => {
        console.error(
          "Greška prilikom dobavljanja podataka sa servera:",
          error
        );
      });
  }, []);

  const filteredPorudzbine = porudzbine.filter((porudzbine) => {
    return porudzbine.artikli.some((artikal) =>
      artikal.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedPorudzbine = [...filteredPorudzbine];

  if (sortOption === "naziv") {
    sortedPorudzbine.sort((a, b) =>
      a.artikli[0].naziv.localeCompare(b.artikli[0].naziv)
    );
  } else if (sortOption === "datum") {
    sortedPorudzbine.sort((a, b) => {
      console.log(JSON.stringify(sortedPorudzbine));
      if (sortOrder === "asc") {
        return new Date(a.vremeIsporuke) - new Date(b.vremeIsporuke);
      } else {
        return new Date(b.vremeIsporuke) - new Date(a.vremeIsporuke);
      }
    });
  }
  //u principu bih trebala da sortiram po datumu, to ima najvise smisla

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

  // Funkcija za formatiranje preostalog vremena
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

  const otkaziPorudzbinu = (porudzbinaId) => {
    const existingPorudzbina = porudzbine.find(
      (item) => item.id === porudzbinaId
      
    );
    console.log(porudzbine);
    console.log("JESMO LI DOBACILI DO OVDE");
    console.log("PORUDZBINA--------"+porudzbinaId+"+++++++++++");
    console.log(existingPorudzbina);
    
    

    // const vremeIsporuke=porudzbinaZaOtkazivanje["vremeIsporuke"];
    // const vremePorucivanja=porudzbinaZaOtkazivanje["vremePorucivanja"];

    // console.log(vremeIsporuke+"+++++++++++"+vremePorucivanja);

    if (existingPorudzbina) {
      //otkazi porudzbinu
      fetch(
        `https://localhost:44388/Porudzbina/cancelPorudzbina`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(existingPorudzbina),
          mode: "cors",
        }
      )
        .then((responce) => responce.json())
        .then((data) => {
          alert("Uspesno je otkazana porudzbina");
          console.log(data);
        })
        .catch((error) => {
          alert("Greška prilikom otkazivanja porudzbine");
          console.error("Greška prilikom otkazivanja porudzbine", error);
        });
    }
  };

  function otkazivanjeUPrvihSatVremena(id) {
    const porudzbina = porudzbine.find((p) => p.id === id);

    if (!porudzbina) {
      console.log("Porudžbina sa datim ID nije pronađena");
      return false; // Porudžbina sa datim ID nije pronađena
    }

    const trenutnoVreme = new Date();
    //console.log("Trenutno vreme: "+ trenutnoVreme);
    const satVremenaUnapred = new Date(
      trenutnoVreme.getTime() + 60 * 60 * 1000
    );
    //console.log("Sat vremena unazad: "+ satVremenaUnapred);
    //console.log(porudzbina.vremePorucivanja >= satVremenaUnapred);
    return porudzbina.vremePorucivanja >= satVremenaUnapred;
  }

  return (
    <div>
      <h1>Prethodne porudzbine</h1>
      <input
        type="text"
        placeholder="Unesite naziv artikla za pretragu"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="naziv">Sortiraj po nazivu</option>
        <option value="datum">Sortiraj po datumu</option>
      </select>
      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        {sortOrder === "asc"
          ? "Sortiraj po datumu (rastuce)"
          : "Sortiraj po datumu (opadajuce)"}
      </button>
      <table>
        <thead>
          <tr>
            <th style={{ color: "#279980" }}>Adresa dostave</th>
            <th style={{ color: "#279980" }}>Artikli</th>
            <th style={{ color: "#279980" }}>Komentar</th>
            <th style={{ color: "#279980" }}>Vreme isporuke</th>
            <th style={{ color: "#279980" }}>Otkazati?</th>
          </tr>
        </thead>
        <tbody>
          {sortedPorudzbine
            .filter((porudzbina) => !porudzbina.otkazana) //ne prikazuje otkazane porudzbine
            .map((porudzbina) => (
              <tr key={porudzbina.vremeIsporuke}>
                <td>{porudzbina.adresaDostave}</td>
                <td>
                  {porudzbina.artikli.map((artikal) => (
                    <div className="artikal-kartica" key={artikal.Id}>
                      <img
                        src={artikal.slika}
                        alt={artikal.naziv}
                        className="artikal-slika"
                        style={{ width: "100px" }}
                      />
                      <p className="artikal-naziv">{artikal.naziv}</p>
                      <p className="artikal-cijena">Cena: {artikal.cena}</p>
                      <p className="artikal-opis">Opis: {artikal.opis}</p>
                    </div>
                  ))}
                </td>
                <td>{porudzbina.komentar}</td>
                <td>
                  {/* Prikaz preostalog vremena */}
                  {preostaloVreme[porudzbina.id] > 0
                    ? formatRemainingTime(preostaloVreme[porudzbina.id])
                    : "Isporuceno"}
                </td>
                <td>
                  {!porudzbina.otkazana &&
                    !otkazivanjeUPrvihSatVremena(porudzbina.id) &&
                    preostaloVreme[porudzbina.id] > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          otkaziPorudzbinu(porudzbina.id);
                        }}
                      >
                        Otkazi
                      </button>
                    )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrethodnePorudzbine;
