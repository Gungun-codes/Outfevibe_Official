import { supabase } from "@/lib/supabase";

export async function savePersonaToProfile(
  userId: string,
  persona: string,
<<<<<<< HEAD
  answers: Record<number, string | string[]>
=======
  answers: Record<number, string | string[]>,
  userEmail?: string  // ← add this parameter
>>>>>>> origin/main
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
<<<<<<< HEAD
=======

  // ── Trigger notifications after successful save ──
  try {
    // Push notification
    fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "quiz_completed",
        payload: persona,
        userId,
      }),
    });

    // Email notification (only if email provided)
    if (userEmail) {
      fetch("/api/notify/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quiz_completed",
          to: userEmail,
          payload: persona,
        }),
      });
    }
  } catch (err) {
    // Notifications failing should never break the quiz flow
    console.error("Notification error:", err);
  }
>>>>>>> origin/main
}