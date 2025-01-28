/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ResultResponseList } from "@/interface/api";
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
  const [page, setPage] = useState<number>(1);
  const [text, setText] = useState<string | undefined>();

  const getVideoList = async () => {
    try {
      setLoading(true);
      const result: ResultResponseList = await axios.post(
        "http://127.0.0.1:3000/api/videos/list",
        {
          skip,
          limit,
          text,
          sort,
          order,
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
    getVideoList();
  }, [limit, skip, page, text, sort, order]);

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

  return (
    <div className=" w-full min-h-80 flex justify-center items-center flex-col mt-7 mx-8 max-w-[1224px]">
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
