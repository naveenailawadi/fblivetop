import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Routes from '../constants/Routes';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleSubmit = () => {

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
                            <label for="signUpUsername">Username</label>
                            <input value={username} onChange={evt => setUsername(evt.target.value)} className="form-control" id="signUpUsername" />
                        </div>
                        <div className="form-group">
                            <label for="signUpEmail">Email</label>
                            <input value={email} onChange={evt => setEmail(evt.target.value)} className="form-control" id="signUpEmail" />
                        </div>
                        <div className="form-group">
                            <label for="signUpPassword">Password</label>
                            <input value={password} onChange={evt => setPassword(evt.target.value)} type="password" className="form-control" id="signUpPassword" />
                        </div>
                        <div className="form-group">
                            <label for="signUpPasswordConfirmation">Password Confirmation</label>
                            <input value={passwordConfirmation} onChange={evt => setPasswordConfirmation(evt.target.value)} type="password" className="form-control" id="signUpPasswordConfirmation" />
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmit}>Submit</button>
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

export default SignUp;
