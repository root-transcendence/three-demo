import { EventSystem } from "./EventSystem.js" 

let gameRequestSocket;

export const useGameRequestSocket = () => {
		if ( !gameRequestSocket ) {
				gameRequestSocket = new GameRequestsocket();
		}
		return gameRequestSocket;
};

export  class GameRequestsocket { 
		constructor() {
				this.isReady = new Promise((resolve, reject) => {
						const token = localStorage.getItem("access");
						this.socket = new WebSocket(`wss://${window.location.host}/ws/gamerequest/${token}/`);

						this.socket.onmessage = async function (e) {
								const data = JSON.parse(e.data);

								if (data.type === "accept_request") {
										console.log("data")
								} else if (data.type === "fetch_request") {
										EventSystem.emit("fetch_game_request", data.message)
								} else if (data.type === "send_request") {
										console.log(data)
										EventSystem.emit("fetch_game_request", data)
								}
						};

						this.socket.onclose = () => {
								console.log("heyyya kapandim")
						};
						this.socket.onopen = () => {
								resolve();
								console.log("heyyya acildim")
						};
				});

		}

		async sendGameRequest(username) {
				try {
						await this.isReady; // Bağlantı kurulmasını bekle
						this.socket.send(
								JSON.stringify({
										type: "send_request",
										receiver: username,
								})
						);
				} catch (error) {
						console.error("Failed to send game request:", error);
				}
		}

		async acceptGameRequest(username) {
				try {
						await this.isReady; // Bağlantı kurulmasını bekle
						const uid = crypto.randomUUID()
						this.socket.send(
								JSON.stringify({
										type: "accept_request",
										receiver: username,
										uid: uid,
								})
						);
				} catch (error) {
						console.error("Failed to send game request:", error);
				}
		}

		async declineGameRequest(username) {
				try {
						await this.isReady; // Bağlantı kurulmasını bekle
						this.socket.send(
								JSON.stringify({
										type: "decline_request",
										receiver: username,
								})
						);
				} catch (error) {
						console.error("Failed to send game request:", error);
				}
		}

		async fetchGameRequest() {
				try {
						await this.isReady; // Bağlantı kurulmasını bekle
						this.socket.send(
								JSON.stringify({
										type: "fetch_request",
								})
						);
				} catch (error) {
						console.error("Failed to send game request:", error);
				}
		}
}
