import React from "react";
import { getAllergensAsync } from "../api/userService";

export const Allergens = async (userId) => {

    const allAllergens = await getAllergensAsync(userId);


    return(
        <div classname="allergens">
            {allAllergens.map((a)=>{
                <p>{a.Name}</p>
            })}
        </div>
    )
}

export default Allergens;