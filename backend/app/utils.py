from app.models import User
from app.db import db

def create_admin_user():
    if not User.query.filter_by(email="admin@example.com").first():
        admin = User(email="admin@example.com", name="Admin")
        admin.set_password("adminpass")
        db.session.add(admin)
        db.session.commit()