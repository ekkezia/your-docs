import os
from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import math
import random

emojis = [
    "❤️‍🩹",
    "🐛",
    "🐤",
    "🍕",
    "🦮",
    "😇",
    "😈",
    "🤠",
    "💀",
    "💩",
    "🤡",
    "🧚",
    "🧜‍♀️",
    "🐔",
    "🐸",
    "🦊",
    "🐰",
    "🐹",
    "🐻",
    "🐧",
    "🐝",
    "🦄",
    "🐺",
    "🦋",
    "🐞",
    "🐠",
    "🐬",
    "🐡",
    "🐳",
    "🐙",
    "🐢",
    "🐿️",
    "🌹",
    "🪻",
    "⭐️",
    "🌈",
]

# Support for gomix's 'front-end' and 'back-end' UI.
app = Flask(__name__, static_folder="public", template_folder="views")
socketio = SocketIO(app)

# Set the app secret key from the secret environment variables.
app.secret = os.environ.get("SECRET")

# active clients [global var]
active_clients = []
client_text = {}
selected_random_index = set()
text = ""
client_num = 0


# UNUSED
def generate_random_indexes(data_length, _participants, _client_num):
    # generate unique set of random indexes for each client connected to server
    num_of_altered_chars = math.floor(data_length / _participants)
    index = set()

    for i in range(num_of_altered_chars):
        index.add(i * _participants + _client_num)

    print("Index for", num_of_altered_chars, data_length, _client_num, index)
    return sorted(index)


@app.route("/")
def homepage():
    """Displays the homepage."""
    return render_template("index.html")


# Event when a client connects
@socketio.on("connect")
def handle_connect():
    global text
    global client_num

    client_id = request.sid

    random_emoji = emojis[random.randint(0, len(emojis) - 1)]

    active_clients.append((client_id, client_num, random_emoji))

    client_num += 1

    socketio.emit("active_client", active_clients)
    socketio.emit("update_text", {"cid": client_id, "text": text})

    print(
        f"🔗 Client connected, active clients: {active_clients}, number of clients: {len(active_clients)}"
    )

    for cid, _client_num, _ in active_clients:
        random_indexes = generate_random_indexes(
            len(text), len(active_clients), _client_num
        )
        print(
            f"🔗 Generate random index for CLIENT: {cid}, CLIENT NO: {_client_num} length: {len(active_clients)}"
        )
        emit("random_indexes", random_indexes, room=cid)


# Event when a client disconnects
@socketio.on("disconnect")
def handle_disconnect():
    global client_num
    client_id = request.sid

    for i in range(len(active_clients)):
        cid, _, _ = active_clients[i]
        if cid == client_id:
            del active_clients[i]
            print(f"⛓️‍💥 Client {client_id} disconnected.")
            break

    client_num = len(active_clients)
    print("active clients emit:", len(active_clients))

    socketio.emit("active_client", active_clients)

    new_client_num = 0
    for i in range(len(active_clients)):
        cid, _, random_emoji = active_clients[i]
        active_clients[i] = (cid, new_client_num, random_emoji)
        new_client_num += 1

    # Emit random indexes to each active client
    for cid, _client_num, _ in active_clients:
        random_indexes = generate_random_indexes(
            len(text), len(active_clients), _client_num
        )
        print(f"🔗 Generate random index for CLIENT: {cid}")
        emit("random_indexes", random_indexes, room=cid)


@socketio.on("title_change")
def handle_text(title):
    print("title change", text)
    client_id = request.sid
    client_text[client_id] = text

    socketio.emit("update_title", {"cid": client_id, "title": title})


@socketio.on("text_change")
def handle_text(_text):
    global text

    client_id = request.sid
    client_text[client_id] = _text

    text = _text

    socketio.emit("update_text", {"cid": client_id, "text": _text})

    for cid, _client_num, _ in active_clients:
        random_indexes = generate_random_indexes(
            len(text), len(active_clients), _client_num
        )
        print(
            f"🔗 Generate random index for CLIENT: {cid}, CLIENT NO: {_client_num} length: {len(active_clients)}"
        )
        emit("random_indexes", random_indexes, room=cid)


@socketio.on("bold_change")
def handle_bold(bold_is_changed):
    client_id = request.sid
    client_text[client_id] = text

    socketio.emit("update_bold", bold_is_changed)


@socketio.on("italic_change")
def handle_bold(italic_is_changed):
    client_id = request.sid
    client_text[client_id] = text

    socketio.emit("update_italic", italic_is_changed)


if __name__ == "__main__":
    app.run()
