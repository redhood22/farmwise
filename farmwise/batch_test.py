"""
FarmWise Batch Validation Script
==================================
Usage:
  1. Create a folder structure like this:
       test_images/
         maize/
           maize_blight_01.jpg      ← filename should hint at the disease (for your records)
           maize_healthy_01.jpg
         tomato/
           tomato_early_blight_01.jpg
         pepper/
           ...
         potato/
           ...
         groundnut/
           ...

  2. Fill in BACKEND_URL below (your Render URL or localhost for local testing).

  3. Run:  python batch_test.py

  4. Results are saved to: validation_results.csv
     Open it in Excel or Google Sheets to calculate accuracy.

HOW TO GET TEST IMAGES (PlantVillage):
  - Go to: https://www.kaggle.com/datasets/emmarex/plantdisease
  - Download, then pick 8-10 images per crop from known-disease folders.
  - The folder name in PlantVillage tells you the correct disease label —
    that becomes your "ground_truth" column.
"""

import os
import base64
import json
import csv
import time
import requests

# ── CONFIG ────────────────────────────────────────────────────────────────────
BACKEND_URL   = "https://farmwise-rvqz.onrender.com"   # ← change if needed
IMAGES_FOLDER = "test_images"                              # ← folder with subfolders per crop
OUTPUT_CSV    = "validation_results.csv"
DELAY_SECONDS = 1.5   # pause between requests so Render free tier doesn't throttle
# ─────────────────────────────────────────────────────────────────────────────

SUPPORTED_CROPS = ["maize", "tomato", "pepper", "potato", "groundnut"]
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")


def encode_image(path: str) -> str:
    """Read an image file and return a base64 data-URL string."""
    ext = os.path.splitext(path)[1].lower()
    mime = "image/png" if ext == ".png" else "image/jpeg"
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{b64}"


def call_detect(image_b64: str, crop: str) -> dict:
    """POST to /api/detect-disease and return the parsed JSON result."""
    payload = {"image": image_b64, "crop": crop}
    resp = requests.post(
        f"{BACKEND_URL}/api/detect-disease",
        json=payload,
        timeout=60
    )
    resp.raise_for_status()
    return resp.json()


def collect_images() -> list[dict]:
    """Walk the test_images folder and collect all image paths with their crop label."""
    items = []
    if not os.path.isdir(IMAGES_FOLDER):
        print(f"ERROR: folder '{IMAGES_FOLDER}' not found. Create it and add subfolders per crop.")
        return items

    for crop in os.listdir(IMAGES_FOLDER):
        crop_lower = crop.lower()
        crop_path  = os.path.join(IMAGES_FOLDER, crop)
        if not os.path.isdir(crop_path):
            continue
        if crop_lower not in SUPPORTED_CROPS:
            print(f"  ⚠  Skipping unknown crop folder: {crop}")
            continue
        for fname in sorted(os.listdir(crop_path)):
            if fname.lower().endswith(IMAGE_EXTENSIONS):
                items.append({
                    "crop":       crop_lower,
                    "filename":   fname,
                    "filepath":   os.path.join(crop_path, fname),
                })
    return items


def run():
    images = collect_images()
    if not images:
        print("No images found. Nothing to test.")
        return

    print(f"Found {len(images)} images across crops. Starting validation...\n")

    rows = []
    passed = 0
    failed = 0
    errors = 0

    for i, item in enumerate(images, 1):
        crop     = item["crop"]
        fname    = item["filename"]
        fpath    = item["filepath"]

        print(f"[{i}/{len(images)}] {crop}/{fname} ...", end=" ", flush=True)

        try:
            b64    = encode_image(fpath)
            result = call_detect(b64, crop)

            status      = result.get("status", "")
            disease     = result.get("disease_name", "")
            confidence  = result.get("confidence", "")
            mismatch    = result.get("is_crop_mismatch", False)
            description = result.get("description", "")
            urgency     = result.get("urgency", "")

            print(f"{status} | {disease} | confidence: {confidence}")

            rows.append({
                "crop":              crop,
                "filename":          fname,
                "ground_truth":      "",          # ← YOU fill this in after (the known label)
                "predicted_disease": disease,
                "status":            status,
                "confidence":        confidence,
                "is_mismatch":       mismatch,
                "urgency":           urgency,
                "description":       description,
                "correct":           "",          # ← YOU fill: TRUE or FALSE after comparing
                "notes":             "",
            })

        except Exception as e:
            print(f"ERROR — {e}")
            errors += 1
            rows.append({
                "crop":              crop,
                "filename":          fname,
                "ground_truth":      "",
                "predicted_disease": "ERROR",
                "status":            "error",
                "confidence":        "",
                "is_mismatch":       "",
                "urgency":           "",
                "description":       str(e),
                "correct":           "FALSE",
                "notes":             "request failed",
            })

        time.sleep(DELAY_SECONDS)

    # Write CSV
    fieldnames = ["crop","filename","ground_truth","predicted_disease",
                  "status","confidence","is_mismatch","urgency",
                  "description","correct","notes"]

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n✓ Done. Results saved to: {OUTPUT_CSV}")
    print(f"  Total tested : {len(images)}")
    print(f"  Errors       : {errors}")
    print(f"\nNext steps:")
    print(f"  1. Open {OUTPUT_CSV} in Excel or Google Sheets")
    print(f"  2. Fill in the 'ground_truth' column with the correct disease name for each image")
    print(f"  3. Fill in the 'correct' column: TRUE if predicted_disease matches ground_truth, FALSE if not")
    print(f"  4. Accuracy = COUNT(TRUE) / total rows")
    print(f"  5. Note that images marked 'unclear' or 'error' count as incorrect unless noted otherwise")


if __name__ == "__main__":
    run()
