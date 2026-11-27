import React from "react";
import { AlumniProfile } from "./types";

interface AlumniIdentityCardProps {
  profile: AlumniProfile;
}

export const AlumniIdentityCard: React.FC<AlumniIdentityCardProps> = ({ profile }) => {
  return (
    <section className="da-card da-identity-card" aria-label="Profil Alumni">
      <div className="da-identity-wrapper">
        {/* Left Section: Avatar & Info */}
        <div className="da-identity-left">
          <div className="da-identity-avatar" aria-hidden="true">
            {profile.avatarText}
          </div>
          <div className="da-identity-info">
            <h1 className="da-identity-name">{profile.nama}</h1>
            <p className="da-identity-nip">{profile.nip}</p>
            <p className="da-identity-role">
              {profile.jabatan}
              <span className="da-identity-dot">·</span>
              {profile.unitKerja}
            </p>
          </div>
        </div>

        {/* Right Section: 3-column stats */}
        <div className="da-identity-stats">
          <div className="da-stat-item">
            <span className="da-stat-label">Lulus LMS</span>
            <span className="da-stat-value">{profile.lulusLms}</span>
          </div>
          <div className="da-stat-item">
            <span className="da-stat-label">Sharing KMS</span>
            <span className="da-stat-value">{profile.sharingKms}</span>
          </div>
          <div className="da-stat-item">
            <span className="da-stat-label">Masa Pengisian</span>
            <span className="da-stat-value">{profile.masaPengisian}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
