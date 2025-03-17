import Input from "./ui/input";
import Button from "./ui/button";

interface FormProps {
  buttonText: string;
}

export default function Form({ buttonText }: FormProps) {
  return (
    <form action="" className="flex w-full flex-col gap-11 md:w-1/2">
      <Input
        type="email"
        intent="base"
        autoComplete="email"
        placeholder="Enter your email ou pseudo"
      />
      <Input
        type="password"
        intent="base"
        autoComplete="email"
        placeholder="*****"
      />
      <Button intent="base">{buttonText}</Button>
    </form>
  );
}
