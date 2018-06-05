
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

    static newGame(channel) {
        channel.push("new_game")
            .receive("ok", response => {
                console.log("New game!", response)
            })
            .receive("error", response => {
                console.log("Unable to start new game.", response)
            })
    }

    static addPlayer(channel, player) {
        channel.push("add_player", player)
            .receive("error", response => {
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

    leave(channel) {
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
