import React, { useState, useEffect, useContext } from 'react';
import UsersListItem from '../components/UsersListItem';
import { DataStoreContext } from '../../core/stores/DataStore';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Routes from '../constants/Routes';
import Swal from 'sweetalert2';
import LoadingScreen from '../components/LoadingScreen';
import moment from 'moment';
import CSVReader from 'react-csv-reader';
import translationKeys from '../../core/localization/translations/translationKeys.json';
import { withTranslation } from 'react-i18next';


const tabs = {
    Users: translationKeys.users,
    Streamers: translationKeys.streamers,
    FloatConstants: translationKeys.pricingFormula,
};

const AdminPanel = (props) => {
    const { t } = props;  

    const dataStore = useContext(DataStoreContext);
    const { adminStore, authenticationStore } = dataStore;
    const { data: { user, adminToken } } = authenticationStore;

    const [usersEmailFilter, setUsersEmailFilter] = useState('')
    const [usersList, setUsersList] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [currentTab, setCurrentTab] = useState(tabs.Users)
    const [streamingBotsAvailable, setStreamingBotsAvailable] = useState(null);

    const [streamersEmailFilter, setStreamersEmailFilter] = useState('')
    const [streamersList, setStreamersList] = useState(null);

    const [constantsNameFilter, setConstantsNameFilter] = useState('')
    const [constantsList, setConstantsList] = useState(null);

    const [uploadingStreamers, setUploadingStreamers] = useState(false);
    const [uploadStreamersCsv, setUploadStreamersCsv] = useState(null);

    const loadingUsersList = adminStore.loaders.getAllUsers;
    const loadingDeleteUser = adminStore.loaders.deleteUser;

    const loadingStreamersList = adminStore.loaders.getAllStreamers;
    const loadingConstantsList = adminStore.loaders.getAllFloatConstants;
    const loadingStreamingBotsAvailable = adminStore.loaders.getStreamingBotsAvailable;

    const filteredUsersList = usersEmailFilter ? usersList && usersList.filter(i => i.email.includes(usersEmailFilter)) : usersList;
    const filteredStreamersList = streamersEmailFilter ? streamersList && streamersList.filter(i => i.email.includes(streamersEmailFilter)) : streamersList;
    const filteredConstantsList = constantsNameFilter ? constantsList && constantsList.filter(i => i.name.includes(constantsNameFilter)) : constantsList;

    useEffect(() => {
        // FETCH USERS LIST ON INIT. IF RESPONSE IS ERROR, MEANS THAT USER IS NOT ADMIN. REDIRECT TO ROOT.
        if (!user) return props.history.push(Routes.home.url);

        handleFetchAvailableBots();

        if (user.email && user.password) {
            authenticationStore.adminLogIn({ email: user.email, password: user.password }).then((response) => {
                if (response.error) {
                    Swal.fire({
                        title: t(translationKeys.unauthorized),
                        text: t(translationKeys.validationErrorAdmin),
                        icon: 'error'
                    });
                    return props.history.push(Routes.home.url);
                }
                else {
                    setInitialized(true);
                }
            })
        }

        // eslint-disable-next-line
    }, []);

    // Reset all values on tab change
    useEffect(() => {
        if (!initialized) return;

        resetAllValues();

        switch (currentTab) {
            case tabs.Users:
                handleFetchUsersList();
                break;
            case tabs.Streamers:
                handleFetchStreamersList();
                break;
            case tabs.FloatConstants:
                handleFetchFloatConstantsList();
                break;
            default:
                break;
        }
        handleFetchUsersList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialized, currentTab]);

    const handleFetchAvailableBots = (cb) => {
        adminStore.getStreamingBotsAvailable({ token: adminToken }).then(response => {
            if (response.error) {
                return;
            }

            const { maximumCapacity, minimumCapacity } = response.data;
            setStreamingBotsAvailable({ maximumCapacity, minimumCapacity });
        })
    }

    const handleFetchUsersList = (cb) => {
        adminStore.getAllUsers({ token: adminToken }).then(response => {
            if (response.success && response.data) {
                setUsersList(response.data.users);
                if (cb)
                    cb();
            } else {
                // TODO: RENEW ADMIN TOKEN IN CASE THERE IS ONE AND TRY.
                // Case user is not admin
                Swal.fire({
                    title: t(translationKeys.unauthorized),
                    text: t(translationKeys.validationErrorAdmin),
                    icon: 'error'
                });
                return props.history.push(Routes.home.url);
            }
        });
    }

    const handleFetchStreamersList = (cb) => {
        adminStore.getAllStreamers({ token: adminToken }).then(response => {
            if (response.success && response.data) {
                setStreamersList(response.data.streamers);
                if (cb)
                    cb();
            } else {
                // Case user is not admin
                Swal.fire({
                    title: t(translationKeys.unauthorized),
                    text: t(translationKeys.validationErrorAdmin),
                    icon: 'error'
                });
                return props.history.push(Routes.home.url);
            }
        });
    }

    const handleFetchFloatConstantsList = (cb) => {
        adminStore.getAllFloatConstants({ token: adminToken }).then(response => {
            if (response.success && response.data) {
                setConstantsList(response.data.constants);
                if (cb)
                    cb();
            } else {
                // Case user is not admin
                Swal.fire({
                    title: t(translationKeys.unauthorized),
                    text: t(translationKeys.validationErrorAdmin),
                    icon: 'error'
                });
                return props.history.push(Routes.home.url);
            }
        });
    }

    const resetAllValues = () => {
        setUsersEmailFilter('');
        setStreamersEmailFilter('');
        setConstantsNameFilter('');

        setUsersList(null);
        setStreamersList(null);
        setConstantsList(null);
    }

    const handleDeleteUser = (email) => {
        Swal.fire({
            title: t(translationKeys.youSureDeleteQuestion),
            text: `${t(translationKeys.userEmail)}: ${email}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t(translationKeys.yesDelete)
        }).then((result) => {
            if (result.value) {
                adminStore.deleteUser({ token: adminToken, userEmail: email }).then(response => {
                    if (response.error) {
                        return Swal.fire(
                            t(translationKeys.error),
                            t(translationKeys.errorDeletingUser),
                            'error'
                        )
                    }

                    const newUsersList = usersList.filter(i => i.email !== email);
                    setUsersList(newUsersList);

                    Swal.fire(
                        t(translationKeys.deleted),
                        t(translationKeys.userWithEmailDeleted, { email }),
                        'success'
                    )
                })

            }
        })
    }

    const updateUserInUsersList = (userEmail, newValues) => {
        if (!usersList) return;

        const userIndex = usersList.findIndex(u => u.email === userEmail);

        if (userIndex === -1) return;

        const userObj = usersList[userIndex];
        const newUserObj = { ...userObj, ...newValues };

        const newUsersList = [...usersList];
        newUsersList[userIndex] = newUserObj;

        setUsersList(newUsersList)
    }

    const updateConstantInConstantsList = (name, newValues) => {
        if (!constantsList) return;

        const constantIndex = constantsList.findIndex(i => i.name === name);

        if (constantIndex === -1) return;

        const constantObj = constantsList[constantIndex];
        const newConstantObj = { ...constantObj, ...newValues };

        const newConstantsList = [...constantsList];
        newConstantsList[constantIndex] = newConstantObj;

        setConstantsList(newConstantsList);
    }

    const handleAddBalance = (user) => {
        Swal.fire({
            title: t(translationKeys.balance),
            input: 'number',
            inputValue: user.balance,
            text: t(translationKeys.enterBalance),
            inputAttributes: {
                min: 0,
                step: 0.01,
                defaultValue: user.balance,
            },
        }).then(function (result) {
            if (result.value) {
                const amount = result.value
                if (amount < 0) {
                    return Swal.fire(t(translationKeys.error), t(translationKeys.validationErrorBalance), 'error');
                }

                Swal.showLoading();

                // Set balance request
                adminStore.setUserBalance({ token: adminToken, userEmail: user.email, balance: amount }).then(response => {
                    if (response.error) {
                        return Swal.fire(
                            t(translationKeys.error),
                            t(translationKeys.errorSetUserBalance),
                            'error'
                        )
                    }

                    updateUserInUsersList(user.email, { balance: amount })

                    Swal.fire(
                        t(translationKeys.success),
                        response.data.message || t(translationKeys.userNowHasBalance, { email: user.email, amount }),
                        'success'
                    )
                })
            }
        })
    }

    const handleEditConstant = (constant) => {
        Swal.fire({
            title: t(translationKeys.editConstant, { name: constant.name }),
            input: 'number',
            inputValue: constant.constant,
            text: t(translationKeys.setValue),
            inputAttributes: {
                min: 0,
                step: 0.01,
                defaultValue: constant.constant,
            },
        }).then(function (result) {
            if (result.value) {
                const amount = result.value

                Swal.showLoading();

                // Set balance request
                adminStore.setFloatConstantValue({ token: adminToken, name: constant.name, newConstantValue: amount }).then(response => {
                    if (response.error) {
                        return Swal.fire(
                            t(translationKeys.error),
                            t(translationKeys.errorSetConstantValue),
                            'error'
                        )
                    }

                    updateConstantInConstantsList(constant.name, { constant: amount, update_date: moment().unix() });

                    Swal.fire(
                        t(translationKeys.success),
                        response.data.message || t(translationKeys.constantValueChanged, { name: constant.name, amount }),
                        'success'
                    )
                })
            }
        })
    }

    useEffect(() => {
        if (!uploadStreamersCsv || uploadingStreamers) return;

        const parsedStreamersList = [];

        const streamersData = [...uploadStreamersCsv];
        // Remove fiirst row (head)
        const tableHead = streamersData.shift();


        setUploadingStreamers(true);

        streamersData.forEach((streamerRow) => {
            const newStreamer = {};
            streamerRow.forEach((cellValue, cellIndex) => {
                newStreamer[tableHead[cellIndex]] = cellValue;
            });
            parsedStreamersList.push(newStreamer);
        });

        const isStreamerValid = i => i.email && i.emailPassword && i.port && i.host && i.proxyUsername && i.proxyPassword;

        // Purge rows that were not complete.
        const validRows = parsedStreamersList.filter(i => isStreamerValid(i));
        const invalidRows = parsedStreamersList.filter(i => !isStreamerValid(i));

        console.log('Invalid rows: ', invalidRows);

        let done = 0;
        const errorStreamers = [];
        const successStreamers = [];

        validRows.forEach(streamer => {
            adminStore.addStreamer({ token: adminToken, ...streamer }).then((response) => {
                done += 1;

                if (response.error) {
                    errorStreamers.push(streamer);
                } else {
                    successStreamers.push(streamer);
                }

                if (done === validRows.length) {
                    // Finished
                    console.log('Success streamers: ', successStreamers);
                    console.log('Error streamers: ', errorStreamers);

                    Swal.fire({
                        title: t(translationKeys.uploadFinished),
                        html: `${t(translationKeys.streamersUploadFinished)} 
                        <br> 
                        ${t(translationKeys.successfullyUploadedStreamersEmail)}: ${successStreamers.map(i => i.email).join(", ")}. 
                        ${errorStreamers.length > 0 ? `
                        <br>
                         ${t(translationKeys.errorStreamersEmails)}: ${errorStreamers.map(i => i.email).join(", ")}. 
                         <br>
                        ` : ''}
                          ${invalidRows.length} ${t(translationKeys.rowsWereIgnored)}`,
                        icon: 'success'
                    });

                    handleFetchStreamersList();

                    setUploadingStreamers(false);
                }
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadStreamersCsv]);

    const handleUploadStreamersFromCsv = () => {
        const fileInput = document.getElementById('uploadStreamersCsvInput');
        if (!fileInput) return;

        fileInput.click();
    }

    const usersTab = (
        <div>
            <div className="form-group">
                <label className="font-weight-bold text-dark">{t(translationKeys.filterByEmail)}:</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        //   onKeyPress={evt => handlePressEnter(evt, handleSearch)}
                        onChange={evt => setUsersEmailFilter(evt.target.value)}
                        value={usersEmailFilter}
                    />

                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">{t(translationKeys.email)}</th>
                        <th scope="col">{t(translationKeys.balance)}</th>
                        <th scope="col">{t(translationKeys.creationDate)}</th>

                        <th scope="col">{t(translationKeys.setBalance)}</th>
                        <th scope="col">{t(translationKeys.delete)}</th>
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    {filteredUsersList && filteredUsersList.map(u => <tr key={u.email}>
                        <td>{u.email}</td>
                        <td>{u.balance}</td>
                        <td>{moment.unix(u.creation_date).format('lll')}</td>

                        <td className="text-center"><button className="btn btn-success" onClick={() => handleAddBalance(u)}><i className="fa fa-edit"></i></button></td>
                        <td className="text-center"><button className="btn btn-danger" onClick={() => handleDeleteUser(u.email)}><i className="fa fa-trash"></i></button></td>
                    </tr>)}
                </tbody>
            </table>
            {(!loadingUsersList && (!filteredUsersList || filteredUsersList.length === 0)) ? <p>{t(translationKeys.noUsersFound)}</p> : null}
            {loadingUsersList && (
                <div className="card mb-3">
                    <div className="card-body text-center p-2 ">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    const streamersTab = (
        <div>
            <div className="form-group">
                <label className="font-weight-bold text-dark">{t(translationKeys.filterByEmail)}:</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        onChange={evt => setStreamersEmailFilter(evt.target.value)}
                        value={streamersEmailFilter}
                    />

                </div>
            </div>

            <button disabled={uploadingStreamers} className="btn btn-info mb-2" onClick={handleUploadStreamersFromCsv}><i className="fa fa-upload"></i> Upload Streamers from .csv</button>
            <CSVReader cssInputClass="invisible" cssClass="invisible position-absolute" inputId="uploadStreamersCsvInput" onFileLoaded={(data, fileInfo) => setUploadStreamersCsv(data)} />

            <table className="table table-striped">
                <thead>
                    <tr>
                        {/* <th scope="col">#</th> */}
                        <th scope="col">{t(translationKeys.email)}</th>
                        <th scope="col">{t(translationKeys.emailPassword)}</th>
                        <th scope="col">{t(translationKeys.host)}</th>
                        <th scope="col">{t(translationKeys.port)}</th>
                        <th scope="col">{t(translationKeys.proxyUsername)}</th>
                        <th scope="col">{t(translationKeys.proxyPassword)}</th>
                        <th scope="col">{t(translationKeys.active)}</th>
                        <th scope="col">{t(translationKeys.previousActivityDate)}</th>

                        {/* <th scope="col">Edit</th> */}
                        {/* <th scope="col">Delete</th> */}
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    {filteredStreamersList && filteredStreamersList.map(u => <tr key={u.email}>
                        <td>{u.email}</td>
                        <td>{u.email_password}</td>
                        <td>{u.host}</td>
                        <td>{u.port}</td>
                        <td>{u.proxy_username}</td>
                        <td>{u.proxy_password}</td>
                        <td>{u.active ? <span className="text-success">{t(translationKeys.yes)}</span> : <span className="text-danger">{t(translationKeys.no)}</span>}</td>
                        <td>{moment.unix(u.previous_activity_date).format('lll')}</td>

                        {/* <td><button className="btn btn-info"><i className="fa fa-edit"></i></button></td> */}
                        {/* <td><button className="btn btn-danger" onClick={() => handleDeleteUser(u.email)}><i className="fa fa-trash"></i></button></td> */}
                    </tr>)}
                </tbody>
            </table>
            {(!loadingStreamersList && (!filteredStreamersList || filteredStreamersList.length === 0)) ? <p>{t(translationKeys.noStreamersFound)}</p> : null}
            {loadingStreamersList && (
                <div className="card mb-3">
                    <div className="card-body text-center p-2 ">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    const floatConstantsTab = (
        <div>
            <div className="form-group">
                <label className="font-weight-bold text-dark">{t(translationKeys.filterByName)}:</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        onChange={evt => setConstantsNameFilter(evt.target.value)}
                        value={constantsNameFilter}
                    />

                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        {/* <th scope="col">#</th> */}
                        <th scope="col">{t(translationKeys.name)}</th>
                        <th scope="col">{t(translationKeys.constant)}</th>
                        <th scope="col">{t(translationKeys.updateDate)}</th>
                        <th scope="col">{t(translationKeys.edit)}</th>
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    {filteredConstantsList && filteredConstantsList.map(i => <tr key={i.email}>
                        <td>{i.name}</td>
                        <td>{i.constant}</td>
                        <td>{moment.unix(i.update_date).format('lll')}</td>
                        <td><button className="btn btn-info" onClick={() => handleEditConstant(i)}><i className="fa fa-edit"></i></button></td>
                    </tr>)}
                </tbody>
            </table>
            {(!loadingConstantsList && (!filteredConstantsList || filteredConstantsList.length === 0)) ? <p>{t(translationKeys.noFloatConstantsFound)}</p> : null}
            {loadingConstantsList && (
                <div className="card mb-3">
                    <div className="card-body text-center p-2 ">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    const renderCurrentTab = () => {
        switch (currentTab) {
            case tabs.Users:
                return usersTab;
            case tabs.Streamers:
                return streamersTab;
            case tabs.FloatConstants:
                return floatConstantsTab;
            default:
                return;
        }
    }

    if (!initialized) return <LoadingScreen />

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>

            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">{t(translationKeys.adminPanel)}</h1>
            </div>

            <div className="content px-3 my-3">
                <ul className="nav nav-tabs mb-2">
                    {Object.values(tabs).map(k => <li key={k} className="nav-item" onClick={() => setCurrentTab(k)}>
                        <a className={`nav-link ${currentTab === k ? 'active' : ''}`} href="#">{t(k)}</a>
                    </li>)}
                </ul>
                {renderCurrentTab()}
            </div>
        </div>
    );
}

export default withTranslation()(withRouter(observer(AdminPanel)));
