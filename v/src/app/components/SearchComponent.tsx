// import { GetProps, Input, Select } from "antd";
//
// type SearchProps = GetProps<typeof Input.Search>;
// const { Search } = Input;
//
// export default function SearchComponent() {
//   const options = [
//     {
//       value: "Name",
//       label: "Name",
//     },
//     {
//       value: "Size",
//       label: "Size",
//     },
//     {
//       value: "CreatedAt",
//       label: "CreatedAt",
//     },
//     {
//       value: "Path",
//       label: "Path",
//     },
//     {
//       value: "LastAccessTime",
//       label: "LastAccessTime",
//     },
//     {
//       value: "Duration",
//       label: "Duration",
//     },
//     {
//       value: "Width",
//       label: "Width",
//     },
//     {
//       value: "Height",
//       label: "Height",
//     },
//   ];
//
//   const orders = [
//     { value: 1, label: "Ascending" },
//     { value: -1, label: "Descending" },
//   ];
//
//   return (
//     <div className="max-w-[700px] w-full mb-7 flex gap-2">
//       <Search
//         allowClear
//         placeholder="input search text"
//         onSearch={onSearch}
//         enterButton
//       />
//       <Select
//         value={sort}
//         onChange={onSortChange}
//         showSearch
//         style={{ width: 300 }}
//         placeholder="Sorted By"
//         optionFilterProp="label"
//         options={options}
//       />
//       <Select
//         value={order}
//         onChange={onOrderChange}
//         showSearch
//         style={{ width: 170 }}
//         placeholder="Order"
//         optionFilterProp="label"
//         options={orders}
//       />
//     </div>
//   );
// }
