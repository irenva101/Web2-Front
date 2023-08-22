import React from "react";
import {Link} from 'react-router-dom';
//test commit

function PocetnaStranica(){
    return (
        <div className="container text-center mt-5">
            <h1 className="mb-4" style={{ color: "#28a745" }}>Dobrodosli u online prodavnicu</h1>
            <Link to="/registracija" className="btn btn-success mr-3">Registracija</Link>
            <p></p>
            <Link to="/logovanje" className="btn btn-primary">Login</Link>
        </div>
    );
}

export default PocetnaStranica;