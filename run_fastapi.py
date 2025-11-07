"""Run the FastAPI application with uvicorn."""
import os
import uvicorn
from backend.database import Base, engine
from backend.seed_data import seed_leisure_items

if __name__ == "__main__":
    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Seed initial data
    print("Seeding initial data...")
    try:
        seed_leisure_items()
    except Exception as e:
        print(f"Note: {e}")
    
    # Start server
    print("Starting FastAPI server on 0.0.0.0:8000...")
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
