from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from app.db import db
from app.routes.auth import auth_bp
from app.routes.users import users_bp
from app.utils import create_admin_user
from dotenv import load_dotenv
from app.routes import auth_bp, users_bp, contact_bp
from flask_cors import CORS
import os

load_dotenv()

migrate = Migrate()  # ← Moved to top level so Flask CLI can see it

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('config.py')
    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)  # ← properly initialize migrate here
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(contact_bp, url_prefix='/api')

    with app.app_context():
        db.create_all()
        create_admin_user()

    return app
