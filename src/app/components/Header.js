import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Routes from '../constants/Routes';
import { getCurrentRoute } from '../appUtils'
import { DataStoreContext } from '../../core/stores/DataStore'
import { languagesKeys, languagesNames } from '../../core/constants/enums/languagesEnum';
import { withTranslation } from 'react-i18next';
import translationKeys from '../../core/localization/translations/translationKeys.json';

const Header = (props) => {
    const { location, t } = props;
    const dataStore = useContext(DataStoreContext);
    const { authenticationStore, appStore } = dataStore;
    const { isAuthenticated, logOut } = authenticationStore;
    const { data: { lang } } = appStore;

    const currentRoute = getCurrentRoute(location.pathname)


    const handleLogOut = () => {
        logOut();
        window.location.href = "/";
    }

    const handleLanguageChange = key => {
        appStore.setLanguage(key);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to={Routes.home.url}>FBLiveTop</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExample07">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="lang-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{languagesNames[lang]}</a>
                            <div className="dropdown-menu" aria-labelledby="lang-dropdown">
                                {Object.keys(languagesKeys).map(languageKey => (
                                    <a key={languageKey} className="dropdown-item" href="#" onClick={() => handleLanguageChange(languageKey)}>{languagesNames[languageKey]}</a>
                                ))}
                            </div>
                        </li>
                    </ul>
                    <ul className="navbar-nav navbar-right">
                        {isAuthenticated ? (
                            <li className="nav-item">
                                <a href="#" className={`nav-link`} onClick={handleLogOut}>{t(translationKeys.logOut)}</a>
                            </li>
                        ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to={Routes.signIn.url} className={`nav-link ${currentRoute === Routes.signIn ? 'active' : ''}`}>{t(translationKeys.logIn)}</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={Routes.signUp.url} className={`nav-link ${currentRoute === Routes.signUp ? 'active' : ''}`}>{t(translationKeys.register)}</Link>
                                    </li>
                                </>
                            )}
                    </ul>
                </div>
            </div>
        </nav >
    );
}

export default withTranslation()(withRouter(Header));
