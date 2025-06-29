from .auth import auth_bp
from .users import users_bp
from .contact import contact_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(contact_bp, url_prefix='/api')
