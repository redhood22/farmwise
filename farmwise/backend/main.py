from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from groq import Groq
import requests as http_requests
import base64
import re
import traceback
import json

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Clients ---
groq_client = Groq(api_key=os.getenv("GROQ_KEY"))





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

        # --- Using Groq ---
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        tip = response.choices[0].message.content.strip()
        print("[farming-tip] Using Groq")

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

        # --- Using Groq Vision ---
        b64_str = base64.b64encode(image_bytes).decode("utf-8")
        data_url = f"data:{mime_type};base64,{b64_str}"

        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": data_url}}
                ]
            }],
            max_tokens=1000
        )
        raw = response.choices[0].message.content.strip()
        print("[detect-disease] Using Groq Llama-4-scout")

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

        prompt = f"""You are FarmWise, an expert agricultural advisor specializing in smallholder farming in West Africa, particularly Nigeria.

A farmer is asking about {crop} farming. Answer their question in plain, practical language a small-scale farmer can act on immediately.

Rules:
- Keep the answer concise (3–6 sentences max)
- Be specific and actionable — no vague advice
- Use local context where relevant (Nigerian climate, common inputs available in local markets)
- If the question is unrelated to farming or agriculture, politely redirect

Farmer's question: {question}"""

        # --- Using Groq ---
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
        )

        answer = response.choices[0].message.content.strip()
        print(f"[farming-advice] Advice generated for {crop}")
        return jsonify({"answer": answer})

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