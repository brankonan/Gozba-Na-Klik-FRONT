import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/index.scss";
import { activateAccountAsync } from "../../api/authService";

const ActivateAccount = () => {
  const [status, setStatus] = useState("status");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("Token") || "";

    if (!token) {
      setStatus("error");
      setMessage("Nedostaje token za aktivaciju");
      return;
    }

    const run = async () => {
      try {
        setStatus("loading");
        const data = await activateAccountAsync(token);
        setStatus("success");
        setMessage(
          (data && data.message) ||
            "Nalog je aktiviran. Sada se mozes ulogovati."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } catch (error) {
        setStatus("error");
        setMessage("Nevalidan ili istekao token za aktivaciju");
      }
    };

    run();
  }, [searchParams, navigate]);

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card card-pad stack">
          <h2 style={{ margin: 0 }}>Aktivacija naloga</h2>

          {status === "loading" && <p>Aktivacija u toku...</p>}

          {status === "success" && (
            <p style={{ color: "green" }}>
              {message} Bices prebacen na login uskoro...
            </p>
          )}

          {status === "error" && <p style={{ color: "red" }}>{message}</p>}
        </div>
      </div>
    </main>
  );
};

export default ActivateAccount;
