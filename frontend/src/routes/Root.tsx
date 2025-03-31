import { Link } from "react-router-dom";
import { Button } from "../components/ui/button"




export default function Root() {
  
  return (
    <>
      <section className="flex h-screen w-full flex-col items-center justify-between bg-gradient-to-br from-sky-50 via-purple-50 to-sky-50 p-6 md:p-20">
        <div className="flex flex-col items-center gap-4 w-full">
          <img src="/public/parlatz_logo.svg" alt="" className="w-20 aspect-square"/>
          <h1 className="font-extrabold text-3xl text-neutral-900">Parlatz</h1>
        </div>
        <div className="flex w-full flex-col gap-11 md:w-1/2">
          <Link to="/login">
            <Button className="w-full hover:cursor-pointer">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="w-full hover:cursor-pointer">Sign Up</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
