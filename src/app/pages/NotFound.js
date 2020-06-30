import React from 'react';
import { Link } from 'react-router-dom';
import Routes from '../constants/Routes';

const NotFound = () => {
    return (<div style={{ height: '100vh' }} className="d-flex flex-column w-100 align-items-center justify-content-center text-center">
        <h1>Page not found.</h1> 
        <br />
        <Link to={Routes.home.url}>Back to homepage.</Link>
    </div>)
}

export default NotFound;
