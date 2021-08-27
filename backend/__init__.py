from config import Config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
import logging

LOG_FILE_DEBUG  = 'debug.log'
LOG_FILE_ERROR = 'error.log'

root_logger = logging.getLogger()

LOG_FORMAT = '%(asctime)s %(name)-12s %(levelname)-8s %(message)s'
log_formatter = logging.Formatter(LOG_FORMAT)

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(log_formatter)
root_logger.addHandler(stream_handler)

file_handler_info = logging.FileHandler(LOG_FILE_DEBUG, mode='a')
file_handler_info.setLevel(logging.DEBUG)
file_handler_info.setFormatter(log_formatter)
root_logger.addHandler(file_handler_info)

file_handler_error = logging.FileHandler(LOG_FILE_ERROR, mode='a')
file_handler_error.setLevel(logging.ERROR)
file_handler_error.setFormatter(log_formatter)
root_logger.addHandler(file_handler_error)

app = Flask(__name__)
app.config.from_object(Config)

# Security: Disable CORS in production
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