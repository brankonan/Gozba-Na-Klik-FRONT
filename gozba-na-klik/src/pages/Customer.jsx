import React from "react";
import { useParams } from "react-router-dom";
import { uploadUserPhoto, deleteUserPhoto } from "../api/userService";
import "../styles/index.scss";
import UserAvatar from "../components/UserAvatar";

const Customer = () => {
  const { id } = useParams();
  const userId = Number(id);

  // ucitavanje usera iz localstorage-a (login ga cuva)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [file, setFile] = useStae(null);
  const [busy, setBusy] = useStae(false);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/jpeg", "image/png"].includes(f.type)) {
      alert("Dozvoljeno: .jpg ili .png");
      return;
    }
    setFile(f);
  }

  async function onUpload() {
    if (!file) return;
    setBusy(true);
    try {
      const { avatarUrl } = await uploadUserPhoto(userId, file);

      //osveziti localstorage
      const updated = { ...(user || {}), profilePicture: avatarUrl };
      localStorage.setItem("user", JSON.stringify(updated));

      setUser(updated);
      setFile(null);
      alert("Prifilna slika uspesno sacuvana.");
      window.location.reload();
    } catch (e) {
      alert("Greska pri slanju slike.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirm("Ukloniti profilnu sliku?")) return;
    setBusy(true);
    try {
      await deleteUserPhoto(userId);
      const updated = { ...(user || {}), profilePicture: null };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setFile(null);
      alert("Prfilna slika uklonjena");
      window.location.reload();
    } catch (e) {
      alert("Greska pri uklanjanju.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner container" style={{ fontWeight: 800 }}>
          Moj profil
        </div>
        <UserAvatar />
      </header>
      <main className="section">
        <div className="container" style={{ maxWidth: 680 }}>
          <div className="card card-pad stack">
            <h2 style={{ margin: 0 }}>Moj Profil</h2>

            <div className="row" style={{ gap: 24, alignItems: "center" }}>
              {/* Veliki avatar sa PREVIEW */}
              <UserAvatar size={120} srcOverride={previewUrl} />

              <div className="stack">
                <input
                  type="file"
                  accept="image/png,img/jpeg"
                  onChange={onPick}
                  disabled={busy}
                />
                {file && (
                  <span className="help">
                    Pregled je priveremen-klikni Upload da bi sacuvao.
                  </span>
                )}

                <div className="row">
                  <button
                    className="btn btn-primary"
                    onClick={onUpload}
                    disabled={!file || busy}
                  >
                    {busy ? "Slanje..." : "Upload"}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setFile(null)}
                    disabled={!file || busy}
                  >
                    Otkazi
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={onDelete}
                    disabled={busy || !user?.profilePicture}
                  >
                    Ukloni fotografiju
                  </button>
                </div>
              </div>
            </div>

            {/* Ovde Pero mozes da ubacis logiku za dalje informacije o profilu/adresama/alergenima */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Customer;
