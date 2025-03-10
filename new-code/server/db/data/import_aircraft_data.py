#!/usr/bin/env python3
import pdfplumber
import pandas as pd
import re
import psycopg2
from dotenv import load_dotenv
import os
from typing import List, Dict

# Load environment variables
load_dotenv()

# Database connection parameters
db_url = os.getenv('DATABASE_URL')

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def main():
    conn = None
    try:
        # Connect to database
        conn = psycopg2.connect(db_url)

        # Get the current directory (where the script is located)
        current_dir = SCRIPT_DIR
        pdf_file = os.path.join(current_dir, 'DOC8643 ICAO Aircraft Type.pdf')
        output_file = os.path.join(current_dir, '..', 'insert_aircraft_types.sql')

        aircraft_entries = []

        def ensure_utf8(text: str) -> str:
            """Ensure text is properly UTF-8 encoded."""
            if isinstance(text, bytes):
                return text.decode('utf-8', errors='ignore')
            elif isinstance(text, str):
                # Encode and decode to clean up any problematic characters
                return text.encode('utf-8', errors='ignore').decode('utf-8')
            return str(text)

        def split_columns(text: str) -> List[str]:
            """Split the text into left and right columns."""
            lines = text.split('\n')
            aircraft_entries = []
            
            for line in lines:
                # Skip header lines
                if ('MODEL, MANUFACTURER' in line or 
                    'MODÈLE, CONSTRUCTEUR' in line or 
                    'PART 3 — AIRCRAFT TYPES BY' in line or
                    not line.strip()):
                    continue
                    
                # Split line by large gaps (3 or more spaces)
                entries = re.split(r'\s{3,}', line.strip())
                
                # Add each non-empty entry
                for entry in entries:
                    if entry.strip():
                        aircraft_entries.append(entry.strip())
            
            return aircraft_entries

        def extract_aircraft_from_pdf(pdf_path: str) -> List[Dict]:
            """Extract aircraft data from DOC8643 ICAO Aircraft Type PDF."""
            aircraft_data = []
            
            print(f"Reading PDF file from: {pdf_file}")
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    print(f"Processing page {page.page_number}")
                    
                    # Extract text from page and ensure UTF-8
                    text = ensure_utf8(page.extract_text())
                    if not text:
                        continue
                    
                    # Split into columns and get individual lines
                    lines = split_columns(text)
                    
                    # Process each line
                    for line in lines:
                        
                        try:
                            # Clean and encode the line
                            line = ensure_utf8(line.strip())

                            # Check if line contains multiple entries
                            if line.count(',') > 1:
                                # Handle multiple entries eg. "610 Evolution, BRUMBY BR61 L 728JET, FAIRCHILD DORNIER J728 M"
                                # split by ' '
                                segments = line.split(' ')
                                # Find index of first WTC, 'L', 'M', 'J', 'H', 'L/M', 'L/J', 'L/H', 'M/J', 'M/H', 'J/H', 'L/M/J', 'L/M/H', 'L/J/H', 'M/J/H', 'L/M/J/H'
                                wtc_index = segments.index(next(filter(lambda x: x in ['L', 'M', 'J', 'H', 'L/M', 'L/J', 'L/H', 'M/J', 'M/H', 'J/H', 'L/M/J', 'L/M/H', 'L/J/H', 'M/J/H', 'L/M/J/H'], segments)))

                                aircraft1_segments = segments[:wtc_index + 1]
                                aircraft2_segments = segments[wtc_index + 1:]

                                # Pop off WTC from end of segments
                                aircraft1_wtc = aircraft1_segments.pop()
                                aircraft2_wtc = aircraft2_segments.pop()

                                # Pop off designator from end of segments
                                aircraft1_designator = aircraft1_segments.pop()
                                aircraft2_designator = aircraft2_segments.pop()

                                # Find element in aircraft1_segments that contains a comma
                                comma_index1 = next((i for i, s in enumerate(aircraft1_segments) if ',' in s), None)
                                # Aircraft 1 model is the elements before and including the comma
                                aircraft1_model = ' '.join(aircraft1_segments[:comma_index1 + 1])
                                # Remove trailing comma
                                aircraft1_model = aircraft1_model.rstrip(',')
                                # Aircraft 1 manufacturer is the elements after the comma
                                aircraft1_manufacturer = ' '.join(aircraft1_segments[comma_index1 + 1:])

                                comma_index2 = next((i for i, s in enumerate(aircraft2_segments) if ',' in s), None)
                                aircraft2_model = ' '.join(aircraft2_segments[:comma_index2 + 1])
                                aircraft2_model = aircraft2_model.rstrip(',')
                                aircraft2_manufacturer = ' '.join(aircraft2_segments[comma_index2 + 1:])

                                # Append entries to aircraft_data
                                aircraft_data.append({
                                    'model': aircraft1_model,
                                    'manufacturer': aircraft1_manufacturer,
                                    'designator': aircraft1_designator,
                                    'wtc': aircraft1_wtc
                                })

                                aircraft_data.append({
                                    'model': aircraft2_model,
                                    'manufacturer': aircraft2_manufacturer,
                                    'designator': aircraft2_designator,
                                    'wtc': aircraft2_wtc
                                })

                            else: # Single line entry
                                # split by ' '
                                segments = line.split(' ')

                                aircraft1_wtc = segments.pop()
                                aircraft1_designator = segments.pop()
                                
                                 # Find element in aircraft1_segments that contains a comma
                                comma_index1 = next((i for i, s in enumerate(aircraft1_segments) if ',' in s), None)
                                # Aircraft 1 model is the elements before and including the comma
                                aircraft1_model = ' '.join(aircraft1_segments[:comma_index1 + 1])
                                # Remove trailing comma
                                aircraft1_model = aircraft1_model.rstrip(',')
                                # Aircraft 1 manufacturer is the elements after the comma
                                aircraft1_manufacturer = ' '.join(aircraft1_segments[comma_index1 + 1:])

                                # Append entries to aircraft_data
                                aircraft_data.append({
                                    'model': aircraft1_model,
                                    'manufacturer': aircraft1_manufacturer,
                                    'designator': aircraft1_designator,
                                    'wtc': aircraft1_wtc
                                })

                        except Exception as e:
                            print(f"Error processing line: {ensure_utf8(line)}")
                            print(f"Error: {str(e)}")
                            continue
            
            return aircraft_data

        # Function to clean and format strings for SQL
        def clean_for_sql(s):
            if pd.isna(s) or not s:
                return 'NULL'
            # Ensure string is UTF-8 encoded and properly escaped for SQL
            s = ensure_utf8(str(s).strip())
            return "'" + s.replace("'", "''") + "'"

        # Extract data from PDF
        aircraft_data = extract_aircraft_from_pdf(pdf_file)

        # Insert aircraft data into database
        def import_aircraft_types(conn, aircraft_data):
            with conn.cursor() as cur:
                # First, clear existing data with CASCADE
                cur.execute("TRUNCATE TABLE aircraft_types CASCADE;")
                
                count = 0
                for aircraft in aircraft_data:
                    try:
                        if aircraft['manufacturer']:  # Only insert if manufacturer exists
                            cur.execute("""
                                INSERT INTO aircraft_types 
                                (designator, model, manufacturer, wtc)
                                VALUES (%s, %s, %s, %s)
                            """, (
                                aircraft['designator'] if aircraft['designator'] else None,
                                aircraft['model'] if aircraft['model'] else None,
                                aircraft['manufacturer'],
                                aircraft['wtc'] if aircraft['wtc'] else None
                            ))
                            count += 1
                    except KeyError as e:
                        print(f"Warning: Missing field {e}")
                        print("Aircraft data:", aircraft)
                        continue
                
                conn.commit()
                print(f"\nSuccessfully imported {count} aircraft types into database.")

        import_aircraft_types(conn, aircraft_data)
        
        print("Aircraft data imported successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
