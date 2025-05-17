"use client";

import { FaClock } from "react-icons/fa";
import Image from "next/image";
import { useAppState } from "@/app/context/AppStateContext";
import { useTranslation } from "react-i18next";

export default function Deliveries() {
  const { state } = useAppState();
  const { t, i18n } = useTranslation();

  // Debug the current language
  console.log("Current language:", i18n.language);

  const delivery = state.deliveryDetails;

  if (!delivery) {
    return (
      <div className="bg-gradient-to-l from-[#0d113c] to-[#10132c] rounded-3xl w-full p-6 flex-1 text-white">
        <h2 className="text-3xl font-semibold mb-4">
          {t("deliveries.title", "Deliveries")}
        </h2>
        <p>{t("deliveries.noData", "No delivery data available")}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-l from-[#0d113c] to-[#10132c] rounded-3xl w-full p-6 space-y-4 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold text-white">
          {t("deliveries.title", "Deliveries")}
        </h2>
        <Image
          src="/images/icon.png"
          alt="Logo"
          height={20}
          width={20}
          className="w-10 h-10 rotate-on-rtl"
        />
      </div>

      <div className="p-4 rounded-lg space-y-2 text-white relative">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {t("deliveries.deliveryId", "Delivery ID")}
          </p>
          <span className="bg-[#FF7A59] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
            {delivery.Status}
          </span>
        </div>
        <p className="font-bold">{delivery.DeliveryID}</p>

        <p className="text-gray-400 text-sm mt-2">
          {t("deliveries.port", "Port")}
        </p>
        <p>{delivery.Port}</p>

        <p className="text-gray-400 text-sm mt-2">
          {t("deliveries.container", "Container")}
        </p>
        <p className="text-teal-400">{delivery.Container}</p>

        <div className="flex items-center gap-1 text-sm mt-2 text-teal-400">
          <FaClock /> {t("deliveries.eta", "ETA")}: {delivery.ETA}
        </div>

        <p className="text-gray-400 text-sm mt-2">
          {t("deliveries.route", "Route")}
        </p>
        <p>{delivery.Route}</p>

        <div className="mt-4 flex gap-2">
          <button className="bg-gradient-to-r from-[#8974FF] to-[#149CFD] text-white rounded-md px-4 py-1 text-sm font-semibold">
            {t("deliveries.track", "Track")}
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-md px-4 py-1 text-sm font-semibold">
            {t("deliveries.modify", "Modify")}
          </button>
        </div>
      </div>
    </div>
  );
}
