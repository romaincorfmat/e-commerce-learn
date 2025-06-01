import React from "react";
import { columns } from "./categories-columns";
import { DataTable } from "../data-table";

interface Props {
  data: Category[];
}

const CategoriesTable = ({ data }: Props) => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CategoriesTable;
