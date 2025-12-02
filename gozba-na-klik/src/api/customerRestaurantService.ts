import api from "./axios";

export async function getAll() {
    const result = await api.get(`/customer/restaurants`);
    return result.data;
}

export async function getMostRecentRestaurants(userId : number){
    const result = await api.get(`/customer/restaurants/recent`, { params: { userId }});
    return result.data;
}

export async function getFavouriteRestaurants(userId : number){
    const result = await api.get(`/customer/restaurants/favourites`, { params: { userId }});
    return result.data;
}

export async function getTopRatedRestaurants(){
    const result = await api.get('/customer/restaurants/top-rated');
    return result.data;
}
