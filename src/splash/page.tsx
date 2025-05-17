"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppState } from "@/app/context/AppStateContext";

export default function SplashScreen() {
  const router = useRouter();
  const { dispatch } = useAppState();

  useEffect(() => {
    const init = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const res = await fetch("https://portiq.croncore.com/api/chat/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            response: { user_input: false, lang: "ar", shipment_id: false },
          }),
        });

        if (!res.ok) {
          console.error("API Error:", res.status, res.statusText);
          return;
        }

        const data = await res.json();
        const result = data.result;

        console.log("API Response:", result);

        if (!result) {
          console.error("API returned invalid structure:", data);
          return;
        }

        // Add greeting and shipment suggestion to chat
        dispatch({
          type: "ADD_CHAT",
          payload: {
            sender: "assistant",
            text: `${result.greeting}\n\n${result.shipment_suggestion.message}`,
          },
        });

        // Update Delivery Details
        dispatch({
          type: "SET_DELIVERY_DETAILS",
          payload: result.delivery_details,
        });

        // 👈 Store Suggested Shipment Port Separately
        if (result.shipment_suggestion?.port) {
          dispatch({
            type: "SET_SUGGESTED_SHIPMENT_PORT",
            payload: result.shipment_suggestion.port,
          });
        }

        // Before router.push("/dashboard");
        dispatch({
          type: "SET_NOTIFICATIONS",
          payload: [
            {
              text: result.notifications.shipment_status_updates,
              time: "Just now",
              color: "bg-sky-400",
            },
          ],
        });

        // Navigate to Dashboard after successful load
        router.push("/dashboard");
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    init();
  }, [dispatch, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#181e3d] to-[#0b0e22] z-50 w-full h-full">
      {/* <h1 className="text-white text-2xl animate-pulse">
        
      </h1> */}
      <Image
        src="/images/xx.png"
        alt="Logo1"
        height={300}
        width={300}
        className="animate-pulse"
      />
    </div>
  );
}
