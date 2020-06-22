import React from 'react';
import { Link } from 'react-router-dom';
import Routes from '../constants/Routes';

const Header = () => {
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand" href="#">Brand</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarsExample07">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="lang-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">EN</a>
                            <div class="dropdown-menu" aria-labelledby="lang-dropdown">
                                <a class="dropdown-item" href="#">CH</a>
                                <a class="dropdown-item" href="#">ES</a>
                            </div>
                        </li>
                    </ul>
                    <ul class="navbar-nav navbar-right">
                        <li class="nav-item">
                            <Link to={Routes.signIn.url} class="nav-link" href="#">Log In</Link>
                        </li>
                        <li class="nav-item">
                            <Link to={Routes.signUp.url} class="nav-link" href="#">Register</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
