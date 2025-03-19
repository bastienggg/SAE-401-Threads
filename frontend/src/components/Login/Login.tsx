import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "../ui/card";
import { Auth } from "../../data/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  // Nouvel état pour gérer l'affichage du mot de passe
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError(false); // Reset email error state
    setPasswordError(false); // Reset password error state

    const fetchPosts = async () => {
      let credential = { email, password };
      console.log('credential:', credential);
      const data = await Auth.login(credential);
        if (data.code === "C-1101") {
          sessionStorage.setItem('Token', data.token);
          sessionStorage.setItem('Pseudo', data.pseudo);
          navigate('/home');
        } else if (data.code === "C-3121") {
          setEmailError(true);
        } else if (data.code === "C-3131") {
          setPasswordError(true);
        }
        else {
          setPasswordError(true);
          setEmailError(true);
      }
    };
  
    fetchPosts();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Card className="w-10/12 md:w-1/3">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <p className="text-red-500 text-sm">Email invalide</p>
              )}
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
                  className={passwordError ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-gray-600 hover:cursor-pointer"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">Mot de passe invalide</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full hover:cursor-pointer mt-6">Log in</Button>
          <div className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline hover:cursor-pointer ">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}