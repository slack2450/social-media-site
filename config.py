import os

class Config(object):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + \
        os.path.join(os.path.abspath(
            os.path.dirname(__file__)), 'database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = 'SUPERSECRET'