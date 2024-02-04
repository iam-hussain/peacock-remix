import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="h-full w-full select-none  bg-gradient-to-tr from-base-100 to-emerald-50">
      <div className="m-auto grid h-full w-full max-w-6xl grid-cols-1 gap-8 px-8 align-middle lg:grid-cols-2 lg:flex-row">
        <div className="flex w-full items-end justify-center lg:items-center">
          <img
            className="h-auto w-auto max-w-full rounded-md"
            src="/peacock.png"
            alt="Peacock Bird"
          />
        </div>
        <div className="m-auto mt-0 flex max-w-lg flex-col items-center justify-center lg:mt-auto">
          <h1 className="font-brand text-4xl uppercase tracking-normal sm:text-5xl">
            Peacock Club
          </h1>
          <p className="font-core text-xs uppercase text-slate-700">
            Creating the environment for business
          </p>

          <Link to="/home" className="btn-primary btn-block btn mt-4">
            View Dashboard
            <svg
              aria-hidden="true"
              className="-mr-1 ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
