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
        <div class="container-sm" style={{ maxWidth: '760px' }}>
            <div class="text-center mb-4 mt-5">
                <h1 class="h3 mb-3 font-weight-normal">Register</h1>
            </div>
            <div class="card">
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="signUpUsername">Username</label>
                            <input value={username} onChange={evt => setUsername(evt.target.value)} class="form-control" id="signUpUsername" />
                        </div>
                        <div class="form-group">
                            <label for="signUpEmail">Email</label>
                            <input value={email} onChange={evt => setEmail(evt.target.value)} class="form-control" id="signUpEmail" />
                        </div>
                        <div class="form-group">
                            <label for="signUpPassword">Password</label>
                            <input value={password} onChange={evt => setPassword(evt.target.value)} type="password" class="form-control" id="signUpPassword" />
                        </div>
                        <div class="form-group">
                            <label for="signUpPasswordConfirmation">Password Confirmation</label>
                            <input value={passwordConfirmation} onChange={evt => setPasswordConfirmation(evt.target.value)} type="password" class="form-control" id="signUpPasswordConfirmation" />
                        </div>
                        <button type="submit" class="btn btn-lg btn-primary btn-block" onClick={handleSubmit}>Submit</button>
                        <div class="d-flex justify-content-between mt-2">
                            <span>Already have an account? <Link to={Routes.signIn.url}>Sign In</Link></span>
                            <a href="#">Forgot Password?</a>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
