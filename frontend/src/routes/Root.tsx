import { Link } from "react-router-dom";
import Button from "../components/ui/button.tsx";




export default function Root() {
  
  return (
    <>
      <section className="flex h-screen w-full flex-col items-center justify-between bg-gradient-to-br from-amber-100 via-purple-100 to-lime-100 p-6 md:p-20">
        <img src="./src/assets/Threads_Logo.svg" alt="" />
        <div className="flex w-full flex-col gap-11 md:w-1/2">
          <Link to="/login">
            <Button intent="base">Login</Button>
          </Link>
          <Link to="/login">
            <Button intent="base">Sign Up</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
