import React from 'react';

const SignUp = () => {
    return (
        <div class="container-sm" style={{ maxWidth: '760px' }}>
            <div class="card mt-5">
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="signUpUsername">Username</label>
                            <input class="form-control" id="signUpUsername" />
                        </div>
                        <div class="form-group">
                            <label for="signUpEmail">Email</label>
                            <input class="form-control" id="signUpEmail" />
                        </div>
                        <div class="form-group">
                            <label for="signUpPassword">Password</label>
                            <input type="password" class="form-control" id="signUpPassword" />
                        </div>
                        <div class="form-group">
                            <label for="signUpPasswordConfirmation">Password Confirmation</label>
                            <input type="password" class="form-control" id="signUpPasswordConfirmation" />
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
