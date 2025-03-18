import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

/**
 * Custom hook for caching logbook entries to improve performance
 * @param {number} userId - The user ID for fetching logbook entries
 * @param {number} cacheExpirationMinutes - How long to consider the cache valid (default: 30 minutes)
 * @returns {Object} - Contains entries, processedEntries, loading, and airportData
 */
const useLogbookCache = (userId = 1, cacheExpirationMinutes = 30) => {
  const [entries, setEntries] = useState([]);
  const [processedEntries, setProcessedEntries] = useState([]);
  const [airportData, setAirportData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Function to check if cache is expired
  const isCacheExpired = useCallback((timestamp) => {
    if (!timestamp) return true;
    
    const now = new Date().getTime();
    const cacheTime = parseInt(timestamp, 10);
    const expirationTime = cacheExpirationMinutes * 60 * 1000; // Convert minutes to milliseconds
    
    return (now - cacheTime) > expirationTime;
  }, [cacheExpirationMinutes]);
  
  // Function to get cached data
  const getCachedData = useCallback(() => {
    try {
      const cachedEntries = localStorage.getItem(`logbook_entries_${userId}`);
      const cachedProcessedEntries = localStorage.getItem(`processed_entries_${userId}`);
      const cachedAirportData = localStorage.getItem(`airport_data_${userId}`);
      const cacheTimestamp = localStorage.getItem(`logbook_cache_timestamp_${userId}`);
      
      if (cachedEntries && cachedProcessedEntries && !isCacheExpired(cacheTimestamp)) {
        return {
          entries: JSON.parse(cachedEntries),
          processedEntries: JSON.parse(cachedProcessedEntries),
          airportData: cachedAirportData ? JSON.parse(cachedAirportData) : {},
          isCacheValid: true
        };
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
      // Clear potentially corrupted cache
      localStorage.removeItem(`logbook_entries_${userId}`);
      localStorage.removeItem(`processed_entries_${userId}`);
      localStorage.removeItem(`airport_data_${userId}`);
      localStorage.removeItem(`logbook_cache_timestamp_${userId}`);
    }
    
    return { isCacheValid: false };
  }, [userId, isCacheExpired]);
  
  // Function to set cache data
  const setCacheData = useCallback((entries, processedEntries, airportData) => {
    try {
      localStorage.setItem(`logbook_entries_${userId}`, JSON.stringify(entries));
      localStorage.setItem(`processed_entries_${userId}`, JSON.stringify(processedEntries));
      localStorage.setItem(`airport_data_${userId}`, JSON.stringify(airportData));
      localStorage.setItem(`logbook_cache_timestamp_${userId}`, new Date().getTime().toString());
    } catch (error) {
      console.error('Error writing to cache:', error);
      // If storage is full, clear it and try again
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        localStorage.clear();
        try {
          localStorage.setItem(`logbook_entries_${userId}`, JSON.stringify(entries));
          localStorage.setItem(`processed_entries_${userId}`, JSON.stringify(processedEntries));
          localStorage.setItem(`airport_data_${userId}`, JSON.stringify(airportData));
          localStorage.setItem(`logbook_cache_timestamp_${userId}`, new Date().getTime().toString());
        } catch (innerError) {
          console.error('Failed to write to cache even after clearing:', innerError);
        }
      }
    }
  }, [userId]);
  
  // Fetch airport data for the given IDs
  const fetchAirportData = useCallback(async (airportIds) => {
    try {
      const response = await axios.post(`${config.apiUrl}/api/airports/batch`, { ids: airportIds });
      return response.data;
    } catch (error) {
      console.error('Error fetching airport data:', error);
      return {};
    }
  }, []);
  
  // Process the raw logbook data
  const processLogbookData = useCallback((data, airports) => {
    return data.map(entry => {
      // Create a new object to avoid mutating the original
      const processedEntry = { ...entry };

      // 1. Format aircraft name: aircraft_model, aircraft_manufacturer.toUpper()
      if (processedEntry.aircraft_manufacturer) {
        processedEntry.aircraft_name = `${processedEntry.aircraft_model}, ${processedEntry.aircraft_manufacturer.toUpperCase()}`;
      } else {
        processedEntry.aircraft_name = processedEntry.aircraft_model;
      }

      // 2. Process route data to show ICAO codes or names separated by '-'
      if (processedEntry.route_data && Array.isArray(processedEntry.route_data)) {
        processedEntry.formatted_route = processedEntry.route_data.map(stop => {
          if (stop.is_custom) {
            return stop.custom_name;
          }
          
          // Use the airport data from our fetched map
          const airport = airports[stop.airport_id];
          if (airport) {
            // Use ICAO if available, otherwise use name
            return airport.icao || airport.airport_name || airport.iata || '';
          }
          
          return '';
        }).filter(Boolean).join('-');
      } else {
        processedEntry.formatted_route = '';
      }

      // 3. Allocate hours based on engine type
      // Initialize all engine-specific fields to 0
      processedEntry.single_engine_icus_day = 0;
      processedEntry.single_engine_icus_night = 0;
      processedEntry.single_engine_dual_day = 0;
      processedEntry.single_engine_dual_night = 0;
      processedEntry.single_engine_command_day = 0;
      processedEntry.single_engine_command_night = 0;
      
      processedEntry.multi_engine_icus_day = 0;
      processedEntry.multi_engine_icus_night = 0;
      processedEntry.multi_engine_dual_day = 0;
      processedEntry.multi_engine_dual_night = 0;
      processedEntry.multi_engine_command_day = 0;
      processedEntry.multi_engine_command_night = 0;

      // Determine if aircraft is single or multi-engine based on aircraft_class
      const isMultiEngine = processedEntry.aircraft_class === 'M';
      const isSingleEngine = processedEntry.aircraft_class === 'S';

      // Helper function to convert string hours to numbers
      const parseHours = (value) => {
        if (value === null || value === undefined) return 0;
        // Convert string to number, handle both "1.0" and 1.0 formats
        return typeof value === 'string' ? parseFloat(value) || 0 : value || 0;
      };

      // Allocate hours based on determined engine type
      if (isMultiEngine) {
        // Multi engine
        processedEntry.multi_engine_icus_day = parseHours(processedEntry.icus_day);
        processedEntry.multi_engine_icus_night = parseHours(processedEntry.icus_night);
        processedEntry.multi_engine_dual_day = parseHours(processedEntry.dual_day);
        processedEntry.multi_engine_dual_night = parseHours(processedEntry.dual_night);
        processedEntry.multi_engine_command_day = parseHours(processedEntry.command_day);
        processedEntry.multi_engine_command_night = parseHours(processedEntry.command_night);
      } else {
        // Single engine (default if not explicitly multi-engine)
        processedEntry.single_engine_icus_day = parseHours(processedEntry.icus_day);
        processedEntry.single_engine_icus_night = parseHours(processedEntry.icus_night);
        processedEntry.single_engine_dual_day = parseHours(processedEntry.dual_day);
        processedEntry.single_engine_dual_night = parseHours(processedEntry.dual_night);
        processedEntry.single_engine_command_day = parseHours(processedEntry.command_day);
        processedEntry.single_engine_command_night = parseHours(processedEntry.command_night);
      }

      return processedEntry;
    });
  }, []);
  
  // Fetch fresh data or use cache
  const fetchData = useCallback(async (skipCache = false) => {
    setLoading(true);
    
    // Try to get data from cache first
    if (!skipCache) {
      const cachedData = getCachedData();
      if (cachedData.isCacheValid) {
        console.log('Using cached logbook data');
        setEntries(cachedData.entries);
        setProcessedEntries(cachedData.processedEntries);
        setAirportData(cachedData.airportData);
        setLoading(false);
        
        // Still fetch fresh data in the background for next time
        setTimeout(() => fetchData(true), 100);
        return;
      }
    }
    
    try {
      console.log(skipCache ? 'Fetching fresh logbook data' : 'No valid cache, fetching fresh data');
      
      // Fetch logbook entries
      const response = await axios.get(`${config.apiUrl}/api/logbook/${userId}`);
      
      // Extract all unique airport IDs from route data
      const airportIds = new Set();
      response.data.forEach(entry => {
        if (entry.route_data && Array.isArray(entry.route_data)) {
          entry.route_data.forEach(stop => {
            if (stop.airport_id) {
              airportIds.add(stop.airport_id);
            }
          });
        }
      });
      
      // Fetch airport data if we have any airport IDs
      let airports = {};
      if (airportIds.size > 0) {
        airports = await fetchAirportData(Array.from(airportIds));
      }
      
      // Process the data with the fetched airport information
      const processed = processLogbookData(response.data, airports);
      
      // Update state with fresh data
      setEntries(response.data);
      setProcessedEntries(processed);
      setAirportData(airports);
      
      // Cache the fresh data for next time
      setCacheData(response.data, processed, airports);
      
    } catch (error) {
      console.error('Error fetching logbook data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, getCachedData, fetchAirportData, processLogbookData, setCacheData]);
  
  // Fetch data when the component mounts or userId changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Function to invalidate cache and fetch fresh data
  const refreshData = useCallback(() => {
    fetchData(true);
  }, [fetchData]);
  
  return {
    entries,
    processedEntries,
    airportData,
    loading,
    refreshData
  };
};

export default useLogbookCache; 