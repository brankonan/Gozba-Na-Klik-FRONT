import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RestaurantMenu from "../../components/Restaurants/RestaurantMenu";
import { deleteMenuItem, updateMenuItem, createMenuItem } from "../../api/ownerRestaurantService";
import MenuItemForm from "../../components/forms/MenuItemForm";

const RestaurantMenuLoaderOwner = () => {
    const [menu, setMenu] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    const { state: restaurant } = useLocation();

    useEffect(() => {
        setMenu(restaurant.menu);
    }, [restaurant.menu]);


    const handleEdit = async (itemId) => {
        const item = menu.find((m) => m.id === itemId);
        if (item) setEditingItem(item);
    };

    const handleSave = async (item) => {
        const isEdit = !!item.id;

        try {
            if (isEdit) {
                const response = await updateMenuItem(restaurant.id, item);
                const updatedItem = response.data ?? item;

                setMenu((prev) =>
                    prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                );
                alert("Jelo je uspesno azurirano!");
            }
            else {
                const createdItem = await createMenuItem(restaurant.id, item);

                setMenu((prev) => [...prev, createdItem]);
                alert("Jelo je uspesno dodato!");
            }

            setEditingItem(null);

        }
        catch (err) {
            console.log(err);
            alert("Doslo je do greske pri cuvanju jela.");
        }
    };

    const handleAddNew = () => {
        setEditingItem({
            name: "",
            description: "",
            price: 0,
            photoPath: "",
        });
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
                <h1>{restaurant.name}</h1>
                <button
                    className="btn btn-primary"
                    onClick={handleAddNew}
                    title="Dodaj novo jelo"
                >
                    Dodaj novo jelo
                </button>
            </div>

            <RestaurantMenu
                menu={menu}
                role="owner"
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {editingItem && (
                <MenuItemForm
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    handleSave={handleSave}
                />
            )}
        </div>
    );
};

export default RestaurantMenuLoaderOwner;