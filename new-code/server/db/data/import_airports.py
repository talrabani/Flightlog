import csv
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Database connection parameters
db_url = os.getenv('DATABASE_URL')

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_FILE = os.path.join(SCRIPT_DIR, 'iata-icao.csv')

def create_airports_table(conn):
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS airports (
                id SERIAL PRIMARY KEY,
                iata VARCHAR(3),
                icao VARCHAR(4) UNIQUE,
                airport_name VARCHAR(255) NOT NULL,
                country_code VARCHAR(2),
                region_name VARCHAR(255),
                latitude DECIMAL(10, 7),
                longitude DECIMAL(10, 7),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_airports_icao ON airports(icao);
            CREATE INDEX IF NOT EXISTS idx_airports_iata ON airports(iata);
        """)
        conn.commit()

def import_airports(conn):
    with conn.cursor() as cur:
        # First, clear existing data
        cur.execute("TRUNCATE TABLE airports RESTART IDENTITY;")
        
        # Read and insert data from CSV
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                # Skip rows where both IATA and ICAO are empty
                if not row['iata'] and not row['icao']:
                    continue
                
                cur.execute("""
                    INSERT INTO airports 
                    (iata, icao, airport_name, country_code, region_name, latitude, longitude)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (icao) 
                    DO UPDATE SET
                        iata = EXCLUDED.iata,
                        airport_name = EXCLUDED.airport_name,
                        country_code = EXCLUDED.country_code,
                        region_name = EXCLUDED.region_name,
                        latitude = EXCLUDED.latitude,
                        longitude = EXCLUDED.longitude
                    WHERE airports.icao IS NOT NULL;
                """, (
                    row['iata'] if row['iata'] else None,
                    row['icao'] if row['icao'] else None,
                    row['airport_name'],
                    row['country_code'],
                    row['region_name'],
                    float(row['latitude']) if row['latitude'] else None,
                    float(row['longitude']) if row['longitude'] else None
                ))
        
        conn.commit()

def main():
    try:
        # Connect to database
        conn = psycopg2.connect(db_url)

        # Create table with proper constraints
        create_airports_table(conn)
        
        # Import data
        import_airports(conn)
        
        print("Airport data imported successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main() 