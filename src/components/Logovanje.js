import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Logovanje = () => {
  const navigate = useNavigate();

  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [user, setUser] = useState({});

  const [formData, setFormData] = useState({
    Username: "",
    Lozinka: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    fetch("https://localhost:44388/Korisnik/logovanje", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log("Response from server:", data);
        var jwtToken = data["token"];
        localStorage.setItem("token", jwtToken);
        navigate("/ulogovan-korisnik");
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  };
  function handleCallbackResponse(response) {
    var userObject = jwtDecode(response.credential);
    var prezime = userObject.family_name;
    var slikaKorisnika = userObject.picture;
    var email = userObject.email;
    var ime = userObject.given_name;

    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    

    const logovanjeDto = {
      username: ime,
      lozinka: prezime,
    };
    console.log(logovanjeDto);
    //slanje zahteva POST na server
    fetch(`https://localhost:44388/Korisnik/logovanje`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logovanjeDto),
      mode: "cors",
    })
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
    google.accounts.id.prompt();
  }, []);

  return (
    <div>
      <h1>Logovanje</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">Username:</label>
        <input
          type="username"
          id="username"
          name="Username"
          value={formData.Username}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="lozinka">Lozinka:</label>
        <input
          type="password"
          id="lozinka1"
          name="Lozinka"
          value={formData.Lozinka}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Uloguj se</button>
      </form>
      {isLoginFailed && (
        <p>Neuspesno logovanje. Proverite vase podatke i pokusajte ponovo.</p>
      )}

      <div id="signInDiv"></div>
    </div>
  );
};

export default Logovanje;
