"use client";
import { useAppState } from "@/app/context/AppStateContext";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Notifications() {
  const { state } = useAppState();
  const { t } = useTranslation(); // Add the useTranslation hook
  const notifications = state.notifications;

  return (
    <div className="bg-[#131738] w-full rounded-3xl p-6 shadow-lg flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-white">
          {t("notifications.title")} {/* Translate the title */}
        </h2>
        <Image
          src="/images/icon.png"
          alt="Logo"
          height={20}
          width={20}
          className="w-10 h-10 rotate-on-rtl"
        />
      </div>
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="flex items-start gap-3 text-sm bg-[#2D3254]  p-3 rounded-3xl"
          >
            <span className={`mt-1 ${n.color} rounded-full h-3 w-3`} />
            <div className="flex-1">
              <p>{n.text}</p> {/* Dynamic text; translation depends on data */}
              <p className="text-gray-400 text-xs">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
