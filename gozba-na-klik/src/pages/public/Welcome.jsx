import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/index.scss";
import "../../styles/Welcome.scss";
import mainVideo from "../../videos/main-video.mp4";
import mainVideo2 from "../../videos/main-video-2.mp4";
import pronadjiRestoranImg from "../../images/pronadji-restoran.jpg";
import izaberiJelaImg from "../../images/izaberi-jela.jpg";
import pratiDostavuImg from "../../images/prati-dostavu.jpg";
import fastFoodImg from "../../images/fast-food.jpg";
import asianFoodImg from "../../images/asian-food.jpg";
import healthyFoodImg from "../../images/healty-food.jpg";
import sweetsImg from "../../images/sweets.jpg";
import highlightImg from "../../images/highlight.png";

export default function Welcome() {
  const navigate = useNavigate();

  const videos = [mainVideo, mainVideo2];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  return (
    <main className="welcome-page">
      {/* HERO SA VIDEO POZADINOM */}
      <section className="welcome-page__hero">
        <div className="welcome-page__video-wrapper">
          <video
            key={currentVideoIndex}
            className="welcome-page__bg-video"
            src={videos[currentVideoIndex]}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
          />
          <div className="welcome-page__overlay" />
        </div>

        <div className="welcome-page__hero-inner">
          <div className="welcome-page__pill">
            <span className="welcome-page__pill-dot" />
            Nova food-delivery platforma
          </div>

          <h1 className="welcome-page__title">Gozba na Klik</h1>
          <p className="welcome-page__subtitle">
            Poruči hranu iz svojih omiljenih restorana u par klikova. Brza
            dostava, pregledan meni i personalizovane preporuke – sve na jednom
            mestu.
          </p>

          <div className="welcome-page__cta">
            <button
              className="btn btn--primary btn--lg"
              onClick={() => navigate("/register")}
            >
              Registruj se
            </button>
            <button
              className="btn btn--outline btn--lg"
              onClick={() => navigate("/login")}
            >
              Prijavi se
            </button>
          </div>

          <p className="welcome-page__secondary-text">
            Već imaš nalog?{" "}
            <button
              className="welcome-page__link-btn"
              onClick={() => navigate("/login")}
            >
              Uloguj se ovde
            </button>
          </p>

          <div className="welcome-page__scroll-hint">
            <span>Pregledaj ponudu</span>
            <div className="welcome-page__scroll-icon" />
          </div>
        </div>
      </section>

      {/* OSTATAK STRANICE – PONUDE, SEKCIJE, SLIKE/IKONICE */}
      <section className="welcome-page__sections">
        {/* Kako radi */}
        <section className="welcome-section">
          <h2 className="welcome-section__title">
            Kako funkcioniše Gozba na Klik?
          </h2>
          <p className="welcome-section__subtitle">
            Jednostavan proces od želje za hranom do dostave na tvoja vrata.
          </p>

          <div className="welcome-section__grid">
            <div className="card welcome-card welcome-card--overlay">
              <div className="welcome-card__image">
                <img src={pronadjiRestoranImg} alt="Pronađi restoran" />
                <div className="welcome-card__overlay-content">
                  <h3>Pronađi restoran</h3>
                  <p>
                    Pregledaj restorane po tipu kuhinje, oceni ili lokaciji i
                    izaberi savršeno mesto za svoju sledeću gozbu.
                  </p>
                </div>
              </div>
            </div>

            <div className="card welcome-card welcome-card--overlay">
              <div className="welcome-card__image">
                <img src={izaberiJelaImg} alt="Izaberi jela" />
                <div className="welcome-card__overlay-content">
                  <h3>Izaberi jela</h3>
                  <p>
                    Dodaj jela u korpu, prilagodi sastojke i prati alergene. Sve
                    je pregledno i jasno prikazano.
                  </p>
                </div>
              </div>
            </div>

            <div className="card welcome-card welcome-card--overlay">
              <div className="welcome-card__image">
                <img src={pratiDostavuImg} alt="Prati dostavu" />
                <div className="welcome-card__overlay-content">
                  <h3>Prati dostavu</h3>
                  <p>
                    Nakon potvrde porudžbine možeš da pratiš status – od
                    pripreme u restoranu do kurira na tvojoj adresi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popularne kuhinje */}
        <section className="welcome-section">
          <h2 className="welcome-section__title">Nešto za svaku želju</h2>
          <p className="welcome-section__subtitle">
            Od brzog zalogaja do prave gozbe – sve na jednom mestu.
          </p>

          <div className="welcome-section__grid welcome-section__grid--4">
            <div className="card welcome-tag-card welcome-tag-card--image">
              <div className="welcome-tag-card__image">
                <img src={fastFoodImg} alt="Pizza & fast food" />
                <div className="welcome-tag-card__overlay">
                  <div className="welcome-tag-card__text">
                    <h3>Pizza & fast food</h3>
                    <p>Tanka, debela, dupla doza sira – ti biraš.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card welcome-tag-card welcome-tag-card--image">
              <div className="welcome-tag-card__image">
                <img src={asianFoodImg} alt="Azijska kuhinja" />
                <div className="welcome-tag-card__overlay">
                  <div className="welcome-tag-card__text">
                    <h3>Azijska kuhinja</h3>
                    <p>Sushi, wok i ramen za ljubitelje egzotike.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card welcome-tag-card welcome-tag-card--image">
              <div className="welcome-tag-card__image">
                <img src={healthyFoodImg} alt="Zdrave opcije" />
                <div className="welcome-tag-card__overlay">
                  <div className="welcome-tag-card__text">
                    <h3>Zdrave opcije</h3>
                    <p>Salate, bowl-ovi i lagani obroci za svaki dan.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card welcome-tag-card welcome-tag-card--image">
              <div className="welcome-tag-card__image">
                <img src={sweetsImg} alt="Deserti" />
                <div className="welcome-tag-card__overlay">
                  <div className="welcome-tag-card__text">
                    <h3>Deserti</h3>
                    <p>Kolači, torte i sladoledi za sladak kraj dana.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sekcija za “zašto baš mi” */}
        <section
          className="welcome-section welcome-section--highlight"
          style={{ backgroundImage: `url(${highlightImg})` }}
        >
          <div className="welcome-section__content welcome-section__content--highlight">
            <div className="welcome-section__text">
              <h2 className="welcome-section__title">
                Zašto baš Gozba na Klik?
              </h2>
              <p className="welcome-section__subtitle">
                Moderni dizajn, jasne informacije o alergenima, status kurira u
                realnom vremenu i jednostavna registracija za korisnike,
                vlasnike restorana i zaposlene.
              </p>
            </div>

            <ul className="welcome-list">
              <li className="welcome-list__item">
                <span className="welcome-list__text">
                  Jasno prikazani alergeni i sastojci
                </span>
              </li>
              <li className="welcome-list__item">
                <span className="welcome-list__text">
                  Kuriri sa definisanim rasporedom i statusima
                </span>
              </li>
              <li className="welcome-list__item">
                <span className="welcome-list__text">
                  Sistem recenzija i ocenjivanja restorana
                </span>
              </li>
              <li className="welcome-list__item">
                <span className="welcome-list__text">
                  Prilagođeno i za vlasnike restorana i za kupce
                </span>
              </li>
            </ul>
          </div>

          {/* Dugme centrirano u sredini kartice */}
          <div className="welcome-page__cta welcome-page__cta--highlight">
            <button
              className="btn btn--secondary btn--lg"
              onClick={() => navigate("/register")}
            >
              Započni svoju prvu porudžbinu
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
