import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface Props {
  data: Product[];
}

const ProductTable = ({ data }: Props) => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductTable;
