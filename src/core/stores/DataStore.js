import { createContext } from 'react';
import AuthenticationStore from './AuthenticationStore';
import AppStore from './AppStore';
import AdminStore from './AdminStore';

class DataStore {
  authenticationStore = new AuthenticationStore(this);
  appStore = new AppStore(this);
  adminStore = new AdminStore(this);

  resetStores = () => {
    this.authenticationStore = new AuthenticationStore(this);
    this.appStore = new AppStore(this);
    this.adminStore = new AdminStore(this);
  };
}

export const DataStoreContext = createContext(new DataStore());
