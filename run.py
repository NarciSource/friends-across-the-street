from flask import Flask, render_template, request, jsonify

import ssl

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World"

@app.route("/user")
def user():
    return render_template('./userAlarm.html')

@app.route("/board")
def board():
    return render_template('./board.html')


userPositions = { }

@app.route('/postGPS', methods=['POST'])
def postGPS():
    name, position = request.get_json()

    print(name, position)

    userPositions[request.remote_addr] = (name, position['latitude'], position['longitude'])

    return jsonify(result = "success", isInbound = 'inbound')

@app.route('/wherePeople', methods=['GET'])
def wherePeople():
    return jsonify(result = "success", userPositions = userPositions)




test_crosswalks = [(37.55365270000011, 127.17213809999942)]

@app.route('/whereCrosswalk', methods=['GET'])
def whereCrosswalk():
    return jsonify(result = "success", crosswalks = test_crosswalks)

if __name__ == "__main__":

    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    ssl_context.load_cert_chain(certfile='server.crt', keyfile='server.key', password='')

    app.run(host="0.0.0.0", port=2500, ssl_context=ssl_context, debug=True)