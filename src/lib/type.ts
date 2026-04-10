export type Step =
  | "welcome"
  | "upload"
  | "analyzing"
  | "analysis_result"
  | "gender"
  | "occasion"
  | "vibe"
  | "platform"
  | "loading_outfits"
  | "outfits";

export interface AnalysisResult {
  body_shape: string;
  skin_tone: string;
  body_shape_reason: string;
  skin_tone_reason: string;
}

export interface OutfitItem {
  name: string;
  tags: string[];
  rating: number;
  price: string;
  platform: string;
  category: string;
}

export interface OutfitResult {
  look_name: string;
  look_reason: string;
  items: OutfitItem[];
  tags: string[];
}

export const BODY_SHAPES = [
  "Hourglass",
  "Pear",
  "Apple",
  "Rectangle",
  "Inverted Triangle",
];

export const SKIN_TONES = ["Fair", "Light", "Medium", "Tan", "Deep", "Dark"];

export const OCCASIONS = [
  "College",
  "Party",
  "Date",
  "Festive",
  "Wedding",
  "Work",
];

export const VIBES: Record<string, string[]> = {
  female: ["Classic", "Boho", "Trendy", "Minimal", "Edgy", "Romantic"],
  male: ["Classic", "Trendy", "Minimal", "Street Style", "Smart Casual"],
};

export const PLATFORMS = ["Myntra", "Ajio", "Amazon", "Flipkart", "Meesho"];