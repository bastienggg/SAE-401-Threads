import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export default function SignupPage() {
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const evaluatePasswordStrength = (password: string) => {
    if (password.length < 6) {
      return "Weak";
    } else if (password.length < 10) {
      return "Moderate";
    } else {
      return "Strong";
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(evaluatePasswordStrength(newPassword));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Enter your informations</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <Input id="email" type="email" placeholder="m@example.com" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="pseudo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pseudo
              </label>
              <Input placeholder="Pseudo" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-gray-600 hover:cursor-pointer"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-sm">
                Password strength: <span className={`${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Moderate" ? "text-yellow-500" : "text-green-500"}`}>{passwordStrength}</span>
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full hover:cursor-pointer">Sign up</Button>
      </CardFooter>
    </Card>
  );
}