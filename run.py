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


userLocations = { }

@app.route('/postGPS', methods=['POST'])
def postGPS():
    data = request.get_json()

    userLocations[request.remote_addr] = (data['latitude'], data['longitude'])

    return jsonify(result = "success", result2 = 'inbound')

@app.route('/wherePeople', methods=['GET'])
def wherePeople():
    return jsonify(result = "success", userLocations = userLocations)




test_crosswalks = [(37.55365270000011, 127.17213809999942)]

@app.route('/whereCrosswalk', methods=['GET'])
def whereCrosswalk():
    return jsonify(result = "success", crosswalks = test_crosswalks)

if __name__ == "__main__":

    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    ssl_context.load_cert_chain(certfile='server.crt', keyfile='server.key', password='')

    app.run(host="0.0.0.0", port=2500, ssl_context=ssl_context, debug=True)