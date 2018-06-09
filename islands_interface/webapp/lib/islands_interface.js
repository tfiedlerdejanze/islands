
import socket from "./socket"

class IslandsInterface {
    constructor() {

    }

    static newChannel(subtopic, screen_name) {
        return socket.channel(`game:${subtopic}`, {screen_name: screen_name})
    }

    static join(channel) {
        channel.join()
            .receive("ok", response => {
                console.log("joined successfully!", response)
            })
            .receive("error", response => {
                console.log("unable to join.", response)
            })
    }

    static showSubscribers(channel) {
        channel.push("show_subscribers")
    }

    static newGame(channel, onSuccess, onError) {
        channel.push("new_game")
            .receive("ok", response => {
                console.log("New game!", response)
                onSuccess()
            })
            .receive("error", response => {
                console.log("Unable to start new game.", response)
                onError()
            })
    }

    static addPlayer(channel, player, onSuccess, onError) {
        channel.push("add_player", player)
            .receive("ok", response => {
                console.log("Successfully added player", response)
                onSuccess()
            })
            .receive("error", response => {
                onError()
                console.log(`Unable to add player ${player}.`, response)
            })
    }

    static positionIsland(channel, player, island, row, col) {
        const params = {"player": player, "island": island, "row": row, "col": col}

        channel.push("position_island", params)
            .receive("ok", response => {
                console.log("Island positioned!")
            })
            .receive("error", response => {
                console.log("Unable to position island.", response)
            })
    }

    static setIslands(channel, player) {
        channel.push("set_islands", player)
            .receive("ok", response => {
                console.log("The board:")
                console.dir(response.board)
            })
            .receive("error", response => {
                console.log(`Unable to set islands for player ${player}.`, response)
            })
    }

    static positionIsland(channel, player, row, col) {
        const params = {"player": player, "row": row, "col": col}

        channel.push("guess_coordinate", params)
            .receive("error", response => {
                console.log(`Unable to guess a coordinate: ${player}`, response)
            })
    }

    static leave(channel) {
        channel.leave()
            .receive("ok", response => {
                console.log("left successfully", response)
            })
            .receive("error", response => {
                console.log("unable to leave", response)
            })
    }
}

export default IslandsInterface
