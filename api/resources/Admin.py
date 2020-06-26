from flask_restful import Resource
from api.resources import load_json
from api.models import db, User, validate_admin
from api import bcrypt, app
from datetime import datetime as dt, timedelta
import jwt


# create a class for admins to get all the user data
class AdminUserManagementResource(Resource):
    # create a post method to get all the users
    def post(self):
        # get the admin_data and authenticate the admin
        data = load_json()

        # validate the admin
        if not validate_admin(data['email'], data['password']):
            return {'message': 'You are not allowed to access this resource.'}, 403

        # get the data from all the users
        users = [{'email': user.email} for user in User.query.all()]

        return {'users': users}, 201

    # create a method to delete users from the admin page (without a password)
    def delete(self):
        data = load_json()

        # validate the admin
        if not validate_admin(data['email'], data['password']):
            return {'message': 'You are not allowed to access this resource.'}, 403

        # find the user to delete via email
        user_email = data['user_email']
        user = User.query.filter_by(email=user_email).first()

        # if no user, return so
        if not user:
            return {'message': f"no account associated with {user_email}"}, 404

        # else delete the user
        db.session.delete(user)
        db.session.commit()

        return {'status': 'success', 'message': f"Deleted {user_email}"}, 201
