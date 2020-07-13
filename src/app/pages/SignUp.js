import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Routes from '../constants/Routes';
import { isValidEmail, handlePressEnter } from '../AppHelper';
import { DataStoreContext } from '../../core/stores/DataStore';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import translationKeys from '../../core/localization/translations/translationKeys.json';
import { withTranslation } from 'react-i18next';

const SignUp = (props) => {
    const { t } = props;
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
        if (!email || !password || !passwordConfirmation) return alert(t(translationKeys.validationErrorFieldsMissing));
        if (!isValidEmail(email)) return alert(t(translationKeys.validationErrorEmail));
        if (password !== passwordConfirmation) return alert(t(translationKeys.validationErrorPasswordAndPasswordConfirmation));

        authenticationStore.signUp({ email, password }).then(response => {
            if (response.error) {
                if (response && response.data && response.data.message)
                    alert(response.data.message);
                else alert(t(translationKeys.errorSignUp));
            } else {
                Swal.fire(
                    t(translationKeys.welcome),
                    t(translationKeys.accountCreated),
                    'success'
                )

                props.history.push(Routes.signIn.url)
                handleResetValues('');
            }
        })

    }

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">{t(translationKeys.register)}</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        {/* <div className="form-group">
                            <label htmlFor="signUpUsername">Username</label>
                            <input value={username} onChange={evt => setUsername(evt.target.value)} className="form-control" id="signUpUsername"
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div> */}
                        <div className="form-group">
                            <label htmlFor="signUpEmail">{t(translationKeys.email)}</label>
                            <input value={email} onChange={evt => setEmail(evt.target.value)} className="form-control" id="signUpEmail"
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signUpPassword">{t(translationKeys.password)}</label>
                            <input value={password} onChange={evt => setPassword(evt.target.value)} type="password" className="form-control" id="signUpPassword"
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signUpPasswordConfirmation">{t(translationKeys.passwordConfirmation)}</label>
                            <input value={passwordConfirmation} onChange={evt => setPasswordConfirmation(evt.target.value)} type="password" className="form-control" id="signUpPasswordConfirmation"
                                onKeyPress={evt =>
                                    handlePressEnter(evt, handleSubmit)
                                } />
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmit} disabled={signUpLoading}>{t(translationKeys.sumbit)}</button>
                        <div className="d-flex justify-content-between mt-2">
                            <span>{t(translationKeys.alreadyHaveAnAccountQuestion)} <Link to={Routes.signIn.url}>{t(translationKeys.logIn)}</Link></span>
                            <Link to={Routes.forgotPassword.url}>{t(translationKeys.forgotPasswordQuestion)}</Link>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(withRouter(observer(SignUp)));
