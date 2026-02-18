Config = {}

-- Command to toggle autopilot
Config.Command = 'autopilot'

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
