/* eslint-disable @typescript-eslint/no-explicit-any */

import { Video } from "@/interface/data";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { useState } from "react";
import Image from "next/image";
import Button from "antd/es/button";
import Slider from "antd/es/slider";
import { formatDuration } from "@/services/utils";
import toast from "react-hot-toast";
import axios from "axios";
import { ResultResponseImage } from "@/interface/api";
import { openVideo } from "@/services/videos";

interface ImagePreviewProps extends BaseModalProps {
  video: Video;
  setIndex: any;
  thumbnailVersion?: number;
  setThumbnailVersion: any;
}

export default function ImagePreviewModal({
  video,
  open,
  setIndex,
  thumbnailVersion,
  setThumbnailVersion,
  onCancel,
}: ImagePreviewProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);

  const onChangeImage = async (value: number) => {
    try {
      setLoading(true);

      const res: ResultResponseImage = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL}/api/videos/image`,
        {
          id: video._id,
          value,
        },
      );
      if (res.status != 200) {
        toast.error("Error");
      } else if (res.data?.success) {
        setImage(res.data?.data);
      } else {
        toast.error(res.data?.error);
      }

      setLoading(false);
    } catch (er: any) {
      toast.error(`Error ${er.Message}`);
      setLoading(false);
    }
  };

  const onSaveImage = async () => {
    try {
      setLoading(true);

      const res: ResultResponseImage = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL}/api/videos/thump`,
        {
          id: video._id,
          value: image,
        },
      );
      if (res.status != 200) {
        toast.error("Error");
      } else if (res.data?.success) {
        setImage(undefined);
        setThumbnailVersion(Date.now());
        toast.success("Lưu ảnh thành công");
      } else {
        toast.error(res.data?.error);
      }

      setLoading(false);
    } catch (er: any) {
      toast.error(`Error ${er.Message}`);
      setLoading(false);
    }
  };

  const onPlay = async () => {
    try {
      setLoading(true);
      const res: ResultResponseImage = await openVideo(video.Path);
      if (res.status != 200) {
        toast.error("Error");
      } else if (res.data?.success) {
      } else {
        toast.error(res.data?.error);
      }
      setLoading(false);
    } catch (er: any) {
      toast.error(`Error ${er.Message}`);
      setLoading(false);
    }
  };
  return (
    <>
      <BaseModal
        open={open}
        onCancel={function (): void {
          setIndex(0);
          setLoading(false);
          onCancel();
        }}
      >
        <div className="w-full h-96 relative bg-black">
          <Image
            fill
            alt={video._id ?? ""}
            src={
              !image ? `${video.ImagePath ?? ""}?v=${thumbnailVersion}` : image
            }
          />
        </div>
        <Slider
          disabled={loading}
          className="w-full mt-3"
          min={0}
          max={video.Duration}
          defaultValue={0}
          tooltip={{
            formatter: (value) => formatDuration(value ?? 0),
          }}
          onChange={onChangeImage}
        />
        <div className="flex mt-3 w-full justify-center">
          <Button
            onClick={() => {
              setIndex(0);
              setLoading(false);
              setImage(undefined);
              onCancel();
            }}
          >
            Đóng
          </Button>
          <div className="w-6" />
          <Button
            type="primary"
            disabled={!image}
            loading={loading}
            onClick={onSaveImage}
          >
            Lưu
          </Button>
          <div className="w-6" />
          <Button loading={loading} onClick={onPlay}>
            Play
          </Button>
        </div>
      </BaseModal>
    </>
  );
}
