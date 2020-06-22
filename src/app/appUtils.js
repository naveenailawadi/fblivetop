import React from 'react';
import Routes from "./constants/Routes";
import { Route, matchPath } from 'react-router-dom';

export const renderRoutes = routes => {
    return routes.map(route => {
        const Component = route.component;
        return (
            <Route
                exact
                key={route.url}
                path={route.url}
                render={renderProps => <Component {...renderProps} />}
            />
        );
    });
};

export const renderPublicRoutes = () => {
    const routes = Object.values(Routes).filter(
        r => !r.protected && r.component
    );
    return renderRoutes(routes);
};

export const renderPrivateRoutes = () => {
    const routes = Object.values(Routes).filter(
        r => r.protected && r.component
    );
    return renderRoutes(routes);
};

export const getCurrentRoute = pathname =>
    Object.values(Routes).find(route =>
        matchPath(pathname, { exact: true, path: route.url })
    ) || Routes.home;