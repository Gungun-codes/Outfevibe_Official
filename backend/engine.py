import cv2
import numpy as np
import logging
# Direct sub-module imports to avoid AttributeError
import mediapipe.python.solutions.pose as mp_pose
import mediapipe.python.solutions.face_detection as mp_face
from typing import Dict, Optional, List, Tuple, Any
from pydantic import BaseModel, ConfigDict

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FashionCVEngine")

class AnalysisResult(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    status: str
    body_shape: Dict[str, Any]
    skin_tone: Dict[str, Any]
    image_quality: Dict[str, Any]
    error_message: Optional[str] = None

class FashionCVEngine:
    def __init__(self):
        """Initialize models once for performance."""
        # CPU-optimized settings using direct sub-module references
        self.pose_model = mp_pose.Pose(
            static_image_mode=True,
            model_complexity=1,
            min_detection_confidence=0.6
        )
        self.face_model = mp_face.FaceDetection(
            model_selection=1, 
            min_detection_confidence=0.6
        )

        self.SKIN_SCALES = [
            ((220, 200, 180), "Very Fair"),
            ((190, 160, 140), "Fair"),
            ((160, 120, 90), "Medium"),
            ((110, 80, 60), "Tan"),
            ((60, 45, 35), "Deep")
        ]

    def _validate_input(self, img: np.ndarray) -> Tuple[bool, Optional[str]]:
        if img is None or img.size == 0:
            return False, "Invalid image data or corrupted file."
        h, w = img.shape[:2]
        if h < 200 or w < 200:
            return False, f"Image resolution too low ({w}x{h}). Minimum 200x200 required."
        return True, None

    def _get_skin_tone(self, img: np.ndarray, face_results) -> Dict:
        """Samples from face bounding box if available."""
        if not face_results.detections:
            return {"hex": "Unknown", "category": "Face Not Visible"}

        h, w, _ = img.shape
        bbox = face_results.detections[0].location_data.relative_bounding_box
        
        x = int((bbox.xmin + bbox.width * 0.4) * w)
        y = int((bbox.ymin + bbox.height * 0.3) * h)
        side = int(bbox.width * 0.2 * w)

        x1, y1 = max(0, x), max(0, y)
        x2, y2 = min(w, x + side), min(h, y + side)

        if (x2 - x1) < 2 or (y2 - y1) < 2:
            return {"hex": "Unknown", "category": "Sampling Area Too Small"}

        roi = img[y1:y2, x1:x2]
        lab = cv2.cvtColor(roi, cv2.COLOR_BGR2Lab)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(4,4))
        l = clahe.apply(l)
        normalized_roi = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_Lab2BGR)

        avg_bgr = np.mean(normalized_roi, axis=(0, 1))
        hex_val = "#{:02x}{:02x}{:02x}".format(int(avg_bgr[2]), int(avg_bgr[1]), int(avg_bgr[0]))

        category = "Medium"
        min_dist = float('inf')
        for ref_rgb, name in self.SKIN_SCALES:
            dist = np.linalg.norm(avg_bgr[::-1] - np.array(ref_rgb))
            if dist < min_dist:
                min_dist = dist
                category = name

        return {"hex": hex_val, "category": category}

    def _get_body_shape(self, landmarks) -> Dict:
        """Improved waist estimation and shape logic using Pose Landmarks."""
        lm = landmarks.landmark
        
        def get_dist(p1_idx, p2_idx):
            return np.sqrt((lm[p1_idx].x - lm[p2_idx].x)**2 + (lm[p1_idx].y - lm[p2_idx].y)**2)

        shoulder_w = get_dist(11, 12)
        hip_w = get_dist(23, 24)
        
        waist_l_x = lm[11].x * 0.25 + lm[23].x * 0.75
        waist_r_x = lm[12].x * 0.25 + lm[24].x * 0.75
        waist_w = abs(waist_l_x - waist_r_x)

        s_h_ratio = shoulder_w / hip_w
        w_h_ratio = waist_w / hip_w

        shape = "Rectangle"
        confidence = 0.5

        if s_h_ratio > 1.15:
            shape = "Inverted Triangle"
            confidence = min(0.9, s_h_ratio - 0.2)
        elif s_h_ratio < 0.88:
            shape = "Pear"
            confidence = min(0.9, (1/s_h_ratio) - 0.2)
        elif w_h_ratio < 0.78:
            shape = "Hourglass"
            confidence = min(0.9, (1/w_h_ratio) - 0.3)
        else:
            shape = "Rectangle"
            confidence = 0.7

        return {"type": shape, "confidence": round(confidence, 2)}

    def analyze(self, image: np.ndarray) -> AnalysisResult:
        is_valid, error = self._validate_input(image)
        if not is_valid:
            return AnalysisResult(status="error", body_shape={}, skin_tone={}, image_quality={}, error_message=error)

        try:
            rgb_img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            pose_results = self.pose_model.process(rgb_img)
            face_results = self.face_model.process(rgb_img)

            num_faces = len(face_results.detections) if face_results.detections else 0
            if num_faces > 1:
                return AnalysisResult(status="error", body_shape={}, skin_tone={}, image_quality={}, 
                                      error_message="Multiple people detected. Please provide an image with one person.")

            if not pose_results.pose_landmarks:
                return AnalysisResult(status="error", body_shape={}, skin_tone={}, image_quality={}, 
                                      error_message="Human body not detected clearly.")

            body = self._get_body_shape(pose_results.pose_landmarks)
            skin = self._get_skin_tone(image, face_results)

            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            blur_val = cv2.Laplacian(gray, cv2.CV_64F).var()

            return AnalysisResult(
                status="success",
                body_shape=body,
                skin_tone=skin,
                image_quality={"blur_score": round(blur_val, 2), "is_blurry": blur_val < 80}
            )

        except Exception as e:
            logger.error(f"Engine Crash: {str(e)}")
            return AnalysisResult(status="error", body_shape={}, skin_tone={}, image_quality={}, error_message=str(e))