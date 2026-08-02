from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from groq import Groq
from google import genai
from google.genai import types
import base64
import re
import traceback
import json

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["https://farmwisee.vercel.app"])

# --- Clients ---
groq_client = Groq(api_key=os.getenv("GROQ_KEY"))

client_gemini = genai.Client(api_key=os.getenv("GEMINI_KEY"))





# ─────────────────────────────────────────────
# FARMING TIP  (text only)
# ─────────────────────────────────────────────
@app.route('/api/farming-tip', methods=['POST'])
def get_farming_tip():
    try:
        data = request.json

        prompt = f"""You are an expert agricultural advisor. Based on the following weather data, give exactly 3 short, practical farming tips for a small-scale farmer. Each tip should be one clear, actionable sentence. Be specific and friendly, no greetings or sign-offs.

Weather: {data.get('description')}
Temperature: {data.get('temp')}°C (feels like {data.get('feelsLike')}°C)
Humidity: {data.get('humidity')}%
Wind speed: {data.get('wind')} km/h
Location: {data.get('city')}

Return ONLY a JSON array of exactly 3 strings. No markdown, no extra text."""

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        tips = json.loads(raw)
        if not isinstance(tips, list):
            raise ValueError("Model did not return a list")

        print("[farming-tip] Using Groq")
        return jsonify({"tips": tips}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "tips": [
                "Check your soil moisture before watering today.",
                "Avoid spraying pesticides if it looks like rain is coming.",
                "Make sure your drainage channels are clear.",
            ]
        }), 500


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

        response = client_gemini.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt
            ]
        )
        raw = response.text.strip()
        print("[detect-disease] Using Gemini 3.6 Flash")

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
# FARMING ADVICE (Practices page chat)
# ─────────────────────────────────────────────
@app.route("/api/farming-advice", methods=["POST"])
def farming_advice():
    try:
        data     = request.get_json()
        crop     = data.get("crop", "maize")
        question = data.get("question", "")

        if not question:
            return jsonify({"error": "No question provided"}), 400

        prompt = f"""You are FarmWise, a friendly farming advisor helping small-scale farmers in Nigeria.

A farmer is asking about {crop} farming. Answer in plain, simple language — like you are talking to someone in the field, not a scientist.

Rules:
- Return ONLY a JSON array of bullet points. No intro, no sign-off, no markdown.
- Each bullet is one clear sentence
- Give exactly as many bullets as the question needs — not too few, not too many
- If it's a simple factual question, answer it directly first, then add 2-3 useful related points
- If it's a how-to question, give practical steps
- Use simple words anyone can understand
- Use local Nigerian context where relevant (markets, climate, common inputs)
- If the question has nothing to do with farming, return: ["Sorry, I can only help with farming questions!"]

Farmer's question: {question}"""

        # --- Using Groq ---
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
        )

        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        bullets = json.loads(raw)
        print(f"[farming-advice] Advice generated for {crop}")
        return jsonify({"bullets": bullets})

    except Exception as e:
        print(f"Farming advice error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)