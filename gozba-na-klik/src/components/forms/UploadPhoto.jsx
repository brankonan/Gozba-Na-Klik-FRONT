import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { uploadUserPhoto, deleteUserPhoto } from "../../api/userService";
import UserAvatar from "../shared/UserAvatar";

const UploadPhoto = () => {
  const { id } = useParams();
  const userId = Number(id);

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  // korisnik iz localStorage-a
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!["image/jpeg", "image/png"].includes(f.type)) {
      alert("Dozvoljeno je uploadovati .jpg ili .png fajl.");
      return;
    }
    setFile(f);
  }

  async function onUpload() {
    if (!file) return;
    setBusy(true);
    try {
      const { avatarUrl } = await uploadUserPhoto(userId, file);

      const updated = { ...(user || {}), profilePicture: avatarUrl };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setFile(null);

      alert("Profilna slika uspešno sačuvana.");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Greška pri slanju slike.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!window.confirm("Ukloniti profilnu sliku?")) return;
    setBusy(true);
    try {
      await deleteUserPhoto(userId);

      const updated = { ...(user || {}), profilePicture: null };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setFile(null);

      alert("Profilna slika uklonjena.");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Greška pri uklanjanju slike.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="profile-avatar-block">
      <div className="profile-avatar-block__avatar">
        <UserAvatar size={120} srcOverride={previewUrl} />
      </div>

      <div className="profile-avatar-block__content">
        <h3 className="profile-avatar-block__title">Profilna fotografija</h3>

        <div className="profile-avatar-block__upload-row">
          <label className="profile-avatar-block__file-label">
            Izaberi fajl
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={onPick}
              disabled={busy}
            />
          </label>

          <span className="profile-avatar-block__file-name">
            {file?.name || "Nijedan fajl nije izabran"}
          </span>
        </div>

        {file && (
          <span className="help">
            Pregled je privremen – klikni <b>Upload</b> da bi sačuvao sliku.
          </span>
        )}

        <div className="profile-avatar-block__buttons">
          <button
            className="btn btn--primary"
            onClick={onUpload}
            disabled={!file || busy}
          >
            {busy ? "Slanje..." : "Upload"}
          </button>

          <button
            className="btn btn--outline"
            onClick={() => setFile(null)}
            disabled={!file || busy}
          >
            Otkaži
          </button>

          <button
            className="btn btn--ghost"
            onClick={onDelete}
            disabled={busy || !user?.profilePicture}
          >
            Ukloni fotografiju
          </button>
        </div>
      </div>
    </section>
  );
};

export default UploadPhoto;
