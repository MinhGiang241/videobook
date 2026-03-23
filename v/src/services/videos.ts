import axios from "axios";

export const getListItem = async () => {};
export const openVideo = async (url: string | undefined) => {
  await axios.post(`${process.env.NEXT_PUBLIC_LOCAL}/api/videos/play`, {
    url,
  });
};
