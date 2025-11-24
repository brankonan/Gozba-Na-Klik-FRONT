import api from "./axios";


interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    photoPath: string;
    restaurantId: number;
}

export async function getAll(ownerId: number) {
    const result = await api.get(`/owner/restaurants?ownerId=${ownerId}`);
    return result.data;
}

export async function updateMenuItem(restaurantId: number, menuItem: MenuItem) {
    try {
        const result = await api.put(`owner/restaurants/${restaurantId}/menu/${menuItem.id}`, menuItem);
        return result.data;
    }
    catch (err) {
        console.error("Greska pri azuriranju jela:", err);
        throw err;
    }
}

export async function deleteMenuItem(restaurantId: number, menuItemId: number) {
    try {
        await api.delete(`owner/restaurants/${restaurantId}/menu/${menuItemId}`);
    } 
    catch (err) {
        console.error("Greska pri brisanju jela:", err);
        throw err;
    }
}

export async function createMenuItem(restaurantId: number, menuItem: MenuItem) {
    try{
        const result = await api.post(`owner/restaurants/${restaurantId}/menu`, menuItem);
        return result.data;
    }
    catch (err) {
        console.error("Greska pri kreiranju jelaL:", err);
        throw err;
    }
}