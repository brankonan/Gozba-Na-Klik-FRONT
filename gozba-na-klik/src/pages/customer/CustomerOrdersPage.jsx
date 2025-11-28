import React, { useEffect, useState } from "react";
import { getCustomerOrders } from "../../api/orderService";

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getUser();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getCustomerOrders(user.id);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Ne mogu da učitam porudžbine.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  if (!user) {
    return <p>Morate biti prijavljeni da biste videli svoje porudžbine.</p>;
  }

  if (loading) {
    return <p>Učitavanje porudžbina...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // statusi koje smatramo "aktivnim"
  const activeStatuses = [
    "NA_CEKANJU",
    "PRIHVACENA",
    "PREUZIMANJE_U_TOKU",
    "DOSTAVA_U_TOKU",
  ];

  const activeOrders = orders.filter((o) => activeStatuses.includes(o.status));
  const historyOrders = orders.filter(
    (o) => !activeStatuses.includes(o.status)
  );

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("sr-RS");
  };

  const formatStatus = (status) => {
    switch (status) {
      case "NA_CEKANJU":
        return "Na čekanju";
      case "PRIHVACENA":
        return "Prihvaćena";
      case "PREUZIMANJE_U_TOKU":
        return "Preuzimanje u toku";
      case "DOSTAVA_U_TOKU":
        return "Dostava u toku";
      case "ZAVRSENA":
        return "Završena";
      case "OTKAZANA":
        return "Otkazana";
      default:
        return status;
    }
  };

  return (
    <div className="orders-page">
      <h1>Moje porudžbine</h1>

      {/* Aktivne porudzbine */}
      <section className="orders-section">
        <h2>Aktivne porudžbine</h2>
        {activeOrders.length === 0 ? (
          <p>Trenutno nemate aktivnih porudžbina.</p>
        ) : (
          <div className="orders-list">
            {activeOrders.map((o) => (
              <div key={o.id} className="order-card order-card--active">
                <div className="order-card-header">
                  <span className="order-id">#{o.id}</span>
                  <span className="order-status">{formatStatus(o.status)}</span>
                </div>
                <div className="order-card-body">
                  <p>
                    <strong>Restoran:</strong>{" "}
                    {o.restaurantName ?? o.restaurantId}
                  </p>
                  {o.createdAt && (
                    <p>
                      <strong>Vreme porudžbine:</strong>{" "}
                      {formatDate(o.createdAt)}
                    </p>
                  )}
                  <p>
                    <strong>Ukupno:</strong> {o.total.toFixed(2)} RSD
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Istorija porudzbina */}
      <section className="orders-section">
        <h2>Istorija porudžbina</h2>
        {historyOrders.length === 0 ? (
          <p>Još uvek nemate završene porudžbine.</p>
        ) : (
          <div className="orders-list">
            {historyOrders.map((o) => (
              <div key={o.id} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">#{o.id}</span>
                  <span className="order-status">{formatStatus(o.status)}</span>
                </div>
                <div className="order-card-body">
                  <p>
                    <strong>Restoran:</strong>{" "}
                    {o.restaurantName ?? o.restaurantId}
                  </p>
                  {o.createdAt && (
                    <p>
                      <strong>Vreme porudžbine:</strong>{" "}
                      {formatDate(o.createdAt)}
                    </p>
                  )}
                  <p>
                    <strong>Ukupno:</strong> {o.total.toFixed(2)} RSD
                  </p>

                  {o.items && o.items.length > 0 && (
                    <details className="order-items-details">
                      <summary>Stavke porudžbine</summary>
                      <ul>
                        {o.items.map((it) => (
                          <li key={it.id}>
                            ID jela: {it.menuItemId} – {it.price.toFixed(2)} RSD
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerOrdersPage;
