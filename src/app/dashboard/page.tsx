"use client";

import Sidebar from "../components/Sidebar";
import Image from "next/image";
import AIChat from "../components/AIChat";
import Notifications from "../components/Notifications";
import Deliveries from "../components/Deliveries";
import { useAppState } from "@/app/context/AppStateContext";
import { FaSpinner } from "react-icons/fa"; // Spinner Icon

import { FaCalendarAlt, FaComments, FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import i18n from "@/app/i18n"; // Import the i18n instance

export default function Dashboard() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [isLangSwitching, setIsLangSwitching] = useState(false);

  const { state, dispatch } = useAppState();
  const { deliveryDetails } = state;

  useEffect(() => {
    // Set initial language on first render
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage(language); // Initialize i18next with the initial language
  }, [language]);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-b from-[#0e1122] to-[#0b0e22] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center p-6 bg-[#0e1122]">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/xx.png"
              alt="Logo"
              height={250}
              width={250}
              className=""
            />
          </div>
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={async () => {
                if (isLangSwitching) return;
                setIsLangSwitching(true);

                const newLang = language === "ar" ? "en" : "ar";
                setLanguage(newLang);
                localStorage.setItem("language", newLang);
                document.documentElement.lang = newLang;
                document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
                setIsLangSwitching(true);
                dispatch({ type: "SET_LOADING", payload: true }); // ✅ Start Overlay

                try {
                  const res = await fetch(
                    "https://portiq.croncore.com/api/chat/",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        response: {
                          user_input: false,
                          lang: newLang,
                          shipment_id: deliveryDetails?.DeliveryID || "",
                        },
                      }),
                    }
                  );

                  if (!res.ok) {
                    console.error("API Error:", res.status, res.statusText);
                    return;
                  }

                  dispatch({ type: "CLEAR_CHAT" });

                  const data = await res.json();
                  const result = data.result;

                  dispatch({
                    type: "ADD_CHAT",
                    payload: {
                      sender: "assistant",
                      text: `${result.greeting}\n\n${result.shipment_suggestion.message}`,
                    },
                  });

                  dispatch({
                    type: "SET_DELIVERY_DETAILS",
                    payload: result.delivery_details,
                  });

                  if (result.shipment_suggestion?.port) {
                    dispatch({
                      type: "SET_SUGGESTED_SHIPMENT_PORT",
                      payload: result.shipment_suggestion.port,
                    });
                  }

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
                } catch (error) {
                  console.error("Fetch Error:", error);
                } finally {
                  setIsLangSwitching(false);
                  dispatch({ type: "SET_LOADING", payload: false }); // ✅ Stop Overlay
                }
              }}
              disabled={isLangSwitching}
              className={`bg-[#1e2045] text-white px-4 py-2 rounded-full text-sm hover:bg-[#2C2F36] transition flex items-center justify-center gap-2 ${
                isLangSwitching ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLangSwitching ? (
                <>
                  <FaSpinner className="animate-spin" /> Loading...
                </>
              ) : language === "ar" ? (
                "English"
              ) : (
                "العربية"
              )}
            </button>

            <IconButton icon={<FaCalendarAlt />} />
            <IconButton icon={<FaComments />} />
            <IconButton icon={<FaBell />} />
            <Image
              src="/images/image.png"
              alt="User Avatar"
              height={40}
              width={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6 space-y-6">
          <div className="flex flex-1 lg:flex-row flex-col gap-6">
            <div style={{ flex: 2 }}>
              <AIChat />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <Deliveries />
              <Notifications />
              {state.isLoading && (
                <div className="fixed inset-0 bg-gradient-to-b from-[#181e3d] to-[#0b0e22] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="text-white text-lg flex items-center gap-3">
                    <FaSpinner className="animate-spin text-2xl" /> Processing
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="bg-[#1e2045] p-3 rounded-full hover:bg-[#2C2F36] transition">
      {icon}
    </button>
  );
}
