/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ResultResponseList, ResultResponseOption } from "@/interface/api";
import { Video } from "@/interface/data";
import { GetProps, Input, Pagination, Select, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast/headless";
import VideoCard from "./components/VideoCard";
import SkeletonImage from "antd/es/skeleton/Image";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

export default function Home() {
  const [sort, setSort] = useState<string>("LastAccessTime");
  const [order, setOrder] = useState<number>(-1);
  const [list, setList] = useState<Video[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [oploading, setOpLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [text, setText] = useState<string | undefined>();
  const [disk, setDisk] = useState<string>("");
  const [folder, setFolder] = useState<string>("");
  const [folders, setFolders] = useState<{ value?: string; label?: string }[]>(
    [],
  );

  const getOptions = async () => {
    try {
      setOpLoading(true);
      const result: ResultResponseOption = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL}/api/videos/option`,
      );
      if (result?.data?.success) {
        const re = result?.data?.list ?? ({} as any);
        let op = (re[disk] as { value?: string; label?: string }[]) ?? [];
        op = [
          { value: "", label: "All" },
          ...op.sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? "")),
        ];
        setFolders(op);
      } else {
        toast.error(result?.data?.error);
      }
      setOpLoading(false);
    } catch (e: any) {
      setOpLoading(false);
    }
  };

  const getVideoList = async () => {
    try {
      setLoading(true);
      const result: ResultResponseList = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL}/api/videos/list`,
        {
          skip,
          limit,
          text,
          sort,
          order,
          disk,
          folder,
        },
      );

      setLoading(false);

      if (result?.data?.success) {
        setTotal(result?.data?.total ?? 0);
        setList(result?.data?.list ?? []);
      } else {
        toast.error(result?.data?.error);
      }
    } catch (e: any) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getOptions();
    getVideoList();
  }, [limit, skip, page, text, sort, order, disk, folder]);

  const onShowSizeChange = (current: number, size: number) => {
    setLimit(size);
    setPage(1);
    setSkip(0);
  };

  const onPageChange = (page: number, pageSize: number) => {
    setPage(page);
    setSkip(limit * (page - 1));
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    setText(value?.trim());
    setSkip(0);
    setPage(1);
  };

  const onSortChange = (value: any) => {
    setSort(value);
    setSkip(0);
    setPage(1);
  };

  const onOrderChange = (value: any) => {
    setOrder(value);
    setSkip(0);
    setPage(1);
  };

  const onDiskChange = (value: any) => {
    setDisk(value);
    setFolder("");
    setSkip(0);
    setPage(1);
  };

  const onFolderChange = (value: any) => {
    setFolder(value);
    setSkip(0);
    setPage(1);
  };

  const options = [
    {
      value: "Name",
      label: "Name",
    },
    {
      value: "Size",
      label: "Size",
    },
    {
      value: "CreatedAt",
      label: "CreatedAt",
    },
    {
      value: "Path",
      label: "Path",
    },
    {
      value: "LastAccessTime",
      label: "LastAccessTime",
    },
    {
      value: "Duration",
      label: "Duration",
    },
    {
      value: "Width",
      label: "Width",
    },
    {
      value: "Height",
      label: "Height",
    },
  ];

  const orders = [
    { value: 1, label: "Ascending" },
    { value: -1, label: "Descending" },
  ];

  const disks = [
    { value: "", label: "All" },
    { value: "G", label: "G" },
    { value: "H", label: "H" },
    { value: "F", label: "F" },
    { value: "D", label: "D" },
  ];

  return (
    <div className=" w-full min-h-80 flex justify-center items-center flex-col mt-7 mx-8 max-w-[1224px]">
      {folders.map((a: any) => a.Value)}
      <div className="max-w-[700px] w-full mb-7 flex gap-2">
        <Search
          allowClear
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
        <Select
          value={sort}
          onChange={onSortChange}
          showSearch
          style={{ width: 300 }}
          placeholder="Sorted By"
          optionFilterProp="label"
          options={options}
        />
        <Select
          value={order}
          onChange={onOrderChange}
          showSearch
          style={{ width: 170 }}
          placeholder="Order"
          optionFilterProp="label"
          options={orders}
        />
        <Select
          value={disk}
          onChange={onDiskChange}
          showSearch
          style={{ width: 170 }}
          placeholder="disk"
          optionFilterProp="label"
          options={disks}
        />

        {!oploading && (
          <Select
            value={folder}
            onChange={onFolderChange}
            showSearch
            style={{ width: 370 }}
            placeholder="folder"
            optionFilterProp="label"
            options={folders}
          />
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-4 mb-5 w-full gap-x-3 gap-y-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              className="grid place-items-center w-full h-[216px] bg-white rounded-lg overflow-clip shadow-md shadow-slate-950 "
              key={i}
            >
              <SkeletonImage
                // rootClassName="w-full h-[200px]"
                key={i}
                active={loading}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 mb-5 w-full gap-x-3 gap-y-4">
          {list.map((t, i) => (
            <VideoCard item={t} key={i} />
          ))}
        </div>
      )}

      <Pagination
        current={page}
        pageSizeOptions={[8, 12, 20, 40, 100]}
        defaultPageSize={limit}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        onChange={onPageChange}
        defaultCurrent={1}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        showQuickJumper
        total={total}
      />
    </div>
  );
}
