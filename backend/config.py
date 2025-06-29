import os
from datetime import timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///app.db")
SQLALCHEMY_TRACK_MODIFICATIONS = False
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")
JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USERNAME = 'drlegend.mahdavi@gmail.com'
MAIL_PASSWORD = 'fvpz xrbk atxw dudp'
MAIL_DEFAULT_SENDER = 'drlegend.mahdavi@gmail.com'