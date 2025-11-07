"""FastAPI main application."""
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import uuid

from . import models, schemas
from .database import engine, get_db, Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Mahesh Electrical Engineers API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Bill Endpoints
@app.get("/api/bills", response_model=List[schemas.Bill])
def get_bills(db: Session = Depends(get_db)):
    """Get all bills, sorted by bill number descending."""
    bills = db.query(models.Bill).order_by(models.Bill.bill_no.desc()).all()
    return bills


@app.get("/api/bills/{bill_id}", response_model=schemas.Bill)
def get_bill(bill_id: str, db: Session = Depends(get_db)):
    """Get a specific bill by ID."""
    try:
        bill_uuid = uuid.UUID(bill_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid bill ID format")
    
    bill = db.query(models.Bill).filter(models.Bill.id == bill_uuid).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill


@app.get("/api/bills-next-number")
def get_next_bill_number(db: Session = Depends(get_db)):
    """Get the next available bill number."""
    # Get the highest bill number
    bills = db.query(models.Bill).order_by(models.Bill.bill_no.desc()).first()
    
    if not bills:
        return {"nextNumber": "1"}
    
    try:
        # Extract number from bill_no (assumes format like "001", "002", etc.)
        last_number = int(bills.bill_no)
        next_number = last_number + 1
        return {"nextNumber": str(next_number).zfill(3)}
    except ValueError:
        # If bill_no is not a number, return "1"
        return {"nextNumber": "1"}


@app.post("/api/bills", response_model=schemas.Bill, status_code=status.HTTP_201_CREATED)
def create_bill(bill: schemas.BillCreate, db: Session = Depends(get_db)):
    """Create a new bill."""
    # Convert Pydantic model to dict for JSON storage
    line_items_dict = [item.model_dump() for item in bill.lineItems]
    
    db_bill = models.Bill(
        bill_no=bill.billNo,
        date=bill.date,
        customer_name=bill.customerName,
        line_items=line_items_dict,
        total=bill.total,
        amount_in_words=bill.amountInWords
    )
    
    db.add(db_bill)
    try:
        db.commit()
        db.refresh(db_bill)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating bill: {str(e)}")
    
    return db_bill


@app.put("/api/bills/{bill_id}", response_model=schemas.Bill)
def update_bill(bill_id: str, bill: schemas.BillUpdate, db: Session = Depends(get_db)):
    """Update an existing bill."""
    try:
        bill_uuid = uuid.UUID(bill_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid bill ID format")
    
    db_bill = db.query(models.Bill).filter(models.Bill.id == bill_uuid).first()
    if not db_bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    # Convert Pydantic model to dict for JSON storage
    line_items_dict = [item.model_dump() for item in bill.lineItems]
    
    db_bill.bill_no = bill.billNo
    db_bill.date = bill.date
    db_bill.customer_name = bill.customerName
    db_bill.line_items = line_items_dict
    db_bill.total = bill.total
    db_bill.amount_in_words = bill.amountInWords
    
    try:
        db.commit()
        db.refresh(db_bill)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error updating bill: {str(e)}")
    
    return db_bill


@app.delete("/api/bills/{bill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bill(bill_id: str, db: Session = Depends(get_db)):
    """Delete a bill."""
    try:
        bill_uuid = uuid.UUID(bill_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid bill ID format")
    
    db_bill = db.query(models.Bill).filter(models.Bill.id == bill_uuid).first()
    if not db_bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    db.delete(db_bill)
    db.commit()
    return None


# Leisure Item Endpoints
@app.get("/api/leisure-items", response_model=List[schemas.LeisureItem])
def get_leisure_items(db: Session = Depends(get_db)):
    """Get all leisure items, sorted by serial number."""
    items = db.query(models.LeisureItem).order_by(models.LeisureItem.sr_no).all()
    return items


@app.get("/api/leisure-items/{item_id}", response_model=schemas.LeisureItem)
def get_leisure_item(item_id: int, db: Session = Depends(get_db)):
    """Get a specific leisure item by ID."""
    item = db.query(models.LeisureItem).filter(models.LeisureItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Leisure item not found")
    return item


@app.post("/api/leisure-items", response_model=schemas.LeisureItem, status_code=status.HTTP_201_CREATED)
def create_leisure_item(item: schemas.LeisureItemCreate, db: Session = Depends(get_db)):
    """Create a new leisure item."""
    db_item = models.LeisureItem(
        sr_no=item.srNo,
        description=item.description,
        labor_work=item.laborWork,
        material_specs=item.materialSpecs,
        rate_with_material=item.rateWithMaterial
    )
    
    db.add(db_item)
    try:
        db.commit()
        db.refresh(db_item)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating leisure item: {str(e)}")
    
    return db_item


@app.put("/api/leisure-items/{item_id}", response_model=schemas.LeisureItem)
def update_leisure_item(item_id: int, item: schemas.LeisureItemUpdate, db: Session = Depends(get_db)):
    """Update an existing leisure item."""
    db_item = db.query(models.LeisureItem).filter(models.LeisureItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Leisure item not found")
    
    update_data = item.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "srNo":
            setattr(db_item, "sr_no", value)
        elif field == "laborWork":
            setattr(db_item, "labor_work", value)
        elif field == "materialSpecs":
            setattr(db_item, "material_specs", value)
        elif field == "rateWithMaterial":
            setattr(db_item, "rate_with_material", value)
        else:
            setattr(db_item, field, value)
    
    try:
        db.commit()
        db.refresh(db_item)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error updating leisure item: {str(e)}")
    
    return db_item


@app.delete("/api/leisure-items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_leisure_item(item_id: int, db: Session = Depends(get_db)):
    """Delete a leisure item."""
    db_item = db.query(models.LeisureItem).filter(models.LeisureItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Leisure item not found")
    
    db.delete(db_item)
    db.commit()
    return None


# Health check endpoint
@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Serve static files for production
if os.path.exists("dist/public"):
    app.mount("/", StaticFiles(directory="dist/public", html=True), name="static")
