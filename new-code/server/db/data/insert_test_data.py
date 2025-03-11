import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def insert_test_data():
    # Use PostgreSQL connection instead of SQLite
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            DELETE FROM logbook_entries WHERE user_id = 1;
            DELETE FROM user_aircraft WHERE user_id = 1;
            DELETE FROM users WHERE id = 1;
                       

            INSERT INTO users (username, password)
            VALUES ('pilot', 'hashedpassword');

                       """)
        
        conn.commit()

        cursor.execute("""
                       
            INSERT INTO user_aircraft (
                user_id, aircraft_reg, aircraft_designator, aircraft_manufacturer, aircraft_model, 
                aircraft_wtc, aircraft_category, aircraft_class
            ) VALUES
            (1, 'VH-TAE', 'P28A', 'PIPER', 'PA-28-161 Warrior 3', 'L', 'A', 'S');
            
                       
            INSERT INTO logbook_entries (
                user_id, flight_date, aircraft_reg, pilot_in_command, other_crew, 
                route_data, details, engine_type, icus_day, icus_night, dual_day, dual_night, 
                command_day, command_night, co_pilot_day, co_pilot_night, instrument_flight, instrument_sim
            ) VALUES
            (1, '2021-03-03', 'VH-TAE', 'E.TSIATSIKAS', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'EOC', 'Single-Engine', 0, 0, 5.9, 0, 0, 0, 0, 0, 0, 0),
            (1, '2021-03-07', 'VH-TAE', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'S+L', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2021-03-14', 'VH-TAE', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'C+D', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0);
        """)
        
        conn.commit()

    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    insert_test_data()
