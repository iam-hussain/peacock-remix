import classNames from "classnames";
// import StackedBrand from "../atoms/svg/stacked-brand";
import { Form, Link } from "@remix-run/react";
import MenuItem from "../molecules/menu-item";
import configContext from "~/config/configContext";

function SideBar({ isOpen, setOpen, isLoggedIn }: any) {
  const clubAge = configContext.club.clubAge();
  return (
    <>
      <div
        onClick={() => setOpen(!isOpen)}
        className={classNames(
          "fixed left-0 top-0 z-110 h-screen w-screen bg-secondary bg-gradient-to-r from-slate-600 to-base-300 opacity-60",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      ></div>
      <aside
        className={classNames(
          "ease-nav-brand fixed z-990 m-0 block h-full max-h-screen w-[300px] flex-wrap items-center justify-between border-0 p-6 pr-0 transition-transform duration-200 md:pl-8 xl:left-0 xl:translate-x-0",
          {
            "translate-x-0": isOpen,
            "-translate-x-[300px]": !isOpen,
          }
        )}
      >
        <div className="flex h-full flex-col rounded-md bg-white shadow-soft-xl">
          <div className="h-fit py-10 text-center">
            <Link
              to={"/"}
              className="m-auto block select-none whitespace-nowrap text-sm text-slate-700"
            >
              <h1 className="m-0 p-0 font-brand text-2xl uppercase tracking-normal text-primary">
                Peacock Club
              </h1>
              <p className="m-0 p-0 text-sm text-slate-500">{clubAge.inYear}</p>
            </Link>
          </div>

          <hr className="mt-0 h-px bg-transparent bg-gradient-to-r from-transparent via-black/90 to-transparent" />
          <div className="flex h-auto w-full grow flex-col justify-start overflow-y-auto align-middle">
            <ul className="mb-0 flex h-min w-full flex-col pl-0">
              <li className="w-full">
                <MenuItem
                  onClick={() => setOpen(false)}
                  pathName="/home"
                  hed="Home"
                  iconName="home"
                />
              </li>
              <li className="w-full">
                <MenuItem
                  onClick={() => setOpen(false)}
                  pathName="/transaction"
                  hed="Transaction"
                  iconName="trans"
                />
              </li>

              <li className="mt-4 w-full">
                <h6 className="ml-2 pl-6 text-xs font-bold uppercase leading-tight opacity-80">
                  User pages
                </h6>
              </li>

              <li className="w-full">
                <MenuItem
                  onClick={() => setOpen(false)}
                  pathName="/member"
                  hed="Members"
                  iconName="member"
                />
              </li>

              <li className="w-full">
                <MenuItem
                  onClick={() => setOpen(false)}
                  pathName="/vendor"
                  hed="Vendors"
                  iconName="archive"
                />
              </li>

              {isLoggedIn && (
                <li className="w-full">
                  <>
                    <li className="mt-4 w-full">
                      <h6 className="ml-2 pl-6 text-xs font-bold uppercase leading-tight opacity-80">
                        Backup DB
                      </h6>
                    </li>

                    <li className="w-full">
                      <Form action="/backup" method="post">
                        <MenuItem
                          type="submit"
                          onClick={() => {}}
                          pathName="/backup"
                          hed="Backup"
                          iconName="dash"
                        />
                      </Form>
                    </li>
                    <li className="w-full">
                      <a href="/peacock_backup.json" download>
                        <MenuItem
                          type="submit"
                          onClick={() => setOpen(false)}
                          pathName="/logout"
                          hed="Download"
                          iconName="group"
                        />
                      </a>
                    </li>
                  </>
                </li>
              )}

              <li className="mt-4 w-full">
                <h6 className="ml-2 pl-6 text-xs font-bold uppercase leading-tight opacity-80">
                  Admin Access
                </h6>
              </li>

              <li className="w-full">
                {isLoggedIn ? (
                  <>
                    <Form action="/logout" method="post">
                      <MenuItem
                        type="submit"
                        onClick={() => setOpen(false)}
                        pathName="/logout"
                        hed="Logout"
                        iconName="close"
                      />
                    </Form>
                  </>
                ) : (
                  <MenuItem
                    onClick={() => setOpen(false)}
                    pathName="/login"
                    hed="Login"
                    iconName="setting"
                  />
                )}
              </li>
            </ul>
            <hr className="mt-4 h-px bg-transparent bg-gradient-to-r from-transparent via-black/90 to-transparent" />
            <div className="bt-2 flex flex-col justify-center gap-2 text-center">
              <p className="m-0 p-0 text-sm text-slate-500">
                Since {clubAge.since}
              </p>
            </div>
          </div>

          {/* <div className="block h-auto w-auto items-center overflow-y-auto">
           
          </div> */}
        </div>
      </aside>
    </>
  );
}

export default SideBar;
