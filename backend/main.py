"""
Developed by : Team CodeLess
Purpose : Backend API of the MediLink project to provide security and data transfer channels.
Date : 05-11-2026
"""

from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"status": "success", "version": "api/v1"})

app.run(host="0.0.0.0", port=8083)