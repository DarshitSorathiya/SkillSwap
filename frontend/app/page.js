"use client";
import Card from "@/components/Card";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Availability");
  const [searchQuery, setSearchQuery] = useState("");
  const options = ["Weekdays (Morning)", "Weekdays (Evening)", "Weekends (Morning)", "Weekends (Evening)"];

  return (
    <>
      <div className="p-8 flex gap-4 justify-end">
        <div className="relative w-64">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 text-left bg-green-50 border border-gray-300 rounded-md hover:bg-gray-300"
          >
            {selected}
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              ▼
            </span>
          </button>

          {isOpen && (
            <div className="absolute w-full mt-1 bg-gray-100 border border-green-800 rounded-md shadow-lg">
              {options.map((option, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-96 px-4 py-2 bg-green-50 border border-green-300 rounded-md focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
      </div>

      <div className=" flex flex-col items-center justify-center gap-4 p-8">
        <Card />
        <Card />
        <Card />
      </div>

      <div>

      </div>
    </>
  );
}
