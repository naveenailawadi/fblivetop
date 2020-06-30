import React, { useState, useEffect, useContext } from 'react';
import UsersListItem from '../components/UsersListItem';
import { DataStoreContext } from '../../core/stores/DataStore';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Routes from '../constants/Routes';
import Swal from 'sweetalert2';
import LoadingScreen from '../components/LoadingScreen';

const AdminPanel = (props) => {
    const dataStore = useContext(DataStoreContext);
    const { adminStore, authenticationStore } = dataStore;
    const { data: { user, adminToken } } = authenticationStore;

    const [emailFilter, setEmailFilter] = useState('')
    const [usersList, setUsersList] = useState(null);
    const [initialized, setInitialized] = useState(true);

    const loadingUsersList = adminStore.loaders.getAllUsers;
    const loadingDeleteUser = adminStore.loaders.deleteUser;

    const filteredUsersList = emailFilter ? usersList && usersList.filter(i => i.email.includes(emailFilter)) : usersList;

    useEffect(() => {
        // FETCH USERS LIST ON INIT. IF RESPONSE IS ERROR, MEANS THAT USER IS NOT ADMIN. REDIRECT TO ROOT.
        if (!user) return props.history.push(Routes.home.url);

        adminStore.getAllUsers({ token: adminToken }).then(response => {
            if (response.success && response.data) {
                setUsersList(response.data.users);
                setInitialized(true);
            } else {
                // Case user is not admin
                return props.history.push(Routes.home.url);
            }
        });
    }, [adminStore, adminToken, authenticationStore.data, props.history, user]);

    const handleDeleteUser = (email) => {
        Swal.fire({
            title: 'Are you sure you want to delete it?',
            text: `User email: ${email}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.value) {
                adminStore.deleteUser({ token: adminToken, userEmail: email }).then(response => {
                    if (response.error) {
                        return Swal.fire(
                            'Error',
                            `There was an error deleting user.`,
                            'error'
                        )
                    }

                    const newUsersList = usersList.filter(i => i.email !== email);
                    setUsersList(newUsersList);

                    Swal.fire(
                        'Deleted!',
                        `User with email ${email} has been deleted.`,
                        'success'
                    )
                })

            }
        })
    }

    if (!initialized) return <LoadingScreen/>

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

                    </div>
                </div>
        
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
                            <td><button className="btn btn-danger" onClick={() => handleDeleteUser(u.email)}><i className="fa fa-trash"></i></button></td>
                        </tr>)}
                    </tbody>
                </table>
                {(!loadingUsersList && (!filteredUsersList || filteredUsersList.length === 0)) ? <p>No users found.</p> : null}
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
