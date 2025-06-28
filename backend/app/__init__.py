from flask import Flask
from flask_mail import Mail  # Import the Mail object
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from app.extensions import db, jwt
from app.routes.auth import auth_bp
from app.routes.users import users_bp
from app.utils import create_admin_user
from dotenv import load_dotenv
from app.routes import auth_bp, users_bp, contact_bp
from flask_cors import CORS
import os

load_dotenv()

# Initialize Flask-Mail
mail = Mail()

migrate = Migrate()  # ← Moved to top level so Flask CLI can see it

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('../config.py')
    CORS(app)

    # Initialize Flask extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)  # Initialize Flask-Mail here
    migrate.init_app(app, db)  # ← properly initialize migrate here
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(contact_bp, url_prefix='/api')

    with app.app_context():
        db.create_all()
        create_admin_user()

    return app
