import SignupPage from "../components/Signup/Singup";

export default function Signup() {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-purple-50 to-sky-50 h-screen w-full gap-4">
        <img src="./src/assets/Threads_Logo.svg" alt="" className="w-20"/>
      <SignupPage />
    </div>
  );
}
