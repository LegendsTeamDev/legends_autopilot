if not lib then return end
if GetCurrentResourceName() ~= 'legends_autopilot' then
    print('^1[legends_autopilot] Resource has been renamed. Please use the original resource name "legends_autopilot".^0')
    return
end

local isAutopilotActive = false
local isUIOpen = false

local playerSettings = {
    maxSpeed = 45.0,           -- m/s (~162 km/h)
    drivingStyle = 1074528293, -- Rushed
    stoppingDistance = 5.0     -- meters
}

local function LoadSettings()
    local stored = GetResourceKvpString('legends_autopilot:settings')
    if stored then
        local success, decoded = pcall(json.decode, stored)
        if success and decoded then
            if decoded.maxSpeed then playerSettings.maxSpeed = decoded.maxSpeed end
            if decoded.drivingStyle then playerSettings.drivingStyle = decoded.drivingStyle end
            if decoded.stoppingDistance then playerSettings.stoppingDistance = decoded.stoppingDistance end
        end
    end
end

local function SaveSettings()
    SetResourceKvp('legends_autopilot:settings', json.encode(playerSettings))
end

CreateThread(function()
    LoadSettings()
end)

local function GetWaypointCoords()
    local blip = GetFirstBlipInfoId(8) -- waypoint
    if not DoesBlipExist(blip) then
        return nil
    end
    return GetBlipInfoIdCoord(blip)
end

local function IsPlayerDriverOfVehicle()
    local ped = cache.ped
    if not ped or not IsPedInAnyVehicle(ped, false) then
        return false, nil
    end
    local vehicle = GetVehiclePedIsIn(ped, false)
    if GetPedInVehicleSeat(vehicle, -1) ~= ped then
        return false, nil
    end
    return true, vehicle
end

local function IsVehicleClassAllowed(vehicle)
    local vehicleClass = GetVehicleClass(vehicle)

    if Config.BlockedVehicleClasses then
        for _, blocked in ipairs(Config.BlockedVehicleClasses) do
            if vehicleClass == blocked then
                return false
            end
        end
    end

    return true
end

local StopAutopilot

local SLOWDOWN_START_DISTANCE = 80.0 -- meters
local SLOWDOWN_MIN_SPEED = 5.0       -- m/s (~18 km/h)

local function CalculateApproachSpeed(distance, maxSpeed, stoppingDistance)
    if distance > SLOWDOWN_START_DISTANCE then
        return maxSpeed
    end

    local slowdownRange = SLOWDOWN_START_DISTANCE - stoppingDistance
    local distanceInZone = distance - stoppingDistance
    local progress = distanceInZone / slowdownRange

    local speedRange = maxSpeed - SLOWDOWN_MIN_SPEED
    local targetSpeed = SLOWDOWN_MIN_SPEED + (speedRange * progress * progress)

    return math.max(SLOWDOWN_MIN_SPEED, targetSpeed)
end

local function StartDistanceMonitorThread(vehicle, destination, settings)
    CreateThread(function()
        local lastAppliedSpeed = settings.maxSpeed
        local groundZ = destination.z

        local found, z = GetGroundZFor_3dCoord(destination.x, destination.y, destination.z + 100.0, false)
        if found then
            groundZ = z
        end

        while isAutopilotActive do
            Wait(Config.DistanceCheckInterval)

            if not isAutopilotActive then break end

            local ped = cache.ped
            if not ped or not IsPedInAnyVehicle(ped, false) then
                StopAutopilot('exited')
                break
            end

            local currentVehicle = GetVehiclePedIsIn(ped, false)
            if currentVehicle ~= vehicle or GetPedInVehicleSeat(currentVehicle, -1) ~= ped then
                StopAutopilot('exited')
                break
            end

            local vehicleCoords = GetEntityCoords(vehicle)
            local distance = #(vehicleCoords - destination)

            if distance <= settings.stoppingDistance then
                StopAutopilot('arrived')
                break
            end

            if distance <= SLOWDOWN_START_DISTANCE then
                local targetSpeed = CalculateApproachSpeed(distance, settings.maxSpeed, settings.stoppingDistance)

                if math.abs(targetSpeed - lastAppliedSpeed) > 2.0 then
                    lastAppliedSpeed = targetSpeed

                    TaskVehicleDriveToCoordLongrange(
                        ped,
                        vehicle,
                        destination.x,
                        destination.y,
                        groundZ,
                        targetSpeed,
                        settings.drivingStyle,
                        settings.stoppingDistance
                    )
                end
            end
        end
    end)
end

local function StartKeyMonitorThread()
    CreateThread(function()
        while isAutopilotActive do
            Wait(Config.KeyCheckInterval)

            if IsControlJustPressed(0, 72) then -- S / VEH_BRAKE
                StopAutopilot('brake')
                break
            end

            if IsControlJustPressed(0, 76) then -- SPACE / VEH_HANDBRAKE
                StopAutopilot('handbrake')
                break
            end
        end
    end)
end

StopAutopilot = function(reason)
    if not isAutopilotActive then return end

    isAutopilotActive = false

    local ped = cache.ped
    if ped then
        ClearPedTasks(ped)

        local vehicle = GetVehiclePedIsIn(ped, false)
        if vehicle and vehicle ~= 0 then
            if reason == 'arrived' then
                TaskVehicleTempAction(ped, vehicle, 1, 2500) -- brake for 2.5s
            else
                TaskVehicleTempAction(ped, vehicle, 1, 1000) -- brake for 1s
            end
        end
    end

    if isUIOpen then
        SendNUIMessage({
            action = 'updateState',
            data = { isActive = false }
        })
    end

    if Config.EnableNotifications then
        local messages = {
            brake = 'Autopilot cancelled - brake pressed.',
            handbrake = 'Autopilot cancelled - handbrake pressed.',
            command = 'Autopilot cancelled.',
            arrived = 'You have arrived at your destination.',
            exited = 'Autopilot cancelled - exited vehicle.'
        }
        lib.notify({
            title = 'Autopilot',
            description = messages[reason] or 'Autopilot cancelled.',
            type = reason == 'arrived' and 'success' or 'inform'
        })
    end
end

local function StartAutopilotWithSettings(vehicle, destination, settings)
    if isAutopilotActive then return false end

    isAutopilotActive = true
    local ped = cache.ped

    local groundZ = destination.z
    local found, z = GetGroundZFor_3dCoord(destination.x, destination.y, destination.z + 100.0, false)
    if found then
        groundZ = z
    end

    TaskVehicleDriveToCoordLongrange(
        ped,
        vehicle,
        destination.x,
        destination.y,
        groundZ,
        settings.maxSpeed,
        settings.drivingStyle,
        settings.stoppingDistance
    )

    if Config.EnableNotifications then
        lib.notify({
            title = 'Autopilot',
            description = 'Autopilot engaged. Press S, SPACE, or type /autopilot to cancel.',
            type = 'success'
        })
    end

    StartDistanceMonitorThread(vehicle, destination, settings)
    StartKeyMonitorThread()

    return true
end

local function OpenUI()
    if isUIOpen then return end
    isUIOpen = true
    SetNuiFocus(true, true)

    local blip = GetFirstBlipInfoId(8)
    local hasWaypoint = blip ~= 0 and DoesBlipExist(blip)
    local isDriver, vehicle = IsPlayerDriverOfVehicle()
    local vehicleAllowed = vehicle and IsVehicleClassAllowed(vehicle) or false

    SendNUIMessage({
        action = 'open',
        data = {
            settings = playerSettings,
            isActive = isAutopilotActive,
            hasWaypoint = hasWaypoint,
            isDriver = isDriver and vehicleAllowed
        }
    })
end

local function CloseUI()
    if not isUIOpen then return end
    isUIOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end

RegisterNUICallback('close', function(_, cb)
    cb('ok')
    CloseUI()
end)

RegisterNUICallback('startAutopilot', function(data, cb)
    cb('ok')

    if data.settings then
        playerSettings = data.settings
        SaveSettings()
    end

    local isDriver, vehicle = IsPlayerDriverOfVehicle()
    local waypointCoords = GetWaypointCoords()

    if isDriver and vehicle and IsVehicleClassAllowed(vehicle) and waypointCoords then
        local success = StartAutopilotWithSettings(vehicle, waypointCoords, playerSettings)
        if success then
            CloseUI()
        end
    else
        if not isDriver then
            lib.notify({
                title = 'Autopilot',
                description = 'You must be driving a vehicle.',
                type = 'error'
            })
        elseif vehicle and not IsVehicleClassAllowed(vehicle) then
            lib.notify({
                title = 'Autopilot',
                description = 'Autopilot is not available for this vehicle type.',
                type = 'error'
            })
        elseif not waypointCoords then
            lib.notify({
                title = 'Autopilot',
                description = 'Please set a waypoint on the map first.',
                type = 'error'
            })
        end
    end
end)

RegisterNUICallback('stopAutopilot', function(_, cb)
    cb('ok')
    StopAutopilot('command')
end)

RegisterNUICallback('saveSettings', function(data, cb)
    cb('ok')
    if data.settings then
        playerSettings = data.settings
        SaveSettings()
    end
end)

RegisterCommand(Config.Command, function()
    if isUIOpen then
        CloseUI()
    else
        OpenUI()
    end
end, false)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        if isAutopilotActive then
            StopAutopilot('command')
        end
        if isUIOpen then
            CloseUI()
        end
    end
end)
