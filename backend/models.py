"""Database models for bills and rate cards."""
from sqlalchemy import Column, String, Float, Integer, JSON, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
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


class RateCard(Base):
    """Rate card model for storing rate card documents."""
    __tablename__ = "rate_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    created_date = Column(String, nullable=False)
    
    items = relationship("RateCardItem", back_populates="rate_card", cascade="all, delete-orphan")


class RateCardItem(Base):
    """Rate card item model for storing service rates."""
    __tablename__ = "rate_card_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    rate_card_id = Column(UUID(as_uuid=True), ForeignKey("rate_cards.id", ondelete="CASCADE"), nullable=False)
    sr_no = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    labor_work = Column(String, nullable=False)
    material_specs = Column(Text, nullable=False)
    rate_with_material = Column(String, nullable=False)
    display_order = Column(Integer, nullable=False)
    
    rate_card = relationship("RateCard", back_populates="items")
