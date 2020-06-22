import React from 'react';
import Routes from '../constants/Routes';
import { Link } from 'react-router-dom';

const SignIn = () => {
    const handleSubmit = () => { }

    return (
        <div class="container-sm" style={{ maxWidth: '760px' }}>
            <div class="text-center mb-4 mt-5">
                <h1 class="h3 mb-3 font-weight-normal">Log In</h1>
            </div>
            <div class="card">
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="signInUsername">Username</label>
                            <input class="form-control" id="signInUsername" />
                        </div>
                        <div class="form-group">
                            <label for="signInPassword">Password</label>
                            <input type="password" class="form-control" id="signInPassword" />
                        </div>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="signInRememebr" />
                            <label class="form-check-label" for="signInRememebr">Remember me</label>
                        </div>
                        <button type="submit" class="btn btn-lg btn-primary btn-block" onClick={handleSubmit}>Submit</button>
                        <div class="d-flex justify-content-between mt-2">
                            <span>Don't have an account? <Link to={Routes.signUp.url}>Register</Link></span>
                            {/* <a href="#">Forgot Password?</a> */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
