import axios from "axios";

export const getListItem = async () => {};
export const openVideo = async (url: string | undefined) => {
  await axios.post("http://127.0.0.1:3000/api/videos/play", {
    url,
  });
};
