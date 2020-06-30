import React, { useState, useContext } from 'react';
import Routes from '../constants/Routes';
import { Link, withRouter } from 'react-router-dom';
import { handlePressEnter, isValidEmail } from '../AppHelper';
import { DataStoreContext } from '../../core/stores/DataStore';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';

const SignIn = (props) => {
    const dataStore = useContext(DataStoreContext);
    const { authenticationStore } = dataStore;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);

    const loadingLogIn = authenticationStore.loaders.logIn;
    const loadingAdminLogIn = authenticationStore.loaders.adminLogIn;

    const handleSubmit = () => {
        if (!email || !password) return alert('One or more required fields are missing.');
        if (!isValidEmail(email)) return alert('Email is not valid.');

        authenticationStore.adminLogIn({ email, password, remember }).then(adminResponse => {
            authenticationStore.logIn({ email, password, remember }).then(response => {
                if (response.error) {
                    return alert('There was an error logging in. Please try again later.')
                }

                props.history.push(Routes.home.url);

                Swal.fire({
                    type: 'success',
                    title: `Welcome back!`,
                    text: 'Logged in successfully.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });


            })
        })
    }

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Log In</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label htmlFor="signInEmail">Email</label>
                            <input value={email}
                                type="email"
                                className="form-control"
                                id="signInEmail"
                                onChange={evt => setEmail(evt.target.value)}
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signInPassword">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="signInPassword"
                                value={password}
                                onChange={evt => setPassword(evt.target.value)}
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="signInRememebr" value={remember} onChange={() => setRemember(!remember)} />
                            <label className="form-check-label" htmlFor="signInRememebr">Remember me</label>
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmit} disabled={loadingLogIn || loadingAdminLogIn}>Submit</button>
                        <div className="d-flex justify-content-between mt-2">
                            <span>Don't have an account? <Link to={Routes.signUp.url}>Register</Link></span>
                            {/* <a href="#">Forgot Password?</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(observer(SignIn));
