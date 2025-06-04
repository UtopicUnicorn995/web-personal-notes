import { useEffect, useState } from "react";
import clsx from "clsx"; // Optional: for cleaner class management

export default function Toast({ title, description }) {
  const [visible, setVisible] = useState(false);

  const notificationIcon = [
    {
      key: "success",
      label: "Success!",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12 text-green-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      key: "warning",
      label: "Warning!",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      ),
    },
    {
      key: "failed",
      label: "Failed!",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
  ];

  const current = notificationIcon.find((n) => n.key === title);

  useEffect(() => {
    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={clsx(
        "fixed top-4 right-4 z-50 p-3 sm:p-4 w-60 sm:w-80 rounded-lg shadow-lg px-4 py-3 text-white bg-white border border-gray-200 flex items-center space-x-3 transition-opacity duration-500 ease-in-out",
        {
          "opacity-100 ": visible,
          "opacity-0  pointer-events-none": !visible,
        }
      )}
    >
      {current?.icon}
      <div>
        <p className="font-semibold text-gray-800">{current?.label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
