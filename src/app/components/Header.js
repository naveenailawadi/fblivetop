import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Routes from '../constants/Routes';
import { getCurrentRoute } from '../appUtils';
import { DataStoreContext } from '../../core/stores/DataStore'

const Header = (props) => {
    const { location } = props;
    const dataStore = useContext(DataStoreContext);
    const { authenticationStore } = dataStore;
    const { isAuthenticated, logOut } = authenticationStore;

    const currentRoute = getCurrentRoute(location.pathname)


    const handleLogOut = () => {
        logOut();
        window.location.reload();
    }

    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <Link class="navbar-brand" to={Routes.root.url}>FBLiveTop</Link>
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
                        {isAuthenticated ? (
                            <li class="nav-item">
                                <a href="#" class={`nav-link`} onClick={handleLogOut}>Log Out</a>
                            </li>
                        ) : (
                                <>
                                    <li class="nav-item">
                                        <Link to={Routes.signIn.url} class={`nav-link ${currentRoute === Routes.signIn ? 'active' : ''}`}>Log In</Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link to={Routes.signUp.url} class={`nav-link ${currentRoute === Routes.signUp ? 'active' : ''}`}>Register</Link>
                                    </li>
                                </>
                            )}
                    </ul>
                </div>
            </div>
        </nav >
    );
}

export default withRouter(Header);
