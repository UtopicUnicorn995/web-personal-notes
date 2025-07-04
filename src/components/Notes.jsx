import "../index.css";
import { Fragment } from "react";
const Notes = ({ item, onClick, selectedUser }) => {
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
    <>
      <div
        onClick={onClick}
        key={item.id}
        className={`flex gap-x-4 rounded-xl ${
          selectedUser === "Notes2"
            ? "bg-[#FFF8B5] hover:bg-[#FFE875]"
            : " bg-[white] hover:bg-gray-200"
        } transition delay-150 duration-200 ease-in-out hover:cursor-pointer  p-3 sm:p-4 md:w-3xs max-h-[260px]`}
      >
        <div className="overflow-y-auto no-scrollbar">
          <p className="text-base font-medium text-[#262626">
            {item.title || "No Title"}
          </p>
          <p className="text-gray-700 text-sm ">
            {addNewLineToText(item.content || "No Message")}
          </p>
        </div>
      </div>
    </>
  );
};

export default Notes;
