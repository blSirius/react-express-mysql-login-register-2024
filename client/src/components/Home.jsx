import React, { useContext, useEffect, useState } from 'react';
import { userContext } from './Context';

function Home() {
    
    const myContext = useContext(userContext);
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        (async () => {
            setCurrentUser(await myContext.getCurrentUser());
        })();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div>
            <div>Welcome {currentUser}</div>
            <button className='border' onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Home;
