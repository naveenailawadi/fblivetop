import React, { Suspense } from 'react';
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

const LoadingScreen = () => <div>Loading..</div>

const NotFound = () => <div>Not found.</div>

const App = () => {
  // FIXME: GET REAL AUTHENTICATION
  const isAuthenticated = false;

  return (
    <div className="h-100">
      <Header />
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

export default App;

