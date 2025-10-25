import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RestaurantMenu from "../../components/Restaurants/RestaurantMenu";
import { deleteMenuItem, updateMenuItem } from "../../api/ownerRestaurantService";
import MenuItemForm from "../../components/forms/MenuItemForm";

const RestaurantMenuLoaderOwner = () => {
    const [menu, setMenu] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    const { state } = useLocation();
    const restaurant = state;
    const restaurantMenu = restaurant?.menu || [];

    useEffect(() => {
        if (restaurantMenu) setMenu(restaurantMenu);
    }, [restaurantMenu])

    const handleEdit = async (itemId) => {
        const item = menu.find((m) => m.id === itemId);
        if (item) setEditingItem(item);
    };

    const handleUpdate = async (updatedItem) => {
        try {
            await updateMenuItem(restaurant.id, updatedItem);
            setMenu((prev) => prev.map((m) => (m.id === updatedItem.id ? updatedItem : m)));
            setEditingItem(null);
            alert("Jelo je uspesno azurirano!");
        } catch (err) {
            alert("Greska pri azuriranju jela.");
        }
    };
    

    const handleDelete = async (itemId) => {
        try {
            await deleteMenuItem(restaurant.id, itemId);

            setMenu((prev) => prev.filter((m) => m.id !== itemId));

            alert("Jelo je uspesno obrisano.");
        } catch (err) {
            alert("Doslo je do greske pri brisanju jela.");
        }
    };

    return (
        <div className="menu-page">
            <div className="menu-header">
                <h1>Meni restorana: {restaurant.name}</h1>
                <button
                    className="btn-primary"
                    onClick={() => setEditingItem({ name: "", description: "", price: 0 })}
                    title="Dodaj novo jelo"
                >
                    +
                </button>
            </div>
            <RestaurantMenu menu={menu} role="owner" onEdit={handleEdit} onDelete={handleDelete} />

            {editingItem && (
                <MenuItemForm
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
};

export default RestaurantMenuLoaderOwner;