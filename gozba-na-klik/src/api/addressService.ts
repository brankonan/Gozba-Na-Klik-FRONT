import api from "./axios";

export interface AddressDto {
    id: number;
    street: string;
    houseNumber: number;
    city: string;
    userId: number;
}

export interface AddressInputDto {
    street: string;
    houseNumber: number;
    city: string;
}

export interface AddressUpdateDto {
    street: string;
    houseNumber: number;
    city: string;
}

const RESOURCE = "/customers";

export const getAddressesAsync = async (customerId: number): Promise<AddressDto[]> => {
    const response = await api.get(`${RESOURCE}/${customerId}/addresses`);
    return response.data;
};

export const getAddressAsync = async (customerId: number, addressId: number): Promise<AddressDto> => {
    const response = await api.get(`${RESOURCE}/${customerId}/addresses/${addressId}`);
    return response.data;
};

export const createAddressAsync = async (customerId: number, addressDto: AddressInputDto): Promise<AddressDto> => {
    const response = await api.post(`${RESOURCE}/${customerId}/addresses`, addressDto);
    return response.data;
};

export const updateAddressAsync = async (customerId: number, addressId: number, addressDto: AddressUpdateDto): Promise<AddressDto> => {
    const response = await api.put(`${RESOURCE}/${customerId}/addresses/${addressId}`, addressDto);
    return response.data;
};

export const deleteAddressAsync = async (customerId: number, addressId: number): Promise<void> => {
    await api.delete(`${RESOURCE}/${customerId}/addresses/${addressId}`);
};
