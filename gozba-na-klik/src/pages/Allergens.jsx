import { getAllergensAsync } from "../api/userService";
import React, { useEffect, useState } from "react";
import eggs from "../assets/icons/eggs.svg";
import fish from "../assets/icons/fish.svg";
import lactose from "../assets/icons/lactose.svg";
import nuts from "../assets/icons/nuts.png";
import peanuts from "../assets/icons/peanuts.png";
import shellfish from "../assets/icons/shellfish.png";
import soy from "../assets/icons/soy.svg";
import gluten from "../assets/icons/gluten.svg";
import "../styles/allergens.scss";

export const Allergens = ({ userId, refresh }) => {
    const [allergens, setAllergens] = useState([]);

    const allIcons = {
        eggs,
        fish,
        lactose,
        nuts,
        peanuts,
        shellfish,
        soy,
        gluten,
    };


    useEffect(() => {

        const fetchAllergens = async () => {
            try {
                const data = await getAllergensAsync(userId);
                setAllergens(data);
                console.log(data);
            }
            catch {
                alert("Dogodila se greska pri ucitavanju alergena!");
            }
        }
        fetchAllergens();
    }, [userId, refresh])

    return (
        <div className="allergens">
            {allergens.length === 0 ?
                (<p>Nema alergena</p>) :
                (allergens.map((a) => <img
                    key={a.id}
                    src={allIcons[a.name.toLowerCase()]}
                    className="allergen-icon" 
                    title={a.name}/>
                ))
            }
        </div>)
}

export default Allergens;