from flask_restful import Resource
from api.resources import load_json
from api.models import db, User
from api import bcrypt


# create a resource for user addition
class UserResource(Resource):
    # create users
    def post(self):
        json_data = load_json()

        # get the email and password
        try:
            email = json_data['email']
            password = json_data['password']
            confirmed_password = json_data['confirmed_password']
        except KeyError:
            return {'message': 'request must include email, password, and confirmed_password'}, 422

        # check if the user exists
        test_user = User.query.filter_by(email=email).first()
        if test_user:
            return {'message', f"There is already an account associated with {email}."}, 403

        # check if the passwords match
        if password != confirmed_password:
            return {'message': 'Passwords do not match.'}, 409

        # hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # create a user and add it to the database
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return {'status': 'success'}, 201
