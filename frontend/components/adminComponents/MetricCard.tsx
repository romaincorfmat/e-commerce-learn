import React from "react";

interface MetricCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
}

const MetricCard = ({ title, value, icon }: MetricCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex  justify-between ">
        <div className="w-full flex flex-col justify-between">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        {icon && <div className="text-gray-500">{icon} </div>}
      </div>
    </div>
  );
};

export default MetricCard;
