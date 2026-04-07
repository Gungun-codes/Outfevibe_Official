from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import numpy as np
import cv2
import mediapipe as mp

app = FastAPI()

# ── Init MediaPipe ─────────────────────────
mp_pose = mp.solutions.pose
mp_face = mp.solutions.face_detection

pose = mp_pose.Pose(static_image_mode=True)
face_detector = mp_face.FaceDetection(model_selection=1, min_detection_confidence=0.5)

# ── Security Validation ────────────────────
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

def validate_file(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        return False, "Invalid file type"
    return True, None

# ── Convert Image ──────────────────────────
def read_image(file_bytes):
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

# ── 1. PERSON DETECTION ────────────────────
def detect_person(image):
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb)

    if not results.pose_landmarks:
        return False, None

    return True, results.pose_landmarks.landmark

# ── 2. BODY SHAPE ──────────────────────────
def get_body_shape(landmarks):
    ls = landmarks[11]  # left shoulder
    rs = landmarks[12]  # right shoulder
    lh = landmarks[23]  # left hip
    rh = landmarks[24]  # right hip

    shoulder_width = abs(ls.x - rs.x)
    hip_width = abs(lh.x - rh.x)

    if shoulder_width > hip_width * 1.1:
        return "Inverted Triangle"
    elif hip_width > shoulder_width * 1.1:
        return "Pear"
    else:
        return "Rectangle"

# ── 3. SKIN TONE ───────────────────────────
def get_skin_tone(image):
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_detector.process(rgb)

    if not results.detections:
        return "Medium"  # fallback

    bbox = results.detections[0].location_data.relative_bounding_box

    h, w, _ = image.shape
    x1 = int(bbox.xmin * w)
    y1 = int(bbox.ymin * h)
    x2 = int((bbox.xmin + bbox.width) * w)
    y2 = int((bbox.ymin + bbox.height) * h)

    face = image[y1:y2, x1:x2]

    if face.size == 0:
        return "Medium"

    avg_color = np.mean(face, axis=(0, 1))
    brightness = np.mean(avg_color)

    if brightness > 200:
        return "Fair"
    elif brightness > 150:
        return "Wheatish"
    elif brightness > 110:
        return "Dusky"
    else:
        return "Deep"

# ── API ROUTE ──────────────────────────────
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    # Step 1: Validate
    valid, error = validate_file(file)
    if not valid:
        return JSONResponse({"success": False, "error": error}, status_code=400)

    contents = await file.read()
    image = read_image(contents)

    if image is None:
        return JSONResponse({"success": False, "error": "Invalid image"}, status_code=400)

    # Step 2: Detect Person
    person_detected, landmarks = detect_person(image)

    if not person_detected:
        return JSONResponse({
            "success": False,
            "error": "No person detected. Upload a clear full-body image."
        }, status_code=422)

    # Step 3: Body Shape
    body_shape = get_body_shape(landmarks)

    # Step 4: Skin Tone
    skin_tone = get_skin_tone(image)

    return {
        "success": True,
        "person_detected": True,
        "body_shape": body_shape,
        "skin_tone": skin_tone
    }