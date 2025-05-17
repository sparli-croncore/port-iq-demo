"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaPaperPlane } from "react-icons/fa";
import { useAppState } from "@/app/context/AppStateContext";
import { useTranslation } from "react-i18next";

export default function AIChat() {
  const { state, dispatch } = useAppState();
  const { t } = useTranslation(); // Add the useTranslation hook
  const { chatHistory, deliveryDetails, suggestedShipmentPort, notifications } =
    state;
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const lowerInput = input.toLowerCase().trim();
    const irrelevantResponses = ["hi", "hello", "how are you"];

    dispatch({ type: "ADD_CHAT", payload: { sender: "user", text: input } });
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("https://portiq.croncore.com/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: {
            user_input: input,
            shipment_id: deliveryDetails?.DeliveryID || "",
            suggested_port: suggestedShipmentPort || "",
            lang: localStorage.getItem("language") || "ar",
          },
        }),
      });

      if (!res.ok) return;

      const data = await res.json();
      const result = data.result;

      if (!result) return;
      console.log("API Response chat:", result);
      const assistantText = [result.message || ""].filter(Boolean).join("\n\n");

      dispatch({
        type: "ADD_CHAT",
        payload: {
          sender: "assistant",
          text: assistantText || t("aichat.noResponse"), // Translate fallback text
        },
      });

      // 🟢 Manage Notifications
      if (!irrelevantResponses.includes(lowerInput)) {
        const newNotifications = [...notifications];

        if (
          result.notifications?.shipment_status_updates &&
          !newNotifications.some(
            (n) => n.text === result.notifications.shipment_status_updates
          )
        ) {
          newNotifications.push({
            text: result.notifications.shipment_status_updates,
            time: new Date().toLocaleTimeString(),
            color: "bg-green-500",
          });
        }

        if (
          result.notifications?.rerouted_alert &&
          !newNotifications.some(
            (n) => n.text === result.notifications.rerouted_alert
          )
        ) {
          newNotifications.push({
            text: result.notifications.rerouted_alert,
            time: new Date().toLocaleTimeString(),
            color: "bg-yellow-500",
          });
        }

        dispatch({ type: "SET_NOTIFICATIONS", payload: newNotifications });
      }

      if (result.shipment_details) {
        const updatedDelivery = { ...result.shipment_details };
        if (result.shipment_suggestion?.port) {
          updatedDelivery.Route = result.shipment_suggestion.port;
        }
        dispatch({ type: "SET_DELIVERY_DETAILS", payload: updatedDelivery });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100;

    if (isNearBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  // Clear on Tab Close or Leave
  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        dispatch({ type: "CLEAR_CHAT" });
        dispatch({ type: "SET_NOTIFICATIONS", payload: [] });
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-r from-[#0d113c] to-[#10132c] rounded-3xl p-6 col-span-2 flex flex-col h-full max-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold text-white">
          {t("aichat.title")} {/* Translate the title */}
        </h2>
        <Image
          src="/images/icon.png"
          alt={t("aichat.logoAlt", "Logo")} // Translate alt text
          height={20}
          width={20}
          className="w-10 h-10 rotate-on-rtl"
        />
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] space-y-4 pr-2 custom-scrollbar"
      >
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-3xl text-md max-w-2xl leading-relaxed ${
              msg.sender === "assistant"
                ? "bg-[#FFFFFF33] text-gray-200 self-start"
                : "bg-gradient-to-r from-[#8974FF] to-[#149CFD] text-white self-end"
            }`}
            style={{ marginBottom: "12px" }}
          >
            {msg.text.split("\n").map((line, i) => (
              <p key={i} className="mb-2">
                {line}
              </p>
            ))}
          </div>
        ))}
        {isTyping && (
          <div className="self-start p-3 rounded-3xl text-sm bg-[#2D3254] text-gray-200 max-w-xs animate-pulse">
            {t("aichat.typing")} {/* Translate typing indicator */}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-[#2D3254] text-white p-2 rounded-3xl text-sm focus:outline-none"
          placeholder={t("aichat.placeholder")}
        />
        <button
          onClick={handleSend}
          className="text-white hover:text-gray-300 p-2 cursor-pointer rotate-on-rtl rounded-md"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
