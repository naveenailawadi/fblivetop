import { createContext } from 'react';
import AuthenticationStore from './AuthenticationStore';
import AppStore from './AppStore';
import AdminStore from './AdminStore';
import StreamingStore from './StreamingStore';

class DataStore {
  authenticationStore = new AuthenticationStore(this);
  appStore = new AppStore(this);
  adminStore = new AdminStore(this);
  streamingStore = new StreamingStore(this);

  resetStores = () => {
    this.authenticationStore = new AuthenticationStore(this);
    this.appStore = new AppStore(this);
    this.adminStore = new AdminStore(this);
    this.streamingStore = new StreamingStore(this);
  };
}

export const DataStoreContext = createContext(new DataStore());
