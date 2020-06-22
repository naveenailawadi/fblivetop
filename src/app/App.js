import React, { Suspense, useContext } from 'react';
import { DataStoreContext } from '../core/stores/DataStore'
import Header from './components/Header';
import {
  Switch,
  Route,
  withRouter,
  matchPath,
  Redirect
} from 'react-router-dom';
import { renderPrivateRoutes, renderPublicRoutes } from './appUtils';
import Routes from './constants/Routes';
import { withTranslation } from 'react-i18next';

const LoadingScreen = () => <div>Loading..</div>

const NotFound = () => <div>Not found.</div>

const App = (props) => {
  const { t } = props;
  const dataStore = useContext(DataStoreContext);
  const { authenticationStore } = dataStore;
  const { isAuthenticated } = authenticationStore;

  return (
    <div className="h-100">
      <Header />
      <span>Current lang: {t('currentLanguage')}</span>
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          {isAuthenticated ? renderPrivateRoutes() : renderPublicRoutes()}
          <Route
            exact
            path={Routes.root.url}
            render={() => <Redirect to={Routes.signIn.url} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withTranslation()(App);

