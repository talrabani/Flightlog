INSERT INTO users (username, password) VALUES ('pilot1', 'hashedpassword');


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
(1, '2021-03-03', 'VH-TAE', 'E.TSIATSIKAS', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'EOC', 0, 0, 5.9, 0, 0, 0, 0, 0, 0, 0),
(1, '2021-03-07', 'VH-TAE', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'S+L', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2021-03-14', 'VH-TAE', 'E.LINCOLN-PRICE', 'SELF', '[{"type": "departure", "airport_id": 675, "is_custom": false, "custom_name": null}, {"type": "arrival", "airport_id": 675, "is_custom": false, "custom_name": null}]', 'C+D', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0);