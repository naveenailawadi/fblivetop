import React from 'react';
import { Link } from 'react-router-dom';
import Routes from '../constants/Routes';
import translationKeys from '../../core/localization/translations/translationKeys.json';
import { withTranslation } from 'react-i18next';

const NotFound = (props) => {
    const { t } = props;
    
    return (<div style={{ height: '100vh' }} className="d-flex flex-column w-100 align-items-center justify-content-center text-center">
        <h1>{t(translationKeys.pageNotFound)}</h1>
        <br />
        <Link to={Routes.home.url}>{t(translationKeys.backToHomepage)}</Link>
    </div>)
}

export default withTranslation()(NotFound);
