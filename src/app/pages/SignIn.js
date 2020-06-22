import React from 'react';

const SignIn = () => {
    return (
        <div class="container-sm" style={{ maxWidth: '760px' }}>
            <div class="card mt-5">
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
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
