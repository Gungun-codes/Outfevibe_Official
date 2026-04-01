// Outfevibe Service Worker — handles push notifications

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "Outfevibe", body: event.data.text() };
  }

  const title = data.title || "Outfevibe ✨";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/outfevibe_logo.png",
    badge: "/outfevibe_logo.png",
    image: data.image || null,
    data: { url: data.url || "https://www.outfevibe.com" },
    actions: data.actions || [
      { action: "open", title: "View" },
      { action: "close", title: "Dismiss" },
    ],
    vibrate: [100, 50, 100],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "close") return;

  const url = event.notification.data?.url || "https://www.outfevibe.com";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});