from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
import requests as http_requests
import base64
import re
import traceback
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Clients ---
gemini_client = genai.Client(api_key=os.getenv('GEMINI_KEY'))
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions"


def groq_text(prompt: str, model: str = "llama-3.3-70b-versatile") -> str:
    """Call Groq text endpoint directly via HTTP (no SDK needed)."""
    resp = http_requests.post(
        GROQ_BASE_URL,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": model,
            "messages": [{"role": "user", "content": prompt}]
        },
        timeout=30
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def groq_vision(prompt: str, data_url: str, model: str = "meta-llama/llama-4-scout-17b-16e-instruct") -> str:
    """Call Groq vision endpoint directly via HTTP (no SDK needed)."""
    resp = http_requests.post(
        GROQ_BASE_URL,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": data_url}},
                        {"type": "text", "text": prompt}
                    ]
                }
            ]
        },
        timeout=60
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


# ─────────────────────────────────────────────
# FARMING TIP  (text only)
# ─────────────────────────────────────────────
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

        # --- Try Gemini first ---
        try:
            response = gemini_client.models.generate_content(
                model='gemini-2.0-flash-lite',
                contents=prompt
            )
            tip = response.text
            print("[farming-tip] Using Gemini")

        except Exception as gemini_err:
            print(f"[farming-tip] Gemini failed ({gemini_err}), falling back to Groq...")
            tip = groq_text(prompt)
            print("[farming-tip] Using Groq fallback")

        return jsonify({"tip": tip}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e), "tip": "Check local conditions before major farming activities today."}), 500


# ─────────────────────────────────────────────
# DISEASE DETECTION  (vision / multimodal)
# ─────────────────────────────────────────────
@app.route("/api/detect-disease", methods=["POST"])
def detect_disease():
    try:
        data = request.get_json()
        image_data = data.get("image")
        crop_type  = data.get("crop", "unknown crop")

        if not image_data:
            return jsonify({"error": "No image provided"}), 400

        mime_type = "image/jpeg"
        if "," in image_data:
            header, image_data = image_data.split(",", 1)
            if "image/" in header:
                mime_type = header.split(":")[1].split(";")[0]

        image_bytes = base64.b64decode(image_data)

        prompt = f"""You are an expert agricultural plant pathologist AI assistant.
The farmer has submitted a photo of their crop for diagnosis. They have selected this as a {crop_type} plant.

Analyze the image carefully. Your first task is to verify if the image actually shows a {crop_type} plant.
If the image shows a different crop (e.g., you see a tomato but they selected maize), set `is_crop_mismatch` to true and specify the `detected_crop`.

Respond ONLY with a JSON object in this exact format (no markdown, no extra text):

{{
  "is_crop_mismatch": true or false,
  "detected_crop": "The name of the crop you actually see (e.g., 'Tomato', 'Maize', 'Unknown')",
  "status": "healthy" or "diseased" or "unclear",
  "disease_name": "Name of the disease, or 'None' if healthy, or 'Unable to determine' if unclear",
  "confidence": "A realistic assessment: High (clear symptoms) / Medium / Low (blurry or ambiguous)",
  "description": "2-3 sentence plain-language description of what you see and why you made this diagnosis. Mention the crop type you identified.",
  "treatment": [
    "Step 1: specific actionable treatment step for the DETECTED crop",
    "Step 2: specific actionable treatment step",
    "Step 3: specific actionable treatment step"
  ],
  "prevention": "One concise prevention tip for the future of the DETECTED crop",
  "urgency": "Immediate action needed / Monitor closely / No action needed"
}}

If the image does not appear to be a plant or crop leaf at all, set status to "unclear" and explain in the description."""

        raw = None

        # --- Try Gemini first ---
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.0-flash-lite",
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    types.Part.from_text(text=prompt),
                ]
            )
            raw = response.text.strip()
            print("[detect-disease] Using Gemini")

        except Exception as gemini_err:
            print(f"[detect-disease] Gemini failed ({gemini_err}), falling back to Groq...")
            b64_str = base64.b64encode(image_bytes).decode("utf-8")
            data_url = f"data:{mime_type};base64,{b64_str}"
            raw = groq_vision(prompt, data_url).strip()
            print("[detect-disease] Using Groq fallback")

        # Strip markdown fences if model wraps in ```json ... ```
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        result = json.loads(raw)
        return jsonify(result)

    except Exception as e:
        print(f"Disease detection error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)