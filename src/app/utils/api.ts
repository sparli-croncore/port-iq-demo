export const callChatAPI = async (userResponse: string | null) => {
  const res = await fetch("/port_iq/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_response: userResponse }),
  });
  return res.json();
};
