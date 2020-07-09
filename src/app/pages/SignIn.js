import React, { useState, useContext } from 'react';
import Routes from '../constants/Routes';
import { Link, withRouter } from 'react-router-dom';
import { handlePressEnter, isValidEmail } from '../AppHelper';
import { DataStoreContext } from '../../core/stores/DataStore';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import translationKeys from '../../core/localization/translations/translationKeys.json';
import { withTranslation } from 'react-i18next';

const SignIn = (props) => {
    const {t} = props;
    const dataStore = useContext(DataStoreContext);
    const { authenticationStore } = dataStore;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);

    const loadingLogIn = authenticationStore.loaders.logIn;
    const loadingAdminLogIn = authenticationStore.loaders.adminLogIn;

    const handleSubmit = () => {
        if (!email || !password) return alert(t(translationKeys.validationErrorFieldsMissing));
        if (!isValidEmail(email)) return alert(t(translationKeys.validationErrorEmail));

        authenticationStore.adminLogIn({ email, password, remember }).then(adminResponse => {
            authenticationStore.logIn({ email, password, remember }).then(response => {
                if (response.error) {
                    return alert(t(translationKeys.errorLogIn))
                }

                props.history.push(Routes.home.url);

                Swal.fire({
                    type: 'success',
                    title: t(translationKeys.welcomeBack),
                    text: t(translationKeys.loggedInSuccessfully),
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
                <h1 className="h3 mb-3 font-weight-normal">{t(translationKeys.logIn)}</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label htmlFor="signInEmail">{t(translationKeys.email)}</label>
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
                            <label htmlFor="signInPassword">{t(translationKeys.password)}</label>
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
                            <label className="form-check-label" htmlFor="signInRememebr">{t(translationKeys.rememberMe)}</label>
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmit} disabled={loadingLogIn || loadingAdminLogIn}>{t(translationKeys.sumbit)}</button>
                        <div className="d-flex justify-content-between mt-2">
                            <span>{t(translationKeys.dontHaveAnAccountQuestion)} <Link to={Routes.signUp.url}>{t(translationKeys.register)}</Link></span>
                            {/* <a href="#">Forgot Password?</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(withRouter(observer(SignIn))) ;
