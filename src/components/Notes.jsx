import "../index.css";
import { Fragment, useState } from "react";
const Notes = ({ item, onClick, selectedUser, onClickPreview }) => {
  const [hovered, setHovered] = useState(false);

  const addNewLineToText = (text) => {
    const urlRegex =
      /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

    return text?.split("\n").map((line, index) => {
      const parts = line.split(urlRegex);

      return (
        <span key={index}>
          {parts.map((part, i) =>
            urlRegex.test(part) ? (
              <a
                href={part}
                target="_blank"
                key={i}
                className="break-all text-blue-600 font-bold underline"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </a>
            ) : (
              <Fragment key={i}>{part}</Fragment>
            )
          )}
          <br />
        </span>
      );
    });
  };

  return (
    <div
      onClick={onClick}
      key={item.id}
      className={`flex flex-col gap-x-4 rounded-xl relative ${
        selectedUser === "Notes2"
          ? "bg-[#FFF8B5] hover:bg-[#FFE875]"
          : " bg-[white] hover:bg-gray-200"
      } transition delay-150 duration-200 ease-in-out hover:cursor-pointer p-3 sm:p-4 md:w-3xs max-h-[260px]`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="overflow-y-auto no-scrollbar pb-8">
        <p className="text-base font-medium text-[#262626]">
          {item.title || "No Title"}
        </p>
        <p className="text-gray-700 text-sm ">
          {addNewLineToText(item.content || "No Message")}
        </p>
      </div>
      {hovered && (
        <div className="w-full px-4 left-1/2 -translate-x-1/2 absolute bottom-4">
          <button
            className=" w-full hover:cursor-pointer  px-3 py-1 bg-indigo-400 hover:bg-indigo-600 text-white rounded shadow transition duration-150"
            onClick={(e) => {
              e.stopPropagation();
              onClickPreview();
              // Add your preview logic here
            }}
          >
            Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default Notes;
