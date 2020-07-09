import _ from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import validator from 'validator';
import { DataStoreContext } from '../../core/stores/DataStore';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import Routes from '../constants/Routes';

const StreamingForm = (props) => {
    const dataStore = useContext(DataStoreContext);
    const { streamingStore, authenticationStore } = dataStore;

    const { data: { user } } = authenticationStore;

    const [minutes, setMinutes] = useState(0);
    const [fbAccounts, setFbAccounts] = useState(0);
    const [streamUrl, setStreamUrl] = useState('');
    const [streamingCost, setStreamingCost] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [availableStreamers, setAvailableStreamers] = useState(null);

    const loadingCheckStreamingCost = streamingStore.loaders.checkStreamingCost;
    const loadingGetStreamingBotsAvailable = streamingStore.loaders.getStreamingBotsAvailable;
    const loadingStreamLink = streamingStore.loaders.streamLink;

    const enoughMoneyForPurchase = !_.isNil(userBalance) && !_.isNil(streamingCost) && Number(userBalance) >= Number(streamingCost);
    const requiredFieldsFilled = (streamUrl) && !_.isNil(minutes) && !_.isNil(fbAccounts)

    useEffect(() => {
        streamingStore.checkStreamingCost({ token: user.token, streamerCount: Number(fbAccounts), streamTime: Number(minutes) }).then(response => {
            if (response.error) {
                setStreamingCost(null);
                setUserBalance(null);
                setAvailableStreamers(null);
            } else {
                setStreamingCost(response.data.cost);
                setUserBalance(response.data.balance);
                setAvailableStreamers(response.data.available_streamers);
            }
        })
        // eslint-disable-next-line
    }, [fbAccounts, minutes]);

    const handleSubmitForm = () => {
        if (minutes < 1 || !_.isInteger(minutes)) return alert('Minutes should be an integer larger than 0.');
        if (fbAccounts < 1 || !_.isInteger(fbAccounts)) return alert('Facebook accounts should be an integer larger than 0.')

        if (!validator.isURL(streamUrl)) return alert('Stream url should be a valid URL.');

        streamingStore.streamLink({ token: user.token, streamerCount: fbAccounts, streamTime: minutes, streamUrl }).then(response => {
            if (response.error) {
                return Swal.fire({
                    title: 'Unauthorized',
                    text: (response.data && response.data.message) || 'Internal server error. Please try again later.',
                    icon: 'error'
                });
            }

            Swal.fire({
                title: 'Success',
                text: (response.data && response.data.message) || 'Streaming started successfully!',
                icon: 'success',
                timer: 2000,
            }).then(result => {
                window.location.reload();
            });
        })
    }


    // useEffect(() => {
    //     if (!_.isInteger(minutes))
    //         setMinutes(Math.floor(minutes))
    //     if (minutes < 0) setMinutes(0);
    // }, [minutes])

    // useEffect(() => {
    //     if (!_.isInteger(fbAccounts))
    //         setFbAccounts(Math.floor(fbAccounts))
    //     if (fbAccounts < 0) setFbAccounts(0);
    // }, [fbAccounts])

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Streaming Form</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label htmlFor="streamingFormMinutes">Number of minutes *</label>
                            <input value={minutes} pattern="\d*" step="1" onChange={evt => setMinutes(evt.target.value)} min={0} type="number" className="form-control" id="streamingFormMinutes" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="streamingFormAccounts">Number of Facebook accounts *</label>
                            <input value={fbAccounts} pattern="\d*" step="1" onChange={evt => setFbAccounts(evt.target.value)} min={0} type="number" className="form-control" id="streamingFormAccounts" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="streamingFormStreamUrl">Link to stream *</label>
                            <input value={streamUrl} onChange={evt => setStreamUrl(evt.target.value)} className="form-control" id="streamingFormStreamUrl" />
                        </div>
                        {!_.isNil(streamingCost) && !_.isNil(userBalance) && !loadingCheckStreamingCost ? (
                            <div>
                                <p>Cost: <span className="text-info">{streamingCost}</span></p>
                                <p>Your balance: <span className="text-success">{userBalance}</span></p>
                                {/* {enoughMoneyForPurchase ?
                                    <p>Balance after purchase: <span className="text-info">{userBalance - streamingCost}</span></p>
                                    : null} */}
                                {enoughMoneyForPurchase ?
                                    <p className="text-success">You can do this purchase.</p> : (
                                        <p className="text-danger">Not enough balance for this purchase.</p>
                                    )}
                            </div>
                        ) : null}
                        {loadingCheckStreamingCost && (
                            <div className="card mb-3">
                                <div className="card-body text-center p-2 ">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loadingCheckStreamingCost && (_.isNil(streamingCost) || _.isNil(userBalance)) && (
                            <p className="text-danger">There was a problem estimating streaming price. Please change the values above.</p>
                        )}

                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmitForm} disabled={loadingStreamLink || loadingCheckStreamingCost || loadingGetStreamingBotsAvailable || !enoughMoneyForPurchase || !requiredFieldsFilled}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(StreamingForm);
