from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)

app.config['SECRET_KEY'] = 'c0115a8363cdd98b3c822c1adba5a7c9'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://python:hotFB123live@localhost/fblivetop'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# run it!
CORS(app, supports_credentials=True)
from api import routes
