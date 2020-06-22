import { createContext } from 'react';
import AuthenticationStore from './AuthenticationStore';

class DataStore {
  authenticationStore = new AuthenticationStore(this);

  resetStores = () => {
    this.authenticationStore = new AuthenticationStore(this);
  };
}

export const DataStoreContext = createContext(new DataStore());
