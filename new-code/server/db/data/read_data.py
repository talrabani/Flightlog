# Read aircraft types from ICAO DOC8643 PDF
# Link: https://cfapps.icao.int/doc8643/
import pdfplumber
import pandas as pd
import re
import os
from typing import List, Dict

# Get the current directory (where the script is located)
current_dir = os.path.dirname(os.path.abspath(__file__))
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

def parse_aircraft_line(line: str) -> Dict:
    """Parse a single line of aircraft data using regex."""
    # Format: MODEL, MANUFACTURER DESIGNATOR WTC
    # Example: "269B, SCHWEIZER H269 L"
    # Example with spaces: "A-24 Viking, AEROPRAKT AP24 L"
    
    try:
        # Split the line into segments by whitespace
        segments = line.strip().split()
        
        # Last element should be the WTC
        wtc = segments[-1]
        if wtc not in ['H', 'M', 'J', 'L']:
            print(f"Invalid WTC in line: {line}")
            return None
            
        # Second last element should be the designator (2-4 alphanumeric chars)
        designator = segments[-2]
        if not re.match(r'^[A-Z0-9]{2,4}$', designator):
            print(f"Invalid designator in line: {line}")
            return None
            
        # Find the comma that separates model from manufacturer
        comma_index = line.find(',')
        if comma_index == -1:
            print(f"No comma found in line: {line}")
            return None
            
        # Split into model and the rest
        model = line[:comma_index].strip()
        rest = line[comma_index + 1:].strip()
        
        # Remove the designator and WTC from the end to get manufacturer
        manufacturer = rest[:-(len(designator) + len(wtc) + 2)].strip()
        
        # Validate all parts exist
        if not all([model, manufacturer, designator, wtc]):
            print(f"Missing required fields in line: {line}")
            return None
            
        return {
            'model': model,
            'manufacturer': manufacturer,
            'designator': designator,
            'wtc': wtc
        }
        
    except Exception as e:
        print(f"Error parsing line: {line}")
        print(f"Error: {str(e)}")
        return None


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
                        print(f"Segments: {segments}")
                        # Find index of first WTC, 'L', 'M', 'J', 'H', 'L/M', 'L/J', 'L/H', 'M/J', 'M/H', 'J/H', 'L/M/J', 'L/M/H', 'L/J/H', 'M/J/H', 'L/M/J/H'
                        wtc_index = segments.index(next(filter(lambda x: x in ['L', 'M', 'J', 'H', 'L/M', 'L/J', 'L/H', 'M/J', 'M/H', 'J/H', 'L/M/J', 'L/M/H', 'L/J/H', 'M/J/H', 'L/M/J/H'], segments)))
                        print(f"WTC index: {wtc_index}")

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
                        # Aircraft 1 manufacturer is the elements after the comma
                        aircraft1_manufacturer = ' '.join(aircraft1_segments[comma_index1 + 1:])

                        comma_index2 = next((i for i, s in enumerate(aircraft2_segments) if ',' in s), None)
                        aircraft2_model = ' '.join(aircraft2_segments[:comma_index2 + 1])
                        aircraft2_manufacturer = ' '.join(aircraft2_segments[comma_index2 + 1:])

                        # Append entries to aircraft_data
                        aircraft_data.append({
                            'model': aircraft1_model,
                            'manufacturer': aircraft1_manufacturer,
                            'designator': aircraft2_designator,
                            'wtc': aircraft1_wtc
                        })

                        aircraft_data.append({
                            'model': aircraft2_model,
                            'manufacturer': aircraft2_manufacturer,
                            'designator': aircraft2_designator,
                            'wtc': aircraft2_wtc
                        })

                    else: # Single line entry
                        raise Exception(f"Single line entry: {line}")

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

# Generate SQL insert statements
print(f"\nWriting SQL file to: {output_file}")
with open(output_file, 'w', encoding='utf-8', errors='ignore') as f:
    # Write BOM for UTF-8
    f.write('\ufeff')
    f.write('-- Aircraft types from ICAO DOC8643\n\n')
    
    # First, clear existing data
    f.write('DELETE FROM aircraft_types;\n\n')
    
    # Write insert statements
    count = 0
    for aircraft in aircraft_data:
        try:
            designator = clean_for_sql(aircraft['designator'])
            model = clean_for_sql(aircraft['model'])
            manufacturer = clean_for_sql(aircraft['manufacturer'])
            wtc = clean_for_sql(aircraft['wtc'])
            
            if manufacturer != 'NULL':  # Only require manufacturer as mandatory field
                sql = (
                    f"INSERT INTO aircraft_types (designator, model, manufacturer, wtc) VALUES "
                    f"({designator}, {model}, {manufacturer}, {wtc});\n"
                )
                f.write(sql)
                count += 1
        except KeyError as e:
            print(f"Warning: Missing field {e}")
            print("Aircraft data:", aircraft)
            continue

print(f"\nSQL file generated successfully! Added {count} aircraft types.")


