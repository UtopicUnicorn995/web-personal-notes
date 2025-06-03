const Notes = ({ item, onClick }) => {
  const addNewLineToText = (text) => {
    return text?.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <>
      <div
        onClick={onClick}
        key={item.id}
        className="flex gap-x-4 rounded-xl bg-white hover:cursor-pointer hover:bg-gray-200 p-3 sm:p-4 md:w-3xs"
      >
        <div>
          <p className="text-base font-medium text-[#262626">
            {item.title || "No Title"}
          </p>
          <p className="text-gray-700 text-sm">
            {addNewLineToText(item.content || "No Message")}
          </p>
        </div>
      </div>
    </>
  );
};

export default Notes;
