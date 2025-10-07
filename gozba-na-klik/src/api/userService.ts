import api from "./axios";

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
