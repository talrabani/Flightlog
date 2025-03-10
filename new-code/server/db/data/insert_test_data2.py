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

INSERT INTO logbook_entries (
                user_id, flight_date, aircraft_type, aircraft_reg, pilot_in_command, other_crew, 
                route_data, details, engine_type, icus_day, icus_night, dual_day, dual_night, 
                command_day, command_night, co_pilot_day, co_pilot_night, instrument_flight, instrument_sim
            ) VALUES
            (1, '2025-03-03', '5403', 'VH-TAH', 'BOB', 'SELF', '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2989, "is_custom": false, "custom_name": null}]', 'EOC', 'Single-Engine', 0, 0, 1, 0, 5, 0, 0, 0, 0, 0),
            (1, '2025-03-10', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'CIRCUITS', 'Single-Engine', 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 0),
            (1, '2025-03-15', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'STALLS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-03-20', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FORCED LANDINGS', 'Single-Engine', 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-03-25', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'NAVIGATION', 'Single-Engine', 0, 0, 1.5, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-04-01', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'INSTRUMENT PRACTICE', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0.5, 0),
            (1, '2025-04-05', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'STEEP TURNS', 'Single-Engine', 0, 0, 0.8, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-04-10', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'SLOW FLIGHT', 'Single-Engine', 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-04-15', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'EMERGENCY PROCEDURES', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-04-20', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'CROSSWIND PRACTICE', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-04-25', '5403', 'VH-NIH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'SHORT FIELD OPS', 'Single-Engine', 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-05-01', '5403', 'VH-NIH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'NIGHT CIRCUITS', 'Single-Engine', 0, 0, 0, 1.3, 0, 0, 0, 0, 0, 0),
            (1, '2025-05-05', '5403', 'VH-NIH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'INSTRUMENT APPROACHES', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0.8, 0),
            (1, '2025-05-10', '5403', 'VH-NIH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'BASIC MANEUVERS', 'Single-Engine', 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-05-15', '5403', 'VH-NIH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'PERFORMANCE MANEUVERS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-05-20', '5403', 'VH-NIH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'GROUND REFERENCE', 'Single-Engine', 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-05-25', '5403', 'VH-NIH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'EMERGENCY PROCEDURES', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-06-01', '5403', 'VH-CUM', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'NIGHT NAVIGATION', 'Single-Engine', 0, 0, 0, 1.5, 0, 0, 0, 0, 0, 0),
            (1, '2025-06-05', '5403', 'VH-CUM', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'IFR PROCEDURES', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 1.0, 0),
            (1, '2025-06-10', '5403', 'VH-CUM', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'CROSS COUNTRY', 'Single-Engine', 0, 0, 1.8, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-06-15', '5403', 'VH-CUM', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'CHECKRIDE PREP', 'Single-Engine', 0, 0, 1.4, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-06-20', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FLIGHT REVIEW', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-06-25', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'TAKEOFF PRACTICE', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-07-01', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'LANDING PRACTICE', 'Single-Engine', 0, 0, 1.5, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-07-05', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'NAVIGATION EXERCISE', 'Single-Engine', 0, 0, 1.3, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-07-10', '5403', 'VH-TAH', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FLIGHT SIMULATION', 'Single-Engine', 0, 0, 1.4, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-07-15', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'INSTRUMENT TRAINING', 'Single-Engine', 0, 0, 1.6, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-07-20', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FLIGHT CHECK', 'Single-Engine', 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-07-25', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'EMERGENCY LANDING DRILLS', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-08-01', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'CROSSWIND LANDING PRACTICE', 'Single-Engine', 0, 0, 1.3, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-08-05', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'NIGHT FLIGHT', 'Single-Engine', 0, 0, 1.4, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-08-10', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'LONG DISTANCE FLIGHT', 'Single-Engine', 0, 0, 1.5, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-08-15', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FLIGHT NAVIGATION', 'Single-Engine', 0, 0, 1.6, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-08-20', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FLIGHT PLANNING', 'Single-Engine', 0, 0, 1.7, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-08-25', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'TAKEOFF AND LANDING', 'Single-Engine', 0, 0, 1.8, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-09-01', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FLIGHT DEBRIEF', 'Single-Engine', 0, 0, 1.9, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-09-05', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FLIGHT SAFETY REVIEW', 'Single-Engine', 0, 0, 2.0, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-09-10', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FINAL FLIGHT CHECK', 'Single-Engine', 0, 0, 2.1, 0, 0, 0, 0, 0, 0, 0),
            (1, '2025-09-15', '5403', 'VH-XXZ', 'SELF', NULL, '[{"type": "departure", "airport_id": 2929, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 2929, "is_custom": false, "custom_name": null}]', 'FLIGHT EVALUATION', 'Single-Engine', 0, 0, 2.2, 0, 0, 0, 0, 0, 0, 0)


""")
        
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    insert_test_data()
