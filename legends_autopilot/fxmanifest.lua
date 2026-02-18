fx_version 'cerulean'
game 'gta5'

name 'legends_autopilot'
author 'Jabata'
version '1.0.0'
description 'Vehicle autopilot system with modern UI - drive to waypoint automatically'

lua54 'yes'

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/assets/*.js',
    'web/dist/assets/*.css'
}

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/main.lua'
}

dependencies {
    'ox_lib'
}
