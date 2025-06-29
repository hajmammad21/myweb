"""Add category to Product

Revision ID: 202c1ec5d679
Revises: 88f01c931283
Create Date: 2025-06-26 01:50:34.962641

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '202c1ec5d679'
down_revision = '88f01c931283'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('category', sa.String(length=100), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.drop_column('category')

    # ### end Alembic commands ###
