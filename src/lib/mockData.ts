
export type SensorReading = {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  cropHealth: number;
  plotId: string;
};

export type Plot = {
  id: string;
  name: string;
  location: string;
  size: number;
  cropType: string;
  plantDate: string;
  lastReading?: SensorReading;
  status: 'healthy' | 'warning' | 'critical';
};

export type Crop = {
  id: string;
  name: string;
  scientificName: string;
  growthDuration: number;
  waterRequirement: 'low' | 'medium' | 'high';
  optimalTemperature: {
    min: number;
    max: number;
  };
  optimalHumidity: {
    min: number;
    max: number;
  };
  optimalSoilMoisture: {
    min: number;
    max: number;
  };
  description: string;
  imageUrl?: string;
};

export type Alert = {
  id: string;
  timestamp: string;
  type: 'temperature' | 'humidity' | 'soilMoisture' | 'cropHealth';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  plotId: string;
  plotName: string;
  status: 'active' | 'acknowledged' | 'resolved';
};

// Enhanced simulation config
export const simulationConfig = {
  updateInterval: 5000, // 5 seconds
  temperatureRange: { min: 15, max: 35, changeRate: 0.5 },
  humidityRange: { min: 30, max: 90, changeRate: 2 },
  soilMoistureRange: { min: 20, max: 80, changeRate: 1 },
  cropHealthRange: { min: 50, max: 100, changeRate: 0.5 },
  // Chance of generating an alert on each update (between 0 and 1)
  alertChance: 0.1,
};

// Storage for simulated data
let simulatedPlots: Plot[] = [];
let simulatedAlerts: Alert[] = [];
let simulationStarted = false;
let simulationInterval: number | null = null;

// Generate a random value that's close to the previous value but within limits
function simulateNextValue(
  currentValue: number,
  min: number,
  max: number,
  changeRate: number
): number {
  // Random change, positive or negative
  const change = (Math.random() * 2 - 1) * changeRate;
  // New value with change applied
  let newValue = currentValue + change;
  // Ensure within boundaries
  newValue = Math.max(min, Math.min(max, newValue));
  return parseFloat(newValue.toFixed(1));
}

// Generate random readings within realistic ranges
function generateReading(plotId: string, previousReading?: SensorReading): SensorReading {
  const now = new Date();
  
  // If we have a previous reading, simulate changes from it
  if (previousReading) {
    const { temperatureRange, humidityRange, soilMoistureRange, cropHealthRange } = simulationConfig;
    
    return {
      id: Math.random().toString(36).substring(7),
      timestamp: now.toISOString(),
      temperature: simulateNextValue(
        previousReading.temperature,
        temperatureRange.min,
        temperatureRange.max,
        temperatureRange.changeRate
      ),
      humidity: simulateNextValue(
        previousReading.humidity,
        humidityRange.min,
        humidityRange.max,
        humidityRange.changeRate
      ),
      soilMoisture: simulateNextValue(
        previousReading.soilMoisture,
        soilMoistureRange.min,
        soilMoistureRange.max,
        soilMoistureRange.changeRate
      ),
      cropHealth: simulateNextValue(
        previousReading.cropHealth,
        cropHealthRange.min,
        cropHealthRange.max,
        cropHealthRange.changeRate
      ),
      plotId: plotId
    };
  }
  
  // First-time reading with random values
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: now.toISOString(),
    temperature: 20 + Math.random() * 15, // 20-35 °C
    humidity: 40 + Math.random() * 50, // 40-90 %
    soilMoisture: 20 + Math.random() * 60, // 20-80 %
    cropHealth: 50 + Math.random() * 50, // 50-100 (index)
    plotId: plotId
  };
}

// Generate readings for a specific date range
export function generateHistoricalData(
  plotId: string, 
  days: number = 30
): SensorReading[] {
  const data: SensorReading[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create multiple readings per day
    for (let j = 0; j < 4; j++) {
      const hours = j * 6; // readings every 6 hours
      date.setHours(hours, 0, 0, 0);
      
      const reading = {
        id: `${plotId}-${i}-${j}`,
        timestamp: date.toISOString(),
        temperature: 20 + Math.random() * 15 + Math.sin(i/5) * 3, // Add some wave pattern
        humidity: 40 + Math.random() * 50 + Math.cos(i/7) * 5,
        soilMoisture: Math.max(20, 50 + Math.random() * 30 - (i % 5 === 0 ? 30 : 0)), // Drops every 5 days
        cropHealth: Math.min(100, 70 + Math.random() * 20 + (i < 10 ? i : 10)), // Gradually increases then plateaus
        plotId: plotId
      };
      
      data.push(reading);
    }
  }
  
  // Sort by date ascending
  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Determine status based on sensor readings
function determineStatus(reading: SensorReading): 'healthy' | 'warning' | 'critical' {
  if (reading.soilMoisture < 30 || reading.temperature > 32 || reading.cropHealth < 60) {
    return 'critical';
  } else if (reading.soilMoisture < 40 || reading.temperature > 30 || reading.humidity < 50 || reading.cropHealth < 70) {
    return 'warning';
  }
  return 'healthy';
}

// Generate plots with their latest readings
export function generatePlots(count: number = 6): Plot[] {
  // Initialize plots if not already done
  if (simulatedPlots.length === 0) {
    const cropTypes = ['Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Sugarcane'];
    const locations = ['North Field', 'South Field', 'East Field', 'West Field', 'Central Field'];
    
    simulatedPlots = Array.from({ length: count }, (_, i) => {
      const plotId = `plot-${i + 1}`;
      const lastReading = generateReading(plotId);
      
      return {
        id: plotId,
        name: `Plot ${String.fromCharCode(65 + i)}${Math.floor(Math.random() * 20) + 1}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        size: Math.floor(Math.random() * 10) + 1, // 1-10 acres
        cropType: cropTypes[Math.floor(Math.random() * cropTypes.length)],
        plantDate: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 60))).toISOString(),
        lastReading,
        status: determineStatus(lastReading)
      };
    });
  }

  return [...simulatedPlots];
}

// Update all plots with new readings
function updatePlots(): void {
  simulatedPlots = simulatedPlots.map(plot => {
    const newReading = generateReading(plot.id, plot.lastReading);
    const newStatus = determineStatus(newReading);
    
    // Check if status changed to worse, might generate an alert
    if ((plot.status === 'healthy' && newStatus !== 'healthy') || 
        (plot.status === 'warning' && newStatus === 'critical')) {
      maybeGenerateAlert(plot, newReading);
    }
    
    return {
      ...plot,
      lastReading: newReading,
      status: newStatus
    };
  });
}

// Maybe generate an alert based on readings and probability
function maybeGenerateAlert(plot: Plot, reading: SensorReading): void {
  // Either status change or random chance based on config
  if (Math.random() < simulationConfig.alertChance) {
    // Determine which parameter to alert on
    const parameters: ('temperature' | 'humidity' | 'soilMoisture' | 'cropHealth')[] = 
      ['temperature', 'humidity', 'soilMoisture', 'cropHealth'];
    
    const alertType = parameters[Math.floor(Math.random() * parameters.length)];
    let severity: 'info' | 'warning' | 'critical' = 'info';
    let message = '';
    
    // Base severity on actual reading values
    switch (alertType) {
      case 'temperature':
        if (reading.temperature > 32) {
          severity = 'critical';
          message = `Critically high temperature detected (${reading.temperature.toFixed(1)}°C)`;
        } else if (reading.temperature > 30) {
          severity = 'warning';
          message = `Elevated temperature detected (${reading.temperature.toFixed(1)}°C)`;
        } else {
          message = `Temperature change detected (${reading.temperature.toFixed(1)}°C)`;
        }
        break;
      case 'humidity':
        if (reading.humidity < 35) {
          severity = 'critical';
          message = `Critically low humidity levels detected (${reading.humidity.toFixed(1)}%)`;
        } else if (reading.humidity < 45) {
          severity = 'warning';
          message = `Low humidity levels detected (${reading.humidity.toFixed(1)}%)`;
        } else {
          message = `Humidity change detected (${reading.humidity.toFixed(1)}%)`;
        }
        break;
      case 'soilMoisture':
        if (reading.soilMoisture < 25) {
          severity = 'critical';
          message = `Critically low soil moisture detected (${reading.soilMoisture.toFixed(1)}%)`;
        } else if (reading.soilMoisture < 35) {
          severity = 'warning';
          message = `Low soil moisture detected (${reading.soilMoisture.toFixed(1)}%)`;
        } else {
          message = `Soil moisture change detected (${reading.soilMoisture.toFixed(1)}%)`;
        }
        break;
      case 'cropHealth':
        if (reading.cropHealth < 60) {
          severity = 'critical';
          message = `Critical crop health index detected (${reading.cropHealth.toFixed(1)})`;
        } else if (reading.cropHealth < 70) {
          severity = 'warning';
          message = `Declining crop health index detected (${reading.cropHealth.toFixed(1)})`;
        } else {
          message = `Crop health change detected (${reading.cropHealth.toFixed(1)})`;
        }
        break;
    }
    
    // Create the alert
    const newAlert: Alert = {
      id: `alert-${plot.id}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: alertType,
      severity,
      message,
      plotId: plot.id,
      plotName: plot.name,
      status: 'active'
    };
    
    // Add to alerts
    simulatedAlerts = [newAlert, ...simulatedAlerts].slice(0, 100); // Keep last 100 alerts
  }
}

// Generate crop profiles
export function generateCrops(): Crop[] {
  return [
    {
      id: 'crop-1',
      name: 'Wheat',
      scientificName: 'Triticum aestivum',
      growthDuration: 120, // days
      waterRequirement: 'medium',
      optimalTemperature: { min: 15, max: 24 },
      optimalHumidity: { min: 45, max: 70 },
      optimalSoilMoisture: { min: 40, max: 60 },
      description: 'Wheat is a grass widely cultivated for its seed, a cereal grain which is a worldwide staple food.'
    },
    {
      id: 'crop-2',
      name: 'Rice',
      scientificName: 'Oryza sativa',
      growthDuration: 150,
      waterRequirement: 'high',
      optimalTemperature: { min: 20, max: 30 },
      optimalHumidity: { min: 60, max: 80 },
      optimalSoilMoisture: { min: 70, max: 90 },
      description: 'Rice is the seed of the grass species Oryza sativa or less commonly Oryza glaberrima.'
    },
    {
      id: 'crop-3',
      name: 'Corn',
      scientificName: 'Zea mays',
      growthDuration: 90,
      waterRequirement: 'medium',
      optimalTemperature: { min: 18, max: 32 },
      optimalHumidity: { min: 50, max: 75 },
      optimalSoilMoisture: { min: 45, max: 65 },
      description: 'Maize, also known as corn, is a cereal grain first domesticated by indigenous peoples in southern Mexico.'
    },
    {
      id: 'crop-4',
      name: 'Soybeans',
      scientificName: 'Glycine max',
      growthDuration: 100,
      waterRequirement: 'medium',
      optimalTemperature: { min: 20, max: 30 },
      optimalHumidity: { min: 55, max: 70 },
      optimalSoilMoisture: { min: 50, max: 70 },
      description: 'The soybean or soya bean is a species of legume native to East Asia, widely grown for its edible bean.'
    },
    {
      id: 'crop-5',
      name: 'Cotton',
      scientificName: 'Gossypium hirsutum',
      growthDuration: 180,
      waterRequirement: 'medium',
      optimalTemperature: { min: 20, max: 35 },
      optimalHumidity: { min: 40, max: 60 },
      optimalSoilMoisture: { min: 35, max: 55 },
      description: 'Cotton is a soft, fluffy staple fiber that grows in a boll around the seeds of the cotton plants.'
    },
    {
      id: 'crop-6',
      name: 'Sugarcane',
      scientificName: 'Saccharum officinarum',
      growthDuration: 270,
      waterRequirement: 'high',
      optimalTemperature: { min: 24, max: 38 },
      optimalHumidity: { min: 60, max: 80 },
      optimalSoilMoisture: { min: 60, max: 80 },
      description: 'Sugarcane is a perennial grass of the genus Saccharum, primarily cultivated for its juice from which sugar is processed.'
    }
  ];
}

// Generate alerts
export function generateAlerts(): Alert[] {
  return [...simulatedAlerts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Acknowledge or resolve an alert
export function updateAlertStatus(alertId: string, newStatus: 'acknowledged' | 'resolved'): Alert | undefined {
  const alertIndex = simulatedAlerts.findIndex(alert => alert.id === alertId);
  
  if (alertIndex !== -1) {
    const updatedAlert = {
      ...simulatedAlerts[alertIndex],
      status: newStatus
    };
    
    simulatedAlerts[alertIndex] = updatedAlert;
    return updatedAlert;
  }
  
  return undefined;
}

// Utility function to get summary data
export function getSummaryData() {
  const plots = simulatedPlots;
  const totalPlots = plots.length;
  const healthyPlots = plots.filter(plot => plot.status === 'healthy').length;
  const warningPlots = plots.filter(plot => plot.status === 'warning').length;
  const criticalPlots = plots.filter(plot => plot.status === 'critical').length;
  
  let avgTemperature = 0;
  let avgHumidity = 0;
  let avgSoilMoisture = 0;
  let avgCropHealth = 0;
  
  plots.forEach(plot => {
    if (plot.lastReading) {
      avgTemperature += plot.lastReading.temperature;
      avgHumidity += plot.lastReading.humidity;
      avgSoilMoisture += plot.lastReading.soilMoisture;
      avgCropHealth += plot.lastReading.cropHealth;
    }
  });
  
  if (totalPlots > 0) {
    avgTemperature /= totalPlots;
    avgHumidity /= totalPlots;
    avgSoilMoisture /= totalPlots;
    avgCropHealth /= totalPlots;
  }
  
  return {
    totalPlots,
    healthyPlots,
    warningPlots,
    criticalPlots,
    avgTemperature,
    avgHumidity,
    avgSoilMoisture,
    avgCropHealth
  };
}

// Start the simulation process
export function startSimulation(): void {
  if (!simulationStarted) {
    // Generate initial data if not already done
    if (simulatedPlots.length === 0) {
      generatePlots(8);
    }
    
    // Set up the interval for updates
    simulationInterval = window.setInterval(() => {
      updatePlots();
    }, simulationConfig.updateInterval);
    
    simulationStarted = true;
    console.log('Simulation started');
  }
}

// Stop the simulation process
export function stopSimulation(): void {
  if (simulationStarted && simulationInterval !== null) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    simulationStarted = false;
    console.log('Simulation stopped');
  }
}

// Check if simulation is running
export function isSimulationRunning(): boolean {
  return simulationStarted;
}
