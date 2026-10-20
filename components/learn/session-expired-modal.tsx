"use client";

import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  challengeId: string;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onClose,
  classId,
  challengeId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-[0_8px_0_#0f172a] space-y-4 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FEF08A] border-3 border-slate-900 flex items-center justify-center text-slate-900 shadow-[0_3px_0_#0f172a]">
          <LogOut className="w-7 h-7" />
        </div>
        <h3 className="font-display font-black text-lg text-slate-900">
          Sesi Login Anda Telah Habis
        </h3>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Sesi login Anda telah berakhir. Silakan login kembali untuk menyimpan progres level, poin XP, dan rekor streak Anda.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href={`/login?redirect=/classes/${classId}/learn/${challengeId}`}
            className="w-full py-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-sm border-2 border-slate-900 shadow-[0_3px_0_#991b1b] text-center transition-all cursor-pointer"
          >
            Login Kembali
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border-2 border-slate-900 font-display font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer shadow-[0_2px_0_#0f172a]"
          >
            Tetap Belajar (Mode Tamu)
          </button>
        </div>
      </div>
    </div>
  );
};
