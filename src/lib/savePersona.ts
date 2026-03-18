import { supabase } from "@/lib/supabase";

export async function savePersonaToProfile(
  userId: string,
  persona: string,
  answers: Record<number, string | string[]>
) {
  const { error } = await supabase
    .from("quiz_result")
    .upsert(
      {
        user_id: userId,
        persona_name: persona,
        quiz_answers: answers,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) {
    console.error("Failed to save persona:", error);
    throw error;
  }
}