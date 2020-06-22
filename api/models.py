from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# create a user model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(320), nullable=False)
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
