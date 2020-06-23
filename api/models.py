from api import db
from api import bcrypt


# create a user model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)

    creation_date = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())


# create a model to hold the streamers
class Streamer(db.Model):
    __tablename__ = 'streamers'
    id = db.Column(db.Integer, primary_key=True)
    host = db.Column(db.String(30), nullable=False)
    proxy = db.Column(db.String(10), nullable=False)

    username = db.Column(db.String(100), nullable=True)
    password = db.Column(db.String(50), nullable=True)

    # store info for activity
    active = db.Column(db.Boolean, default=False)
    previous_activity_date = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())


# create a function to validate users
def validate_user(email, password):
    # get the user
    user = User.query.filter_by(email=email).first()

    if not user:
        return False, {'message': f"no account associated with {email}"}, 404

    # check if passwords match
    if not bcrypt.check_password_hash(user.password, password):
        return False, {'message': f"incorrect password for {email}"}, 401

    return True, user, 201
