import React, { useState, useEffect, useContext } from 'react';
import UsersListItem from '../components/UsersListItem';
import { DataStoreContext } from '../../core/stores/DataStore';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Routes from '../constants/Routes';

const AdminPanel = (props) => {
    const dataStore = useContext(DataStoreContext);
    const { adminStore, authenticationStore } = dataStore;
    const [emailFilter, setEmailFilter] = useState('')

    const [usersList, setUsersList] = useState(null);
    const [initialized, setInitialized] = useState(true);

    const loadingUsersList = adminStore.loaders.getAllUsers;

    const filteredUsersList = emailFilter ? usersList && usersList.filter(i => i.email.includes(emailFilter)) : usersList;

    useEffect(() => {
        // TODO: FETCH USERS LIST ON INIT. IF RESPONSE IS ERROR, MEANS THAT USER IS NOT ADMIN. REDIRECT TO ROOT.
        const { user } = authenticationStore.data;
        if (!user) return props.history.push(Routes.home.url);

        adminStore.getAllUsers({ token: user.token }).then(response => {
            if (response.success && response.data) {
                setUsersList(response.data);
                setInitialized(true);
            } else {
                // Case user is not admin
                return props.history.push(Routes.home.url);
            }
        })
    }, [adminStore, authenticationStore.data, props.history]);

    // TODO: LOADING SCREEN
    if (!initialized) return <div>Loading...</div>

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
                {/* <div className="form-group">
                    <label className="font-weight-bold text-dark">Filter by username:</label>
                    <div className="input-group">
                        <input
                            className="form-control"
                            //   onKeyPress={evt => handlePressEnter(evt, handleSearch)}
                            onChange={evt => setUsernameFilter(evt.target.value)}
                            value={usernameFilter}
                        />
                        <div className="input-group-append">
              <button
                className="btn btn-dark btn-sm"
                type="button"
                // disabled={!query || !query.trim()}
                // onClick={handleSearch}
              >
                <i className="fa fa-search" />
              </button>
            </div>
                    </div>
                </div> */}

                <table className="table table-striped">
                    <thead>
                        <tr>
                            {/* <th scope="col">#</th> */}
                            <th scope="col">Email</th>
                            {/* <th scope="col">Edit</th> */}
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="table-bordered">
                        {filteredUsersList && filteredUsersList.map(u => <tr key={u.email}>
                            <td>{u.email}</td>
                            {/* <td><button className="btn btn-info"><i className="fa fa-edit"></i></button></td> */}
                            <td><button className="btn btn-danger"><i className="fa fa-trash"></i></button></td>
                        </tr>)}
                    </tbody>
                </table>
                {!filteredUsersList || filteredUsersList.length === 0 ? <p>No users found.</p> : null}
                {loadingUsersList && (
                    <div className="card mb-3">
                        <div className="card-body text-center p-2 ">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withRouter(observer(AdminPanel));
