/* eslint-disable @typescript-eslint/no-explicit-any */
import { Video } from "@/interface/data";
import { Button, Dropdown, Tooltip } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import { openVideo } from "../../services/videos";
import Link from "next/link";
import { formatDuration } from "../../services/utils";
import toast from "react-hot-toast";
import { MoreOutlined } from "@ant-design/icons";
import EditVideoModal from "./EditVideoModal";
import ImagePreviewModal from "./ImagePreviewModal";

function DropDownItem({
  text,
  onClick,
  danger = false,
}: {
  text?: string;
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  danger?: boolean;
}) {
  return (
    <>
      <Button type="text" onClick={onClick}>
        <div className={danger ? `text-red-600` : ""}>{text}</div>
      </Button>
    </>
  );
}

function VideoCard({
  item,
  active,
  setActive,
  thumbnailVersion,
  setThumbnailVersion,
}: {
  item: Video;
  active?: string;
  setActive: any;
  thumbnailVersion?: number;
  setThumbnailVersion: any;
}) {
  const [index, setIndex] = useState<number>(0);
  const items = [
    {
      key: "editName",
      label: (
        <DropDownItem
          text={"Sửa"}
          onClick={() => {
            setActive(item._id);
            setIndex(1);
          }}
        />
      ),
    },
    {
      key: "img",
      label: (
        <DropDownItem
          text={"Hình ảnh"}
          onClick={() => {
            setActive(item._id);
            setIndex(2);
          }}
        />
      ),
    },
    {
      key: "delete",
      label: (
        <DropDownItem danger text={"Xóa"} onClick={() => alert("Hello")} />
      ),
    },
  ];

  return (
    <>
      <Tooltip trigger={"hover"} title={item.Name}>
        <div className="w-full bg-white rounded-lg overflow-clip shadow-md shadow-slate-950 select-text cursor-pointer">
          <div className="h-32 w-full relative">
            <div className="rounded-sm bottom-1 right-1 bg-black/40 text-white z-10 absolute text-xs font-semibold px-2 py-1">
              {formatDuration(item.Duration ?? 0)}
            </div>
            <Image
              objectFit="fit"
              src={
                !item.ImagePath
                  ? "https://unsplash.it/640/640"
                  : `${item.ImagePath ?? ""}?v=${thumbnailVersion}`
              }
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
                <span className="text-sm font-semibold text-blue-800">
                  Size:
                </span>{" "}
                {Intl.NumberFormat("vi-VN", {
                  maximumFractionDigits: 3,
                }).format((item?.Size ?? 0) / (1024 * 2))}
                MB
              </div>
              <div className="flex">
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
                <Button
                  className="ml-1 text-blue-800 bg-yellow-700"
                  onClick={() => {
                    setActive(item._id);
                    setIndex(2);
                  }}
                  size="small"
                >
                  Image
                </Button>
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </Tooltip>
      {index === 1 && (
        <EditVideoModal
          setIndex={setIndex}
          video={item}
          open={item._id === active}
          onCancel={() => {
            setActive(undefined);
          }}
        />
      )}
      {index === 2 && (
        <ImagePreviewModal
          thumbnailVersion={thumbnailVersion}
          setThumbnailVersion={setThumbnailVersion}
          setIndex={setIndex}
          video={item}
          open={item._id === active}
          onCancel={() => {
            setActive(undefined);
          }}
        />
      )}
    </>
  );
}

export default VideoCard;
