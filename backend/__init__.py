from config import Config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.login_view = 'routes.login'
login_manager.init_app(app)

from backend import routes, models

db.create_all()

# Required by flask-login to reload the user
# object from the user id stored in the session
@login_manager.user_loader
def load_user(user_id):
    return models.User.query.get(int(user_id))