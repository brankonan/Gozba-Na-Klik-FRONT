import api from "./axios";

const RESOURCE = "/users"

export interface UpdateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    allergens: string[]
}


export const updateAsync = async (updateUserDto: UpdateUserDto, id: number) => {
    //DODATI ADRESU ZA ENDPOINT 
    const response = await api.put(`${RESOURCE}/${id}`, updateUserDto);

    return response.data;
}

export const getAllergensAsync = async (id: number) => {
    const response = await api.put(`/`);

    return response.data;
}

export async function uploadUserPhoto(userId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/users/${userId}/photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as { avatarUrl: string };
}

export async function deleteUserPhoto(userId: number) {
  await api.delete(`/users/${userId}/photo`);
}
