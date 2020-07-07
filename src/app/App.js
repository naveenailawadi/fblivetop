import React, { Suspense, useContext, useEffect } from 'react';
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
import { observer } from 'mobx-react-lite';
import { getCookie } from './AppHelper';
import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import NotFound from './pages/NotFound';

const App = (props) => {
  const { t } = props;
  const dataStore = useContext(DataStoreContext);
  const { authenticationStore, adminStore } = dataStore;
  const { isAuthenticated } = authenticationStore;

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Check if there is a stored user
    const userCookie = getCookie("user");
    const adminTokenCookie = getCookie("adminToken");

    const userObj = JSON.parse(userCookie);

    if (userCookie) {
      authenticationStore.setValueByKey('user', userObj);
    }

    if (adminTokenCookie) {
      authenticationStore.setValueByKey('adminToken', adminTokenCookie);
    }

    setInitialized(true);
  }, [authenticationStore]);

  if (!initialized) return <LoadingScreen />

  return (
    <div className="h-100">
      <Header />
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          {isAuthenticated ? renderPrivateRoutes() : renderPublicRoutes()}
          <Route
            exact
            path={Routes.home.url}
            render={() => <Redirect to={Routes.signIn.url} />}
          />
          <Route
            exact
            path={Routes.adminPanel.url}
            render={() => <Redirect to={Routes.signIn.url} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withTranslation()(observer(App));

