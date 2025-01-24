let gameRequestSocket;

export const useGameRequestSocket = () => {
		if ( !gameRequestSocket ) {
				gameRequestSocket = new GameRequestsocket();
		}
		return gameRequestSocket;
};

export class GameRequestsocket { 
		constructor() {
				const token = localStorage.getItem("access");
				this.socket = new WebSocket(`wss://${window.location.host}/ws/gamerequest/${token}/`);

				this.socket.onmessage = async function (e) {
						const data = JSON.parse(e.data);
						if (data.type === "game_request") {
								const gameRequestList = document.getElementById('game-requests');
								if (!gameRequestList) document.getElementById('requests-button')?.click()
								gameRequestList.innerHTML = ''; // Listeyi temizle

								const li = document.createElement('li');
								li.textContent = `${data.sender}`;

								const acceptButton = document.createElement('button');
								acceptButton.textContent = 'Accept Game Request';
								acceptButton.classList.add('accept-game');
								acceptButton.addEventListener('click', async () => {
										await acceptGameRequest(data.sender);
								});
								li.appendChild(acceptButton);
								const declineButton = document.createElement('button');
								declineButton.textContent = 'Decline Game Request';
								declineButton.classList.add('decline-game');
								declineButton.addEventListener('click', async () => {
								});
								li.appendChild(declineButton);
								gameRequestList.appendChild(li);
						} else if (data.type === "accept_request") {
								await loadPage('frontend_static/game.html')
								initSocket(data.uid);
						}
				};

				this.socket.onclose = () => {
				};
		}

		async sendGameRequest(username) {
				socket.send(
						JSON.stringify({
								type: "send_request",
								receiver: username,
						})
				);
		}

		async acceptGameRequest(username) {
				const uid = crypto.randomUUID()
				socket.send(
						JSON.stringify({
								type: "accept_request",
								receiver: username,
								uid: uid,
						})
				);
				loadPage('frontend_static/game.html')
				initSocket(uid);
		}

		async declineGameRequest(username) {
				socket.send(
						JSON.stringify({
								type: "decline_request",
								receiver: username,
						})
				);
		}

		async fechGameRequest() {
				socket.send(
						JSON.stringify({
								type: "fech_request",
						})
				);
		}
}
