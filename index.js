const RPC = require("discord-rpc");
const chalk = require('chalk');
const ws = require('ws');

// Websocket Connection
var socket = new ws("ws://0.0.0.0:2946/BSDataPuller/MapData");

const rpc = new RPC.Client({
    transport: "ipc"
})

const presence = {
    details: "Playing Beat Saber",
    state: "Starting RPC..",
    largeImageKey: "beat-saber"
}

rpc.on("ready", () => {
    rpc.setActivity(presence)
    console.log(chalk.redBright.bold(`RPC Active!`));
})

socket.onmessage = function(event) {
    var msg = JSON.parse(event.data)
    console.log(msg)

    if(msg.InLevel === false & msg.SongName === null) {
        presence.details = `Just opened!`
        presence.state = `In Lobby`

        rpc.setActivity(presence)
    } else if (msg.InLevel === true && msg.LevelPaused === false) {
        presence.details = `Playing ${msg.SongName}`
        presence.state = `Difficulty ${msg.Difficulty}`
        presence.smallImageKey = `play`
        presence.smallImageText = `Playing`

        rpc.setActivity(presence)
    } else if(msg.InLevel === true && msg.LevelPaused === true) {
        presence.details = `Playing ${msg.SongName}`
        presence.state = `Difficulty ${msg.Difficulty}`
        presence.smallImageKey = "pausedd"
        presence.smallImageText = `Paused`

        rpc.setActivity(presence)
    } else if (msg.LevelFinished === true || msg.LevelQuit === true) {
        presence.details = `Last Played ${msg.SongName}`
        presence.state = `In Lobby`
        presence.smallImageKey = `pausedd`
        presence.smallImageText = `Quit Level`

        rpc.setActivity(presence)
    }
}

socket.onerror = function(event) {
    const error = JSON.parse(JSON.stringify(event.error))
    if(error.code === `ECONNREFUSED`) {
        console.log(chalk.redBright.bold(`Websocket not active on ws://0.0.0.0:2946!\nYou need to start Beat Saber with DataPuller installed (along with its dependencies) for this RPC to work!`))
        process.exit(1)
    } else {
        console.log(chalk.redBright.bold(`Unhandled error! If this continues happening, create a GitHub issue on bs-rpc!\n`, JSON.stringify(error)))
        process.exit(1);
    }
}

rpc.login({
    clientId: "877115128326287390"
})