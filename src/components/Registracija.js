import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../services/ArtikalService";
import jwtDecode from "jwt-decode";
import { isPast, differenceInYears } from "date-fns";

const Registracija = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isTypingDate, setIsTypingDate] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [selectDate, setDate] = useState("");
  const [selectPicture, setPicture] = useState("");
  const [UploadedImage, setUploadedImage] = useState(null);
  const [slikaKorisnika, setSlikaKorisnika] = useState("");
  const [tipKorisnika, setTipKorisnika] = useState(0);
  const [postarina, setPostarina] = useState(0);

  const [user, setUser] = useState({});

  const [formData, setFormData] = useState({
    KorisnickoIme: "",
    Email: "",
    Lozinka: "",
    Ime: "",
    Prezime: "",
    DatumRodjenja: "2000-01-01",
    Adresa: "",
    TipKorisnika: "Kupac",
    SlikaKorisnika: "",
    Verifikovan: false,
    Postarina: 0,
  });

  function handleCallbackResponse(response){
    var userObject = jwtDecode(response.credential);
    var prezime = userObject.family_name;
    var slikaKorisnika = userObject.picture;
    var email = userObject.email;
    var ime = userObject.given_name;

    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    var dropdown = document.getElementById("mojDropdown");
    console.log(dropdown.value);
      //slanje zahteva POST na server
      fetch(
        `https://localhost:44388/Korisnik/getKorisnikToken?email=${email}&ime=${ime}&prezime=${prezime}&slikaKorisnika=${slikaKorisnika}&tipKorisnika=${dropdown.value}`,
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
          //setTemp(true);
          //setRequestCompleted((prevRequestCompleted) => true);
          //console.log(requestCompleted);
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
    //google.accounts.id.prompt();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "TipKorisnika") {
      if (value === "Kupac") {
        setTipKorisnika(0);
      } else if (value === "Prodavac") {
        setTipKorisnika(1);
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      SlikaKorisnika: e.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //dalje logika za slanje na server
    let temp = 0;
    if (tipKorisnika === "Prodavac") {
      temp = 1;
    } else if (tipKorisnika === "Kupac") {
      temp = 0;
    }
    console.log(
      JSON.stringify({
        ...formData,
        DatumRodjenja: selectDate,
        SlikaKorisnika: slikaKorisnika,
        TipKorisnika: temp,
      })
    );
    //const firstFetchPromise = new Promise((resolve, reject) => {
    //setTimeout(() => {
    fetch("https://localhost:44388/Korisnik", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        DatumRodjenja: selectDate,
        SlikaKorisnika: slikaKorisnika,
        TipKorisnika: temp,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((Response) => Response.json())
      .then((data) => {
        console.log("POSLALI SMO NA BEK");
        console.log(
          "Sta je bek vratio nakon kreiranja korisnika: " + JSON.stringify(data)
        );
        //resolve(data); // RESOLVE NAKON STO SE ZAVRSI
      })
      .catch((error) => {
        console.log(error);
      });
    //}, 2000);
    //});

    if (formData.TipKorisnika === "Prodavac") {
      setNotificationMessage(
        "Registracija je uspešno zabeležena. Sačekajte da se obradi. O uspesnoj registraciji bicete obavesteni putem e-mail adrese..."
      );
      setShowNotification(true);

      const emailData = {
        Receiver: email,
        Subject: "Registracija(WEB2)",
        Body:
          "Postovani, uskoro cete primiti jos jedan mejl da Vas obavestimo o verifikaciji vaseg naloga.",
      };
      console.log(JSON.stringify(emailData));

      //await firstFetchPromise;
      fetch(
        //pre fetch ide await
        "https://localhost:44388/Email/emailService",
        {
          method: "POST",
          body: JSON.stringify(emailData),
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("POGODILI BEK.");
        })
        .catch((error) => {
          console.log(error);
        });

      setNotificationVisible(true);

      setTimeout(() => {
        setNotificationVisible(false);
        navigate("/logovanje");
      }, 5000); // 5000 milisekundi = 5 sekundi
    } else {
      navigate("/logovanje");
    }
  };

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setSlikaKorisnika(imageData);
  };
  const handlePasswordConfirmationChange = (e) => {
    const confirmationValue = e.target.value;
    setPasswordConfirmation(confirmationValue);

    if (confirmationValue === formData.Lozinka) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  };
  const handleDateChange = (e) => {
    handleChange(e); // Prvo pozivamo handleChange funkciju da se ažurira formData
    setDate(e.target.value);
  };
  const handleTipChange = (e) => {
    handleChange(e);
    setTipKorisnika(e.target.value);
  };
  const handlePostarinaChange = (e) => {
    handleChange(e);
    setPostarina(e.target.value);
  };
  const handleEmailChange = (e) => {
    handleChange(e);
    setEmail(e.target.value);
  };

  return (
    <div className="container text-center mt-5">
      <h1 style={{ color: "#28a745" }}>Registracija</h1>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="korisnickoIme">Korisničko ime:</label>
        <input
          type="text"
          id="korisnickoIme"
          name="KorisnickoIme"
          value={formData.KorisnickoIme}
          onChange={handleChange}
          className="form-control"
          required
        />
        <br />
        </div>

        <div className="form-group">
        <label htmlFor="email">E-mail adresa:</label>
        <input
          type="email"
          id="email"
          name="Email"
          value={formData.Email}
          onChange={handleEmailChange}
          className="form-control"
          required
        />
        <br />
        </div>

        <div className="form-group">
        <label htmlFor="lozinka">Lozinka:</label>
        <input
          type="password"
          id="lozinka"
          name="Lozinka"
          value={formData.Lozinka}
          onChange={handleChange}
          className="form-control"
          required
        />
        <br />
        </div>

        <div className="form-group">
        <label htmlFor="potvrdaLozinke">Potvrdi lozinku:</label>
        <input
          type="password"
          id="potvrdaLozinke"
          name="PotvrdaLozinke"
          value={passwordConfirmation}
          onChange={handlePasswordConfirmationChange}
          className="form-control"
          required
        />
        <br />
        </div>

        {!isPasswordMatch && (
          <div style={{ color: "red" }}>Lozinke se ne podudaraju.</div>
        )}

        <div className="form-group">
        <label htmlFor="ime">Ime:</label>
        <input
          type="text"
          id="ime"
          name="Ime"
          value={formData.Ime}
          onChange={handleChange}
          className="form-control"
          required
        />
        <br />
        </div>

        <div className="form-group">
        <label htmlFor="prezime">Prezime:</label>
        <input
          type="text"
          id="prezime"
          name="Prezime"
          value={formData.Prezime}
          onChange={handleChange}
          className="form-control"
          required
        />
        <br />
        </div>

        <div className="form-group">
        <label htmlFor="datumRodjenja">Datum rođenja:</label>
        <input type="date" value={selectDate} onChange={handleDateChange} className="form-control" />
        <br />
        </div>

        <div className="form-group">
        <label htmlFor="adresa">Adresa:</label>
        <input
          type="text"
          id="adresa"
          name="Adresa"
          value={formData.Adresa}
          onChange={handleChange}
          className="form-control"
          required
        />
        <br />
        </div>

        <div className="form-group">
        <label htmlFor="TipKorisnika">Tip korisnika:</label>
        <select
          id="tipKorisnika"
          name="TipKorisnika"
          value={formData.TipKorisnika}
          onChange={handleTipChange}
          className="form-control"
          required
        >
          <option value="Kupac">Kupac</option>
          <option value="Prodavac">Prodavac</option>
        </select>
        <br />
        </div>

        {formData.TipKorisnika === "Prodavac" && (
          <div>
            <div className="form-group">
            <label htmlFor="postarina">Postarina:</label>
            <input
              type="number"
              id="postarina"
              name="Postarina"
              value={formData.Postarina}
              onChange={handlePostarinaChange}
              className="form-control"
              required
            />
            <br />
            </div>
          </div>
        )}
        <div className="form-group">
        <label htmlFor="slika">Slika profila:</label>
        <ImageUploader onImageUpload={handleImageUpload} className="form-control mr-2" />
        
        
        </div>





        <button type="submit" className="btn btn-success mt-3">Registruj se</button>
      </form>

      {showNotification && (
        <div className="notification" style={{ background: "#d4edda", color: "#155724" }}>{notificationMessage}</div>
      )}
      <br/>
      
      <div>

        <div className="mt-4">
          <h1 style={{ color: "#28a745" }}>Prijavite se preko google naloga</h1>
          <select id="mojDropdown">
            <option value="Kupac">Kupac</option>
            <option value="Prodavac">Prodavac</option>
          </select>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-3">
        <div id="signInDiv"> 
        </div>
        </div>
      
      </div>
    </div>
  );
};

export default Registracija;
