Config = {}

-- Command to toggle autopilot
Config.Command = 'autopilot'

-- Maximum driving speed in m/s (25 m/s = ~90 km/h = ~56 mph)
Config.MaxSpeed = 45.0

-- Driving style bitmask (controls AI driving behavior)
-- 786603 = Normal driving, obeys traffic laws, stops at lights
-- 1074528293 = Rush to destination, avoid vehicles and peds
-- 6 = Avoid vehicles and peds only
-- Config.DrivingStyle = 786603
Config.DrivingStyle = 1074528293

-- Distance from waypoint to stop (in meters)
Config.StoppingDistance = 5.0

-- Interval between distance checks in milliseconds (higher = less CPU usage)
Config.DistanceCheckInterval = 500

-- Interval between key press checks (0 = every frame, required for responsiveness)
Config.KeyCheckInterval = 0

-- Show notification messages
Config.EnableNotifications = true

-- Vehicle classes blocked from using autopilot
-- See: https://docs.fivem.net/natives/?_0x29439776AAA00A62
Config.BlockedVehicleClasses = {
    -- 8,   -- Motorcycles -> if you are having issues with motorcycles, uncomment this line
    13,  -- Cycles (bicycles)
    14,  -- Boats
    15,  -- Helicopters
    16,  -- Planes
    21,  -- Trains
}
