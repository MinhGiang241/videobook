import { Video } from "@/interface/data";
import { Button, Tooltip } from "antd";
import Image from "next/image";
import React from "react";
import { openVideo } from "../services/videos";
import Link from "next/link";

function VideoCard({ item }: { item: Video }) {
  return (
    <Tooltip trigger={"hover"} title={item.Name}>
      <Link
        href={`/details?id=${item._id}`}
        className="w-full bg-white rounded-lg overflow-clip shadow-md shadow-slate-950 select-text cursor-pointer"
      >
        <div className="h-32 w-full relative">
          <Image
            objectFit="fit"
            src={item.ImagePath ?? "https://unsplash.it/640/640"}
            alt="img"
            loading="lazy"
            fill
          />
        </div>
        <div className="px-3 py-2 text-start text-xs font-thin">
          <div className="h-[52px] overflow-hidden ">
            <span className="text-sm font-semibold text-blue-800">Name</span>:{" "}
            {item.Name}
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
                e.stopPropagation();
                openVideo(item.Path);
              }}
              size="small"
            >
              Play
            </Button>
          </div>
        </div>
      </Link>
    </Tooltip>
  );
}

export default VideoCard;
