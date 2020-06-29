import React, { useState, useContext } from 'react';
import Routes from '../constants/Routes';
import { Link, withRouter } from 'react-router-dom';
import { handlePressEnter, isValidEmail } from '../AppHelper';
import { DataStoreContext } from '../../core/stores/DataStore';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';

const ForgotPassword = (props) => {
    const dataStore = useContext(DataStoreContext);
    const { authenticationStore } = dataStore;

    const [email, setEmail] = useState('');

    const loadingForgotPassword = authenticationStore.loaders.forgotPassword;

    const handleSubmit = () => {
        if (!isValidEmail(email)) return alert('Email is not valid.');

        authenticationStore.forgotPassword({ email }).then(response => {
            if (response.error) {
                return alert('There was an error sending password reset email. Please try again later.')
            }

            props.history.push(Routes.signIn.url);

            Swal.fire({
                type: 'success',
                title: `Email sent!`,
                text: `A reset password email has been sent to ${email}.`,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            });
        })
    }

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Forgot Password</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label htmlFor="forgotPasswordEmail">Email</label>
                            <input value={email}
                                type="email"
                                className="form-control"
                                id="forgotPasswordEmail"
                                onChange={evt => setEmail(evt.target.value)}
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                      
                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmit} disabled={loadingForgotPassword}>Send Reset Password Instructions</button>
                        <div className="d-flex justify-content-between mt-2">
                            <span><Link to={Routes.signIn.url}>Back to log in</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(observer(ForgotPassword));
