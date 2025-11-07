"""Seed initial rate card data into the database."""
import os
import sys
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import RateCardItem


def seed_rate_card_items():
    """Seed initial rate card items."""
    db: Session = SessionLocal()
    
    try:
        # Check if data already exists
        existing_count = db.query(RateCardItem).count()
        if existing_count > 0:
            print(f"Rate card already has {existing_count} items. Skipping seed.")
            return
        
        # Initial rate card data
        rate_items = [
            {
                "sr_no": 1,
                "description": "Standard Lighting/Fan Point Fitting & Wiring (Tube Light, Fan, Light Point)",
                "labor_work": "₹250",
                "material_specs": "Vinay Adora Switches, Polycab/Patel Wires/Cables",
                "rate_with_material": "₹750",
                "display_order": 1
            },
            {
                "sr_no": 2,
                "description": "Computer/Power Board Wiring Point (1 Point)",
                "labor_work": "₹200",
                "material_specs": "Vinay Adora Switches, Polycab/Patel Wires/Cables",
                "rate_with_material": "₹600",
                "display_order": 2
            },
            {
                "sr_no": 3,
                "description": "A.C. (Air Conditioner) Power Point",
                "labor_work": "₹300",
                "material_specs": "Heavy Duty Wire/Socket, MCB",
                "rate_with_material": "₹900",
                "display_order": 3
            },
            {
                "sr_no": 4,
                "description": "Ceiling Fan Fitting (Labor Only)",
                "labor_work": "₹150",
                "material_specs": "-",
                "rate_with_material": "-",
                "display_order": 4
            },
            {
                "sr_no": 5,
                "description": "Ceiling Fan Fitting with Dimmer (Supply & Install)",
                "labor_work": "-",
                "material_specs": "Supply of Standard Dimmer/Regulator",
                "rate_with_material": "₹500",
                "display_order": 5
            },
            {
                "sr_no": 6,
                "description": "Fan Down Hook/J-Hook Fitting (Supply & Install)",
                "labor_work": "-",
                "material_specs": "Supply of Standard J-Hook/Down Rod Set",
                "rate_with_material": "₹250",
                "display_order": 6
            },
            {
                "sr_no": 7,
                "description": "Dome/LED Light Fitting (Labor Only)",
                "labor_work": "₹100",
                "material_specs": "-",
                "rate_with_material": "-",
                "display_order": 7
            },
            {
                "sr_no": 8,
                "description": "Distribution Board (DB) Point/Wiring",
                "labor_work": "Quoted Separately",
                "material_specs": "Based on Circuit Load & Size",
                "rate_with_material": "Quoted Separately",
                "display_order": 8
            }
        ]
        
        # Insert items
        for item_data in rate_items:
            db_item = RateCardItem(**item_data)
            db.add(db_item)
        
        db.commit()
        print(f"Successfully seeded {len(rate_items)} rate card items.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Seeding rate card data...")
    seed_rate_card_items()
    print("Done!")
