import { Link } from "@remix-run/react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 h-16 w-full max-w-lg -translate-x-1/2 rounded-full border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
      <div className="mx-auto grid h-full max-w-lg grid-cols-5">
        <Link
          to={"/"}
          data-tooltip-target="tooltip-home"
          type="Link"
          className="group inline-flex flex-col items-center justify-center rounded-l-full px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 h-6 w-6 text-gray-500 group-hover:text-[#349b7b] dark:text-gray-400 dark:group-hover:text-[#2a7d63]"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          <span className="sr-only">Home</span>
        </Link>
        <div
          id="tooltip-home"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Home
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <Link
          to={"/dashboard"}
          data-tooltip-target="tooltip-wallet"
          type="Link"
          className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mb-1 h-6 w-6 text-gray-500 group-hover:text-[#349b7b] dark:text-gray-400 dark:group-hover:text-[#2a7d63]"
          >
            <path
              fillRule="evenodd"
              d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 011.5 10.875v-3.75zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 01-1.875-1.875v-8.25zM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 013 18.375v-2.25z"
              clipRule="evenodd"
            />
          </svg>

          <span className="sr-only">Group</span>
        </Link>
        <div
          id="tooltip-wallet"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Groups
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <div className="flex items-center justify-center">
          <Link
            to="/"
            data-tooltip-target="tooltip-new"
            type="Link"
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#349b7b] font-medium hover:bg-[#2a7d63] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              ></path>
            </svg>
            <span className="sr-only">New item</span>
          </Link>
        </div>
        <div
          id="tooltip-new"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Member
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <Link
          to={"/dashboard/members"}
          data-tooltip-target="tooltip-settings"
          type="Link"
          className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mb-1 h-6 w-6 text-gray-500 group-hover:text-[#349b7b] dark:text-gray-400 dark:group-hover:text-[#2a7d63]"
          >
            <path
              fillRule="evenodd"
              d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
              clipRule="evenodd"
            />
            <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
          </svg>

          <span className="sr-only">Members</span>
        </Link>
        <div
          id="tooltip-settings"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Members
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <Link
          to={"/dashboard/tranactio"}
          data-tooltip-target="tooltip-profile"
          type="Link"
          className="group inline-flex flex-col items-center justify-center rounded-r-full px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mb-1 h-6 w-6 text-gray-500 group-hover:text-[#349b7b] dark:text-gray-400 dark:group-hover:text-[#2a7d63]"
          >
            <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
            <path
              fillRule="evenodd"
              d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
              clipRule="evenodd"
            />
          </svg>

          <span className="sr-only">Transaction</span>
        </Link>
        <div
          id="tooltip-profile"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Transaction
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </div>
  );
}
