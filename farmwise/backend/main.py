from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
import traceback

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv('GEMINI_KEY'))

@app.route('/api/farming-tip', methods=['POST'])
def get_farming_tip():
    try:
        data = request.json

        prompt = f"""You are an expert agricultural advisor. Based on the following weather data, give a SHORT practical farming tip (2-3 sentences max) for a small-scale farmer. Be specific, actionable, and friendly. No greetings or sign-offs.

Weather: {data.get('description')}
Temperature: {data.get('temp')}°C (feels like {data.get('feelsLike')}°C)
Humidity: {data.get('humidity')}%
Wind speed: {data.get('wind')} km/h
Location: {data.get('city')}"""

        response = client.models.generate_content(
            model='models/gemini-2.5-flash-lite',
            contents=prompt
        )

        return jsonify({"tip": response.text}), 200

    except Exception as e:
        traceback.print_exc()  # This prints the REAL error in terminal
        return jsonify({"error": str(e), "tip": "Check local conditions before major farming activities today."}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)