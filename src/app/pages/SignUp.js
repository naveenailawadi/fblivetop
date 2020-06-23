import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Routes from '../constants/Routes';
import { isValidEmail, handlePressEnter } from '../AppHelper';
import { DataStoreContext } from '../../core/stores/DataStore';
import { observer } from 'mobx-react-lite';

const SignUp = () => {
    const dataStore = useContext(DataStoreContext);
    const { authenticationStore } = dataStore;
    const { isAuthenticated } = authenticationStore;

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const signUpLoading = authenticationStore.loaders.signUp;


    const handleResetValues = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
    }

    const handleSubmit = () => {
        // TODO: Use bootstrap inputs alerts or sweetalert2
        if (!email || !password || !passwordConfirmation) return alert('One or more required fields are missing.');
        if (!isValidEmail(email)) return alert('Email is not valid.');
        if (password !== passwordConfirmation) return alert('Password and password confirmation must coincide.');

        authenticationStore.signUp({ email, password }).then(response => {
            console.log('Sign up response: ', response);
            if (response.error) {
                if (response.response && response.response.data && response.response.data.message)
                    alert(response.response.data.message);
                else alert('There was a problem when signing up. Please try again later.');
            } else {
                // TODO: HANDLE SUCCESSFULL LOGIN
                alert('Account successfully created!');
                handleResetValues('');
            }
        })

    }

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Register</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label htmlFor="signUpUsername">Username</label>
                            <input value={username} onChange={evt => setUsername(evt.target.value)} className="form-control" id="signUpUsername"
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signUpEmail">Email</label>
                            <input value={email} onChange={evt => setEmail(evt.target.value)} className="form-control" id="signUpEmail"
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signUpPassword">Password</label>
                            <input value={password} onChange={evt => setPassword(evt.target.value)} type="password" className="form-control" id="signUpPassword"
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signUpPasswordConfirmation">Password Confirmation</label>
                            <input value={passwordConfirmation} onChange={evt => setPasswordConfirmation(evt.target.value)} type="password" className="form-control" id="signUpPasswordConfirmation"
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmit} disabled={signUpLoading}>Submit</button>
                        <div className="d-flex justify-content-between mt-2">
                            <span>Already have an account? <Link to={Routes.signIn.url}>Sign In</Link></span>
                            <a href="#">Forgot Password?</a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(SignUp);
