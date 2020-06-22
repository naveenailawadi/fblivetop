from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)

app.config['SECRET_KEY'] = 'c0115a8363cdd98b3c822c1adba5a7c9'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fblivetop.db'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# run it!
CORS(app, supports_credentials=True)
from flaskapp import routes
