import React, { useState, useEffect, useContext } from 'react';
import UsersListItem from '../components/UsersListItem';
import { DataStoreContext } from '../../core/stores/DataStore';

const AdminPanel = () => {
    const dataStore = useContext(DataStoreContext);
    const { adminStore, authenticationStore } = dataStore;
    const [emailFilter, setEmailFilter] = useState('')
    const [usernameFilter, setUsernameFilter] = useState('')

    const [usersList, setUsersList] = useState(null);

    const loadingUsersList = adminStore.loaders.getAllUsers;

    useEffect(() => {
        const { user } = authenticationStore.data;
        if (!user) return;
        
        adminStore.getAllUsers({ email: user.email, password: user.password }).then(response => {
            if (response.success && response.data) {
                setUsersList(response.data);
            }
        })
    }, [adminStore, authenticationStore.data]);

    const renderUsersList = () => {
        return usersList ? usersList.map(u => <UsersListItem key={u.email} email={u.email} username={u.username} />) : <p>No users found.</p>
    }

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Admin Panel</h1>
            </div>
            <div className="content px-3 my-3">
                <div className="form-group">
                    <label className="font-weight-bold text-dark">Filter by email:</label>
                    <div className="input-group">
                        <input
                            className="form-control"
                            //   onKeyPress={evt => handlePressEnter(evt, handleSearch)}
                            onChange={evt => setEmailFilter(evt.target.value)}
                            value={emailFilter}
                        />
                        {/* <div className="input-group-append">
              <button
                className="btn btn-dark btn-sm"
                type="button"
                // disabled={!query || !query.trim()}
                // onClick={handleSearch}
              >
                <i className="fa fa-search" />
              </button>
            </div> */}
                    </div>
                </div>
                <div className="form-group">
                    <label className="font-weight-bold text-dark">Filter by username:</label>
                    <div className="input-group">
                        <input
                            className="form-control"
                            //   onKeyPress={evt => handlePressEnter(evt, handleSearch)}
                            onChange={evt => setUsernameFilter(evt.target.value)}
                            value={usernameFilter}
                        />
                        {/* <div className="input-group-append">
              <button
                className="btn btn-dark btn-sm"
                type="button"
                // disabled={!query || !query.trim()}
                // onClick={handleSearch}
              >
                <i className="fa fa-search" />
              </button>
            </div> */}
                    </div>
                </div>
                {renderUsersList()}
                {loadingUsersList && (
                    <div className="card mb-3">
                        <div className="card-body text-center p-2 ">
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;
