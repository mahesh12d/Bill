"""Seed initial leisure items data into the database."""
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import LeisureItem


def seed_leisure_items():
    """Seed initial leisure items."""
    db: Session = SessionLocal()
    
    try:
        # Check if data already exists
        existing_count = db.query(LeisureItem).count()
        if existing_count > 0:
            print(f"Leisure items already exist. Skipping seed.")
            return
        
        # Initial leisure items data
        leisure_items = [
            {
                "sr_no": 1,
                "description": "Standard Lighting/Fan Point Fitting & Wiring (Tube Light, Fan, Light Point)",
                "labor_work": "₹250",
                "material_specs": "Vinay Adora Switches, Polycab/Patel Wires/Cables",
                "rate_with_material": "₹750"
            },
            {
                "sr_no": 2,
                "description": "Computer/Power Board Wiring Point (1 Point)",
                "labor_work": "₹200",
                "material_specs": "Vinay Adora Switches, Polycab/Patel Wires/Cables",
                "rate_with_material": "₹600"
            },
            {
                "sr_no": 3,
                "description": "A.C. (Air Conditioner) Power Point",
                "labor_work": "₹300",
                "material_specs": "Heavy Duty Wire/Socket, MCB",
                "rate_with_material": "₹900"
            },
            {
                "sr_no": 4,
                "description": "Ceiling Fan Fitting (Labor Only)",
                "labor_work": "₹150",
                "material_specs": "-",
                "rate_with_material": "-"
            },
            {
                "sr_no": 5,
                "description": "Ceiling Fan Fitting with Dimmer (Supply & Install)",
                "labor_work": "-",
                "material_specs": "Supply of Standard Dimmer/Regulator",
                "rate_with_material": "₹500"
            },
            {
                "sr_no": 6,
                "description": "Fan Down Hook/J-Hook Fitting (Supply & Install)",
                "labor_work": "-",
                "material_specs": "Supply of Standard J-Hook/Down Rod Set",
                "rate_with_material": "₹250"
            },
            {
                "sr_no": 7,
                "description": "Dome/LED Light Fitting (Labor Only)",
                "labor_work": "₹100",
                "material_specs": "-",
                "rate_with_material": "-"
            },
            {
                "sr_no": 8,
                "description": "Distribution Board (DB) Point/Wiring",
                "labor_work": "Quoted Separately",
                "material_specs": "Based on Circuit Load & Size",
                "rate_with_material": "Quoted Separately"
            }
        ]
        
        # Insert items
        for item_data in leisure_items:
            db_item = LeisureItem(**item_data)
            db.add(db_item)
        
        db.commit()
        print(f"Successfully seeded {len(leisure_items)} leisure items.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Seeding leisure items data...")
    seed_leisure_items()
    print("Done!")
