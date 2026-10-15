import React from "react";
import { ShieldCheck } from "lucide-react";

export const AmbangKerahasiaanCard: React.FC = () => {
  return (
    <div className="da-privacy-card">
      <div className="da-privacy-icon" aria-hidden="true">
        <ShieldCheck size={16} />
      </div>
      <div className="da-privacy-content">
        <p>Ambang kerahasiaan</p>
        <p>
          Nilai rekan &amp; bawahan tampil bila minimal{" "}
          <strong style={{ color: "#1e293b" }}>2 selesai per kategori</strong>. Jika kurang,
          keduanya digabung; bila tetap kurang dari 2, tidak ditampilkan.
        </p>
      </div>
    </div>
  );
};
