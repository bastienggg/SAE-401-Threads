import { Link } from "react-router-dom";
import { Button } from "../components/ui/button"




export default function Root() {
  
  return (
    <>
      <section className="flex h-screen w-full flex-col items-center justify-between bg-gradient-to-br from-sky-50 via-purple-50 to-sky-50 p-6 md:p-20">
        <img src="./src/assets/Threads_Logo.svg" alt="" />
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
