import api from "./axios";

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/feature/upload-users-photo
