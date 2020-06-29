import React, { useState, useContext } from 'react';
import Routes from '../constants/Routes';
import { Link, withRouter } from 'react-router-dom';
import { handlePressEnter, isValidEmail } from '../AppHelper';
import { DataStoreContext } from '../../core/stores/DataStore';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';

const ResetPassword = (props) => {
    const dataStore = useContext(DataStoreContext);
    const { authenticationStore } = dataStore;

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

    const loadingResetPassword = authenticationStore.loaders.resetPassword;

    const handleSubmit = () => {
        if (!isValidEmail(email)) return alert('Email is not valid.');
        if (!newPassword || !newPasswordConfirmation) return alert('You must enter a new password and its confirmation.');
        if (newPassword !== newPasswordConfirmation) return alert ("Your new password and its confirmation must coincide.");

        authenticationStore.resetPassword({ email, newPassword }).then(response => {
            if (response.error) {
                return alert('There was an error changing password. Please try again later.')
            }

            props.history.push(Routes.signIn.url);

            Swal.fire({
                type: 'success',
                title: `Password changed!`,
                text: `Your password has been updated.`,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            });
        })
    }

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Reset Password</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label htmlFor="resetPasswordNewPassword">New password</label>
                            <input value={newPassword}
                                type="password"
                                className="form-control"
                                id="resetPasswordNewPassword"
                                onChange={evt => setNewPassword(evt.target.value)}
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>

                        <div className="form-group">
                            <label htmlFor="resetPasswordNewPasswordConfirmation">New password confirmation</label>
                            <input value={newPasswordConfirmation}
                                type="password"
                                className="form-control"
                                id="resetPasswordNewPasswordConfirmation"
                                onChange={evt => setNewPasswordConfirmation(evt.target.value)}
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>

                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmit} disabled={loadingResetPassword}>Change password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(observer(ResetPassword));
