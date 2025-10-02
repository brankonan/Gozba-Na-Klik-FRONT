import api from "./axios";

const RESOURCE = "/users"

export interface UpdateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    // profilePic: string;
}


export const updateAsync = async (updateUserDto: UpdateUserDto, id: number) => {
    //DODATI ADRESU ZA ENDPOINT 
    const response = await api.put(`/update/${id}`, updateUserDto);

    return response.data;
}

export const getAllergensAsync = async (id: number) => {
    const response = await api.put(`/`);

    return response.data;
}