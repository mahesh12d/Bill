"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID


class LineItem(BaseModel):
    """Schema for bill line item."""
    srNo: int
    description: str
    qty: float
    rate: float
    amount: float


class BillBase(BaseModel):
    """Base schema for bill data."""
    billNo: str
    date: str
    customerName: str
    lineItems: List[LineItem]
    total: float
    amountInWords: str


class BillCreate(BillBase):
    """Schema for creating a new bill."""
    pass


class BillUpdate(BillBase):
    """Schema for updating an existing bill."""
    pass


class Bill(BillBase):
    """Schema for bill response."""
    id: UUID

    class Config:
        from_attributes = True


class RateCardItemBase(BaseModel):
    """Base schema for rate card item."""
    srNo: int
    description: str
    laborWork: str
    materialSpecs: str
    rateWithMaterial: str
    displayOrder: int


class RateCardItemCreate(RateCardItemBase):
    """Schema for creating a rate card item."""
    pass


class RateCardItemUpdate(BaseModel):
    """Schema for updating a rate card item."""
    srNo: Optional[int] = None
    description: Optional[str] = None
    laborWork: Optional[str] = None
    materialSpecs: Optional[str] = None
    rateWithMaterial: Optional[str] = None
    displayOrder: Optional[int] = None


class RateCardItem(RateCardItemBase):
    """Schema for rate card item response."""
    id: int

    class Config:
        from_attributes = True
        populate_by_name = True
    
    @classmethod
    def model_validate(cls, obj):
        """Custom validation to map snake_case DB fields to camelCase."""
        if hasattr(obj, 'sr_no'):
            return cls(
                id=obj.id,
                srNo=obj.sr_no,
                description=obj.description,
                laborWork=obj.labor_work,
                materialSpecs=obj.material_specs,
                rateWithMaterial=obj.rate_with_material,
                displayOrder=obj.display_order
            )
        return super().model_validate(obj)
