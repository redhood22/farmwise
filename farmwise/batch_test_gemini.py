"""
FarmWise Batch Validation Script — Gemini Direct (Fresh Run)
=============================================================
Calls Gemini API directly from your machine. No backend needed.

Usage:
    python batch_test_gemini.py --key YOUR_GEMINI_KEY
    python batch_test_gemini.py --key YOUR_SECOND_KEY --start-from 21

Results are saved to validation_results_gemini.csv.
When switching keys, use --start-from to continue from where you left off.
Results are APPENDED so previous rows are never lost.
"""

import os
import base64
import json
import csv
import time
import argparse
import re
from pathlib import Path
from google import genai
from google.genai import types

# ── CONFIG ────────────────────────────────────────────────────────────────────
IMAGES_FOLDER = "test_images"
OUTPUT_CSV    = "validation_results_gemini.csv"
DELAY_SECONDS = 4
MODEL         = "gemini-3.5-flash"
# ─────────────────────────────────────────────────────────────────────────────

SUPPORTED_CROPS  = ["maize", "tomato", "pepper", "potato", "groundnut"]
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

PROMPT_TEMPLATE = """You are an expert agricultural plant pathologist AI assistant.
The farmer has submitted a photo of their crop for diagnosis. They have selected this as a {crop_type} plant.

Analyze the image carefully. Your first task is to verify if the image actually shows a {crop_type} plant.
If the image shows a different crop, set is_crop_mismatch to true and specify the detected_crop.

Respond ONLY with a JSON object in this exact format (no markdown, no extra text):

{{
  "is_crop_mismatch": true or false,
  "detected_crop": "The name of the crop you actually see",
  "status": "healthy" or "diseased" or "unclear",
  "disease_name": "Name of the disease, or 'None' if healthy, or 'Unable to determine' if unclear",
  "confidence": "High" or "Medium" or "Low",
  "description": "2-3 sentence plain-language description of what you see.",
  "treatment": ["Step 1", "Step 2", "Step 3"],
  "prevention": "One concise prevention tip",
  "urgency": "Immediate action needed" or "Monitor closely" or "No action needed"
}}"""


def collect_images():
    items = []
    if not os.path.isdir(IMAGES_FOLDER):
        print(f"ERROR: folder '{IMAGES_FOLDER}' not found.")
        return items
    for crop in sorted(os.listdir(IMAGES_FOLDER)):
        crop_lower = crop.lower()
        crop_path  = os.path.join(IMAGES_FOLDER, crop)
        if not os.path.isdir(crop_path) or crop_lower not in SUPPORTED_CROPS:
            continue
        for fname in sorted(os.listdir(crop_path)):
            if fname.lower().endswith(IMAGE_EXTENSIONS):
                items.append({
                    "crop":     crop_lower,
                    "filename": fname,
                    "filepath": os.path.join(crop_path, fname),
                })
    return items


def call_gemini(client, image_path, crop_type):
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    ext    = Path(image_path).suffix.lower()
    mime   = "image/png" if ext == ".png" else "image/jpeg"
    prompt = PROMPT_TEMPLATE.format(crop_type=crop_type)

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime),
            prompt
        ]
    )
    raw = response.text.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)


def run(api_key, start_from):
    client = genai.Client(api_key=api_key)
    images = collect_images()

    if not images:
        print("No images found."); return

    total = len(images)
    todo  = [(i+1, item) for i, item in enumerate(images) if i+1 >= start_from]

    if not todo:
        print("Nothing to run from that index."); return

    print(f"\nFound {total} images. Running from index {start_from}...\n")

    fieldnames = ["index","crop","filename","ground_truth","predicted_disease",
                  "status","confidence","is_mismatch","urgency",
                  "description","correct","notes"]

    # Write header only if starting fresh (index 1)
    if start_from == 1:
        with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=fieldnames).writeheader()

    with open(OUTPUT_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        for i, item in todo:
            crop, fname, fpath = item["crop"], item["filename"], item["filepath"]
            print(f"[{i}/{total}] {crop}/{fname} ...", end=" ", flush=True)

            try:
                result     = call_gemini(client, fpath, crop)
                status     = result.get("status", "")
                disease    = result.get("disease_name", "")
                confidence = result.get("confidence", "")
                mismatch   = result.get("is_crop_mismatch", False)
                urgency    = result.get("urgency", "")
                desc       = result.get("description", "")

                print(f"{status} | {disease} | confidence: {confidence}")

                writer.writerow({
                    "index": i, "crop": crop, "filename": fname,
                    "ground_truth": "",
                    "predicted_disease": disease,
                    "status": status, "confidence": confidence,
                    "is_mismatch": mismatch, "urgency": urgency,
                    "description": desc, "correct": "", "notes": "",
                })
                f.flush()

            except Exception as e:
                err = str(e)
                print(f"ERROR — {err[:80]}")

                # Check if quota exceeded
                if "429" in err or "quota" in err.lower() or "RESOURCE_EXHAUSTED" in err:
                    print(f"\n⚠  Daily quota hit on index {i}.")
                    print(f"   Switch to your next key and run:")
                    print(f"   python batch_test_gemini.py --key <NEXT_KEY> --start-from {i}")
                    break

                writer.writerow({
                    "index": i, "crop": crop, "filename": fname,
                    "ground_truth": "", "predicted_disease": "ERROR",
                    "status": "error", "confidence": "", "is_mismatch": "",
                    "urgency": "", "description": err[:200],
                    "correct": "FALSE", "notes": "request failed",
                })
                f.flush()

            time.sleep(DELAY_SECONDS)

    print(f"\n✓ Progress saved to: {OUTPUT_CSV}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--key", required=True, help="Gemini API key")
    parser.add_argument("--start-from", type=int, default=1,
                        help="Image index to start from (1-based)")
    args = parser.parse_args()
    run(args.key, args.start_from)
