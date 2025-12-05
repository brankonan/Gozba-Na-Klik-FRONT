import api from "./axios";

export async function getAll() {
    const result = await api.get(`/customer/restaurants`);
    return result.data;
}

export async function getMostRecentRestaurants(userId: number) {
    const result = await api.get(`/customer/restaurants/recent`, { params: { userId } });
    return result.data;
}

export async function getFavouriteRestaurants(userId: number) {
    const result = await api.get(`/customer/restaurants/favourites`, { params: { userId } });
    return result.data;
}

export async function getTopRatedRestaurants() {
    const result = await api.get('/customer/restaurants/top-rated');
    return result.data;
}

export async function getRestaurantsPaged(params: PagedRequest): Promise<PagedResult> {

    const { page, pageSize, sortBy, sortDir, filter } = params;

    const query: Record<string, string | number> = {
        page,
        pageSize,
    };

    if (sortBy) query.sortBy = sortBy;
    if (sortDir) query.sortDir = sortDir;

    if (filter) {
        if (filter.name) query.name = filter.name;
        if (filter.capacity !== undefined) query.minCapacity = filter.capacity;
    }

    const result = await api.get("/customer/restaurants/paged", { params: query });

    return result.data;
}

interface RestaurantFilter {
    name?: string;
    capacity?: number;
}

interface PagedRequest {
    page: number;
    pageSize: number;
    sortBy?: string | null;
    sortDir?: "asc" | "desc";
    filter?: RestaurantFilter;
}

interface PagedResult<T = any> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
}