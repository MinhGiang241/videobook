/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "antd";
import { ChangeEventHandler, useState } from "react";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { Video } from "@/interface/data";
import toast from "react-hot-toast";
import { ResultResponseDetails } from "@/interface/api";
import axios from "axios";
import { formatDuration } from "@/services/utils";

interface EditVideoProps extends BaseModalProps {
  video: Video;
}
export default function EditVideoModal({
  video,
  open,
  onCancel,
}: EditVideoProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<Video>(video);
  const onChangeText: ChangeEventHandler<HTMLInputElement | undefined> = (
    e,
  ) => {
    console.log(e.target.title);
    const newInfo: any = { ...info };
    const key: string = e.target.title;
    newInfo[key] = e.target.value.trim();
    setInfo(newInfo);
  };
  const onClick = async () => {
    try {
      setLoading(true);

      const res: ResultResponseDetails = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL}/api/videos/edit`,
        {
          ...info,
        },
      );

      if (res.status != 200) {
        toast.error("Error");
      } else if (res.data?.success) {
        setInfo(res.data?.video as Video);
        toast.success("Update thành công");
        onCancel();
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
        title="Sửa thông tin"
        width={700}
        open={open}
        onCancel={() => {
          setLoading(false);
          onCancel();
        }}
      >
        <div className="flex flex-col w-full">
          <div>Name</div>
          <Input onChange={onChangeText} value={info?.Name} title="Name" />
        </div>
        <div className="flex flex-col w-full">
          <div>Path</div>
          <Input onChange={onChangeText} value={info?.Path} title="Path" />
        </div>
        <div className="flex flex-col w-full">
          <div>Type</div>
          <Input onChange={onChangeText} value={info?.Type} title="Type" />
        </div>
        <div className="flex flex-col w-full">
          <div>ThumbNail</div>
          <Input
            disabled
            onChange={onChangeText}
            value={info?.ThumbNail}
            title="ThumbNail"
          />
          <div className="flex flex-col w-full">
            <div>Disk</div>
            <Input
              disabled
              onChange={onChangeText}
              value={info?.Disk}
              title="Disk"
            />
          </div>
          <div className="flex flex-col w-full">
            <div>DirectoryName</div>
            <Input
              disabled
              onChange={onChangeText}
              value={info?.DirectoryName}
              title="DirectoryName"
            />
          </div>
          <div className="flex flex-col w-full">
            <div>Folder</div>
            <Input
              disabled
              onChange={onChangeText}
              value={info?.Folder}
              title="Folder"
            />
          </div>
          <div className="flex flex-col w-full">
            <div>Duration</div>
            <Input
              disabled
              onChange={onChangeText}
              value={formatDuration(info.Duration ?? 0)}
              title="Duration"
            />
          </div>
        </div>

        <div className="flex mt-3 w-full justify-center">
          <Button loading={loading} onClick={onClick}>
            Cập nhật
          </Button>
        </div>
      </BaseModal>
    </>
  );
}
