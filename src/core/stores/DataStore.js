import { createContext } from 'react';
import AuthenticationStore from './AuthenticationStore';
import AppStore from './AppStore';

class DataStore {
  authenticationStore = new AuthenticationStore(this);
  appStore = new AppStore(this);

  resetStores = () => {
    this.authenticationStore = new AuthenticationStore(this);
  };
}

export const DataStoreContext = createContext(new DataStore());
