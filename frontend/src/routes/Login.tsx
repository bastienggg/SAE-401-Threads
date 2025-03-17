import Form from "../components/Forms.tsx";

export default function Login() {
  return (
    <section className="flex h-screen w-full flex-col items-center justify-between bg-gradient-to-br from-amber-100 via-purple-100 to-lime-100 p-6 md:p-20">
      <img src="./src/assets/Threads_Logo.svg" alt="" />
      <Form buttonText="Login" />
    </section>
  );
}
