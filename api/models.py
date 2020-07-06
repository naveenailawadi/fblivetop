from api import db
from api import bcrypt
from api.admin_config import ADMIN_PROFILE
from datetime import datetime as dt


# create a user model
class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    balance = db.Column(db.Float, default=0.0)

    creation_date = db.Column(
        db.TIMESTAMP, server_default=db.func.current_timestamp())


# create a model to hold the streamers
class StreamerModel(db.Model):
    __tablename__ = 'streamers'
    id = db.Column(db.Integer, primary_key=True)
    host = db.Column(db.String(30), nullable=False)
    port = db.Column(db.String(10), nullable=False)

    email = db.Column(db.String(100), nullable=True)
    email_password = db.Column(db.String(50), nullable=True)

    proxy_username = db.Column(db.String(100), nullable=True)
    proxy_password = db.Column(db.String(50), nullable=True)

    # store info for activity
    active = db.Column(db.Boolean, default=False)
    previous_activity_date = db.Column(
        db.TIMESTAMP, server_default=db.func.current_timestamp())

    def proxy_dict(self):
        # format the proxy as a dictionary understandable by other classes
        return {'host': self.host, 'port': self.port, 'username': self.proxy_username, 'password': self.proxy_password}


# create a model for constants
class FloatConstantModel(db.Model):
    __tablename__ = 'float_constants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, default=None, nullable=False)
    constant = db.Column(db.Float, unique=False, default=0.0)

    update_date = db.Column(
        db.TIMESTAMP, server_default=db.func.current_timestamp())


# create a function to validate users
def validate_user(email, password):
    # get the user
    user = UserModel.query.filter_by(email=email).first()

    if not user:
        return False, {'message': f"no account associated with {email}"}, 404

    # check if passwords match
    if not bcrypt.check_password_hash(user.password, password):
        return False, {'message': f"incorrect password for {email}"}, 401

    return True, user, 201


def validate_admin(email, password):
    if email != ADMIN_PROFILE['email']:
        return False
    elif password != ADMIN_PROFILE['password']:
        return False
    else:
        return True


# create a function to handle datetimes
def check_dt(value):
    if type(value) is dt:
        value = value.strftime('%s')

    return value


def object_as_dict(obj):
    obj_dict = {c.key: getattr(obj, c.key)
                for c in db.inspect(obj).mapper.column_attrs}

    # format datetimes
    obj_dict = {key: check_dt(value) for key, value in obj_dict.items()}
    return obj_dict


def update_obj(obj, yourdict):
    for key, value in yourdict.items():
        setattr(obj, key, value)
