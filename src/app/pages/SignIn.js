import React from 'react';
import Routes from '../constants/Routes';
import { Link } from 'react-router-dom';

const SignIn = () => {
    const handleSubmit = () => { }

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Log In</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label for="signInUsername">Username</label>
                            <input className="form-control" id="signInUsername" />
                        </div>
                        <div className="form-group">
                            <label for="signInPassword">Password</label>
                            <input type="password" className="form-control" id="signInPassword" />
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="signInRememebr" />
                            <label className="form-check-label" for="signInRememebr">Remember me</label>
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
