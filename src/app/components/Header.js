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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to={Routes.root.url}>FBLiveTop</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExample07">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="lang-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">EN</a>
                            <div className="dropdown-menu" aria-labelledby="lang-dropdown">
                                <a className="dropdown-item" href="#">CH</a>
                                <a className="dropdown-item" href="#">ES</a>
                            </div>
                        </li>
                    </ul>
                    <ul className="navbar-nav navbar-right">
                        {isAuthenticated ? (
                            <li className="nav-item">
                                <a href="#" className={`nav-link`} onClick={handleLogOut}>Log Out</a>
                            </li>
                        ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to={Routes.signIn.url} className={`nav-link ${currentRoute === Routes.signIn ? 'active' : ''}`}>Log In</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={Routes.signUp.url} className={`nav-link ${currentRoute === Routes.signUp ? 'active' : ''}`}>Register</Link>
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
