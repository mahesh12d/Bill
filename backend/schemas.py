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


class Bill(BaseModel):
    """Schema for bill response."""
    id: UUID
    billNo: str = Field(alias="bill_no")
    date: str
    customerName: str = Field(alias="customer_name")
    lineItems: List[LineItem] = Field(alias="line_items")
    total: float
    amountInWords: str = Field(alias="amount_in_words")

    class Config:
        from_attributes = True
        populate_by_name = True


class LeisureItemBase(BaseModel):
    """Base schema for leisure item."""
    srNo: int
    description: str
    laborWork: str
    materialSpecs: str
    rateWithMaterial: str


class LeisureItemCreate(LeisureItemBase):
    """Schema for creating a leisure item."""
    pass


class LeisureItemUpdate(BaseModel):
    """Schema for updating a leisure item."""
    srNo: Optional[int] = None
    description: Optional[str] = None
    laborWork: Optional[str] = None
    materialSpecs: Optional[str] = None
    rateWithMaterial: Optional[str] = None


class LeisureItem(BaseModel):
    """Schema for leisure item response."""
    id: int
    srNo: int = Field(alias="sr_no")
    description: str
    laborWork: str = Field(alias="labor_work")
    materialSpecs: str = Field(alias="material_specs")
    rateWithMaterial: str = Field(alias="rate_with_material")

    class Config:
        from_attributes = True
        populate_by_name = True
