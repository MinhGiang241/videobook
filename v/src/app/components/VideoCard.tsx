/* eslint-disable @typescript-eslint/no-explicit-any */
import { Video } from "@/interface/data";
import { Button, Tooltip } from "antd";
import Image from "next/image";
import React from "react";
import { openVideo } from "../../services/videos";
import Link from "next/link";
import { formatDuration } from "../../services/utils";
import toast from "react-hot-toast";

function VideoCard({ item }: { item: Video }) {
  return (
    <Tooltip trigger={"hover"} title={item.Name}>
      <div className="w-full bg-white rounded-lg overflow-clip shadow-md shadow-slate-950 select-text cursor-pointer">
        <div className="h-32 w-full relative">
          <div className="rounded-sm bottom-1 right-1 bg-black/40 text-white z-10 absolute text-xs font-semibold px-2 py-1">
            {formatDuration(item.Duration ?? 0)}
          </div>
          <Image
            objectFit="fit"
            src={item.ImagePath ?? "https://unsplash.it/640/640"}
            alt="img"
            loading="lazy"
            fill
          />
          <div className="absolute z-100 text-white bg-black p-1 rounded-br-xl font-semibold">
            {item.Disk}
          </div>
        </div>
        <div className="px-3 py-2 text-start text-xs font-thin">
          <div className="select-text h-[52px] overflow-hidden ">
            <span
              onClick={(e: any) => {
                e.stopPropagation();
                navigator.clipboard.writeText(item.Name ?? "");
                toast("copy thành công");
              }}
              className="select-text text-sm font-semibold text-blue-800"
            >
              Name
            </span>
            : <Link href={`/details?id=${item._id}`}>{item.Name}</Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-blue-800">Size:</span>{" "}
              {Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 3,
              }).format((item?.Size ?? 0) / (1024 * 2))}
              MB
            </div>
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openVideo(item.Path);
              }}
              size="small"
            >
              Play
            </Button>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}

export default VideoCard;
