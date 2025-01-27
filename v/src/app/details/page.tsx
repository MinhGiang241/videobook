/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ResultResponseDetails } from "@/interface/api";
import { Video } from "@/interface/data";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "antd";
import { openVideo } from "../services/videos";

export default function DetailsPage() {
  const search = useSearchParams();
  const id = search.get("id");
  console.log("id", id);

  const [video, setVideo] = useState<Video | undefined>();
  const getDetailsVideo = async () => {
    const res: ResultResponseDetails = await axios.post(
      "http://127.0.0.1:3000/api/videos/details",
      {
        id,
      },
    );
    console.log("res ", res);

    if (res.status != 200) {
      toast.error("Error");
    } else if (res.data?.success) {
      setVideo(res.data?.video);
    } else {
      toast.error(res.data?.error);
    }
  };

  const formatDate: any = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  useEffect(() => {
    getDetailsVideo();
  }, []);
  return (
    <>
      {video ? (
        <div className="gap-3 mt-8 flex flex-col p-4 bg-white rounded-lg max-w-[800px] w-full">
          <div className="relative w-full h-96">
            <Image
              className="rounded-md"
              fill
              src={video?.ImagePath ?? ""}
              alt="image"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className=" flex gap-1">
              <span className="text-sm text-blue-800 font-semibold">Name:</span>
              <span className="text-sm">{video.Name}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-sm font-semibold text-blue-800">Size:</span>{" "}
              <span className="text-sm">
                {Intl.NumberFormat("vi-VN", {
                  maximumFractionDigits: 3,
                }).format((video?.Size ?? -1) / (1024 * 2))}{" "}
                MB
              </span>
            </div>
            <div className=" flex gap-1 items-center">
              <span className="text-sm text-blue-800 font-semibold">
                Folder:
              </span>
              <span className="text-sm">{video.DirectoryName}</span>
              <Button
                onClick={() => {
                  openVideo(video.DirectoryName);
                }}
                size="small"
                type="link"
              >
                Open Folder
              </Button>
            </div>
            <div className=" flex gap-1 items-center">
              <span className="text-sm text-blue-800 font-semibold">
                Created At:
              </span>

              <span className="text-sm">
                {Intl.DateTimeFormat("vi-VN", formatDate).format(
                  new Date(video.CreatedAt ?? ""),
                )}
              </span>
            </div>
            <div className=" flex gap-1 items-center">
              <span className="text-sm text-blue-800 font-semibold">
                Last Access Time:
              </span>

              <span className="text-sm">
                {Intl.DateTimeFormat("vi-VN", formatDate).format(
                  new Date(video.LastAccessTime ?? ""),
                )}
              </span>
            </div>
          </div>
          <Button
            onClick={() => {
              openVideo(video.Path);
            }}
            size="small"
            type="primary"
          >
            Play
          </Button>
        </div>
      ) : (
        <div>Không thấy Video</div>
      )}
      <video
        src="https://youtu.be/0ANs-K1XyH8?si=GJ7Oysb3y9t63iFO" //"http://127.0.0.1:3000/api/videos/stream"
        controls
        width="800"
        height="450"
      />
    </>
  );
}
