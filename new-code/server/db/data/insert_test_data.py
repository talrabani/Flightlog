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
            DELETE FROM users WHERE id = 1;

            INSERT INTO users (username, password)
            VALUES ('pilot1', 'hashedpassword');
                       
            INSERT INTO logbook_entries (
                user_id, flight_date, aircraft_type, aircraft_reg, pilot_in_command, other_crew, 
                route_data, details, engine_type, icus_day, icus_night, dual_day, dual_night, 
                command_day, command_night, co_pilot_day, co_pilot_night, instrument_flight, instrument_sim
            ) VALUES
            (1, '2021-03-03', '543', 'VH-TAE', 'E.TSIATSIKAS', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'EOC', 'Single-Engine', 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0),
            (1, '2021-03-07', '543', 'VH-TAJ', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'S+L', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2021-03-14', '543', 'VH-TXU', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'C+D', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2022-03-16', '543', 'VH-TAU', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'MLT', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2022-03-28', '543', 'VH-TAE', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'CDT', 'Single-Engine', 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0),
            (1, '2022-03-30', '543', 'VH-TAJ', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'STALLS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2023-05-22', '543', 'VH-TXU', 'K.HUTCHINSON', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'FIRST SOLO CCTS', 'Single-Engine', 0, 0, 0, 0, 1.0, 0, 0.5, 0, 0, 0),
            (1, '2023-06-14', '543', 'VH-TXU', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', '2ND SOLO CCTS', 'Single-Engine', 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 0),
            (1, '2023-06-19', '543', 'VH-TYD', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'DEP+APR', 'Single-Engine', 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0),
            (1, '2023-06-22', '543', 'VH-TAE', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'NAV EXERCISE', 'Single-Engine', 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 0),
            (1, '2023-07-01', '543', 'VH-TXU', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'SOLO CCTS', 'Single-Engine', 0, 0, 0, 0, 0.7, 0, 0, 0, 0, 0),
            (1, '2023-07-15', '543', 'VH-TYD', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'FORCED LANDING PRACTICE', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2023-07-20', '543', 'VH-TXU', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'INSTRUMENT APP', 'Single-Engine', 0, 0, 0.8, 0, 0, 0, 0, 0, 0.5, 0),
            (1, '2023-07-28', '543', 'VH-TYD', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'GENERAL HANDLING', 'Single-Engine', 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0),
            (1, '2024-08-05', '543', 'VH-TAE', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'SOLO CCTS', 'Single-Engine', 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0),
            (1, '2024-08-10', '5', 'VH-TAJ', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'CCTS WITH CROSSWIND', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0),
            (1, '2024-08-17', '5', 'VH-TXU', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'DEPARTURE AND ARRIVAL', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2024-08-25', '5', 'VH-TYD', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'STEEP TURNS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2024-09-02', '5', 'VH-TAE', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'GLIDE APPROACH', 'Single-Engine', 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0),
            (1, '2024-09-10', '5', 'VH-TAJ', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'FORCED LANDING', 'Single-Engine', 0, 0, 1.3, 0, 0, 0, 0, 0, 0, 0),
            (1, '2024-09-18', '5', 'VH-TXU', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'PFL', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-01-25', '5', 'VH-TYD', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'CCTS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-01-01', '5', 'VH-TAE', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'STALL PRACTICE', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-01-07', '5', 'VH-TAJ', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'NAVIGATION EXERCISE', 'Single-Engine', 0, 0, 1.5, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-01-15', '509', 'VH-TXU', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'IFR TRAINING', 'Single-Engine', 0, 0, 0.5, 0, 0, 0, 0, 0, 1.0, 0),
            (1, '2025-01-20', '5', 'VH-TYD', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'PRACTICE FLIGHT', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-01-30', '5', 'VH-TAE', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'XWIND LANDINGS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-02-05', '5', 'VH-TAJ', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'INSTRUMENT PRACTICE', 'Single-Engine', 0, 0, 0.7, 0, 0, 0, 0, 0, 0.5, 0),
            (1, '2025-02-12', '577', 'VH-TXU', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'ADVANCED HANDLING', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-03-02', '5', 'VH-TYD', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'ENGINE FAILURE DRILL', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-03-02', '5', 'VH-TAE', 'SELF', NULL, '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'PILOT PROFICIENCY', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0); 
        """)
        
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    insert_test_data()
