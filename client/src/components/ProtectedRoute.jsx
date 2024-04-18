import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import { userContext } from './Context';

function ProtectedRoute({ children }) {
    const myContext = useContext(userContext);

    const checkLoggedIn = async () => {
        const currentUser = await myContext.getCurrentUser();
        if (currentUser !== false) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    };

    const [loggedIn, setLoggedIn] = useState(checkLoggedIn());

    return (
        <>
            {loggedIn === false && (
                <Navigate to="/login" replace={true} />
            )}
            {children}
        </>
    );
}

export default ProtectedRoute;
