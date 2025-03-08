INSERT INTO users (username, password) VALUES ('pilot1', 'hashedpassword');


INSERT INTO logbook_entries (
    user_id, flight_date, aircraft_type, aircraft_reg, pilot_in_command, other_crew, 
    route, details, engine_type, icus_day, icus_night, dual_day, dual_night, 
    command_day, command_night, co_pilot_day, co_pilot_night, instrument_flight, instrument_sim
) VALUES
(1, '2021-03-03', '543', 'VH-TAE', 'E.TSIATSIKAS', 'SELF', 'YMMB-YMMB', 'EOC', 'Single-Engine', 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0),
(1, '2021-03-07', '543', 'VH-TAJ', 'E.LINCOLN-PRICE', 'SELF', 'YMMB-YMMB', 'S+L', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2021-03-14', '543', 'VH-TXU', 'E.LINCOLN-PRICE', 'SELF', 'YMMB-YMMB', 'C+D', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2022-03-16', '543', 'VH-TAU', 'E.LINCOLN-PRICE', 'SELF', 'YMMB-YMMB', 'MLT', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2022-03-28', '543', 'VH-TAE', 'E.LINCOLN-PRICE', 'SELF', 'YMMB-YMMB', 'CDT', 'Single-Engine', 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0),
(1, '2022-03-30', '543', 'VH-TAJ', 'E.LINCOLN-PRICE', 'SELF', 'YMMB-YMMB', 'STALLS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2023-05-22', '543', 'VH-TXU', 'K.HUTCHINSON', NULL, 'YMMB-YMMB', 'FIRST SOLO CCTS', 'Single-Engine', 0, 0, 0, 0, 1.0, 0, 0.5, 0, 0, 0),
(1, '2023-06-14', '543', 'VH-TXU', 'SELF', NULL, 'YMMB-YMMB', '2ND SOLO CCTS', 'Single-Engine', 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 0),
(1, '2023-06-19', '543', 'VH-TYD', 'SELF', NULL, 'YMMB-YMMB', 'DEP+APR', 'Single-Engine', 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0),
(1, '2023-06-22', '543', 'VH-TAE', 'SELF', NULL, 'YMMB-YMMB', 'NAV EXERCISE', 'Single-Engine', 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 0),
(1, '2023-07-01', '543', 'VH-TXU', 'SELF', NULL, 'YMMB-YMMB', 'SOLO CCTS', 'Single-Engine', 0, 0, 0, 0, 0.7, 0, 0, 0, 0, 0),
(1, '2023-07-15', '543', 'VH-TYD', 'SELF', NULL, 'YMMB-YMMB', 'FORCED LANDING PRACTICE', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2023-07-20', '543', 'VH-TXU', 'SELF', NULL, 'YMMB-YMMB', 'INSTRUMENT APP', 'Single-Engine', 0, 0, 0.8, 0, 0, 0, 0, 0, 0.5, 0),
(1, '2023-07-28', '543', 'VH-TYD', 'SELF', NULL, 'YMMB-YMMB', 'GENERAL HANDLING', 'Single-Engine', 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0),
(1, '2024-08-05', '543', 'VH-TAE', 'SELF', NULL, 'YMMB-YMMB', 'SOLO CCTS', 'Single-Engine', 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0),
(1, '2024-08-10', '5', 'VH-TAJ', 'SELF', NULL, 'YMMB-YMMB', 'CCTS WITH CROSSWIND', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0),
(1, '2024-08-17', '5', 'VH-TXU', 'SELF', NULL, 'YMMB-YMMB', 'DEPARTURE AND ARRIVAL', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2024-08-25', '5', 'VH-TYD', 'SELF', NULL, 'YMMB-YMMB', 'STEEP TURNS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2024-09-02', '5', 'VH-TAE', 'SELF', NULL, 'YMMB-YMMB', 'GLIDE APPROACH', 'Single-Engine', 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0),
(1, '2024-09-10', '5', 'VH-TAJ', 'SELF', NULL, 'YMMB-YMMB', 'FORCED LANDING', 'Single-Engine', 0, 0, 1.3, 0, 0, 0, 0, 0, 0, 0),
(1, '2024-09-18', '5', 'VH-TXU', 'SELF', NULL, 'YMMB-YMMB', 'PFL', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2025-01-25', '5', 'VH-TYD', 'SELF', NULL, 'YMMB-YMMB', 'CCTS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2025-01-01', '5', 'VH-TAE', 'SELF', NULL, 'YMMB-YMMB', 'STALL PRACTICE', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2025-01-07', '5', 'VH-TAJ', 'SELF', NULL, 'YMMB-YMMB', 'NAVIGATION EXERCISE', 'Single-Engine', 0, 0, 1.5, 0, 0, 0, 0, 0, 0, 0),
(1, '2025-01-15', '509', 'VH-TXU', 'SELF', NULL, 'YMMB-YMMB', 'IFR TRAINING', 'Single-Engine', 0, 0, 0.5, 0, 0, 0, 0, 0, 1.0, 0),
(1, '2025-01-20', '5', 'VH-TYD', 'SELF', NULL, 'YMMB-YMMB', 'PRACTICE FLIGHT', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2025-01-30', '5', 'VH-TAE', 'SELF', NULL, 'YMMB-YMMB', 'XWIND LANDINGS', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2025-02-05', '5', 'VH-TAJ', 'SELF', NULL, 'YMMB-YMMB', 'INSTRUMENT PRACTICE', 'Single-Engine', 0, 0, 0.7, 0, 0, 0, 0, 0, 0.5, 0),
(1, '2025-02-12', '577', 'VH-TXU', 'SELF', NULL, 'YMMB-YMMB', 'ADVANCED HANDLING', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0),
(1, '2025-03-02', '5', 'VH-TYD', 'SELF', NULL, 'YMMB-YMMB', 'ENGINE FAILURE DRILL', 'Single-Engine', 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0),
(1, '2025-03-02', '5', 'VH-TAE', 'SELF', NULL, 'YMMB-YMMB', 'PILOT PROFICIENCY', 'Single-Engine', 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0); 