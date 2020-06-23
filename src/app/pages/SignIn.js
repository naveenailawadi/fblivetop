import React, { useState } from 'react';
import Routes from '../constants/Routes';
import { Link } from 'react-router-dom';
import { handlePressEnter, isValidEmail } from '../AppHelper';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (!email || !password) return alert('One or more required fields are missing.');
        if (!isValidEmail(email)) return alert('Email is not valid.');

        // TODO: HANDLE LOG IN
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
                            <label htmlFor="signInUsername">Email</label>
                            <input value={email}
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
                            <input type="checkbox" className="form-check-input" id="signInRememebr" />
                            <label className="form-check-label" htmlFor="signInRememebr">Remember me</label>
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmit}>Submit</button>
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

export default SignIn;
