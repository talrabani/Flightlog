const formatAirport = (airportObj) => {
  if (!airportObj) return '';
  
  try {
    const airport = typeof airportObj === 'string' ? JSON.parse(airportObj) : airportObj;
    
    if (airport.icao) {
      return `${airport.icao} - ${airport.name}`;
    } else {
      return airport.name;
    }
  } catch (e) {
    return airportObj; // Fallback to original string if parsing fails
  }
};

<Typography>
  Most Common Airport: {formatAirport(stats.popular_airport)}
</Typography> 