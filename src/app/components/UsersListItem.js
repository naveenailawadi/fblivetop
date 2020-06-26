import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';

const UserListItem = props => {
    const {
        username, email,
    } = props;

    return (
        <div className="card mb-2">
            <div className={'card-body bg-white text-dark drop-right p-4 py-3'}>
                <div className="d-flex row">
                    <div className="text-dark col-12 col-lg-6">
                        {/* <p className="h4 mb-2">{username}</p> */}

                        <div className="mb-2">
                            <span className="h5">Username: </span> <span className="font-weight-light">{username}</span>
                        </div>
                        <div className="mb-2">
                            <span className="h5">Email: </span> <span className="font-weight-light">{email}</span>
                        </div>
                        {/* <div className="mb-2">
              <span className="h5">Tickets Bought : </span>{' '}
              <span className="font-weight-light">Need to fetch</span>
            </div> */}
                    </div>
                    <div
                        className="d-flex flex-column mt-3 mt-lg-0 col-12 col-lg-6 align-items-center"
                        style={{ alignSelf: 'center' }}
                    >
                        <button
                            // disabled={adminStore.loaders.updateUser}
                            className={`btn btn-primary text-white mb-3 fit-content w-100`}
                        // onClick={handleSendMessage}
                        >
                            Change Account
            </button>
                        <button
                            // disabled={adminStore.loaders.updateUser}
                            className={`btn btn-primary text-white mb-3 fit-content w-100`}
                            // onClick={handleToggleAdmin}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(UserListItem);
