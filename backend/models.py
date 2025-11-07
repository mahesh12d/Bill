"""Database models for bills and leisure items."""
from sqlalchemy import Column, String, Float, Integer, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .database import Base


class Bill(Base):
    """Bill model for storing customer bills."""
    __tablename__ = "bills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bill_no = Column(String, nullable=False, unique=True)
    date = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    line_items = Column(JSON, nullable=False)  # Array of {srNo, description, qty, rate, amount}
    total = Column(Float, nullable=False)
    amount_in_words = Column(Text, nullable=False)


class LeisureItem(Base):
    """Leisure item model for storing service rates."""
    __tablename__ = "leisure_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    sr_no = Column(Integer, nullable=False, unique=True)
    description = Column(Text, nullable=False)
    labor_work = Column(Text, nullable=False)
    material_specs = Column(Text, nullable=False)
    rate_with_material = Column(String, nullable=False)
