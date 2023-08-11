import React from "react";
import { Route, Navigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
    const getUserRole = () => {
        var token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        return null;
    }

    const userRole = getUserRole();
    if (allowedRoles.includes(userRole)) {
        return <Route {...rest} element={<Component />} />;
    } else {
        // Dodajte "return" ispred <Navigate> kako biste ispravili grešku.
        return <Navigate to="/ulogovan-korisnik" />;
    }
};

export default ProtectedRoute;
