import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react"; // Import the Loader2 component

import { Auth } from "../../data/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailNotVerifiedError, setEmailNotVerifiedError] = useState(false); // Nouvel état pour l'erreur de vérification de l'email
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [resendEmailLoading, setResendEmailLoading] = useState(false); // Add resend email loading state

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError(false); // Reset email error state
    setPasswordError(false); // Reset password error state
    setEmailNotVerifiedError(false); // Reset email not verified error state
    setLoading(true); // Set loading state to true

    const fetchPosts = async () => {
      let credential = { email, password };
      console.log('credential:', credential);
      const data = await Auth.login(credential);
        if (data.code === "C-1101") {
          sessionStorage.setItem('Token', data.token);
          sessionStorage.setItem('Pseudo', data.pseudo);
          navigate('/home');}
        else if (data.code === "C-0001") {
          sessionStorage.setItem('Token', data.token);
          sessionStorage.setItem('Pseudo', data.pseudo);
          navigate('/backoffice');
        } else if (data.code === "C-3121") {
          setEmailError(true);
          setLoading(false);
        } else if (data.code === "C-3111") {
          setEmailError(true);
          setPasswordError(true);
          setLoading(false);
        } else if (data.code === "C-3131") {
          setPasswordError(true);
          setLoading(false);
        } else if (data.code === "C-3141") {
          setEmailNotVerifiedError(true);
          setLoading(false);
        } else {
          setPasswordError(false);
          setEmailError(false);
          setLoading(false);
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

  const handleResendEmail = async () => {
    setResendEmailLoading(true);
    let data = await Auth.resendVerificationEmail(email);
    if (data.code === "C-1251") {
      sessionStorage.setItem('Token', data.token);
      sessionStorage.setItem('Pseudo', data.pseudo);
      sessionStorage.setItem('email', data.email);
      navigate('/verify');
    }
    if (data.code === "C-2501") {
      setEmailError(true);
    }
    

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
              {emailNotVerifiedError && (
                <div>
                  <p className="text-red-500 text-sm">Email non vérifié</p>
                  <Button 
                    onClick={handleResendEmail} 
                    disabled={resendEmailLoading}
                    className="mt-2 hover:cursor-pointer"
                  >
                    {resendEmailLoading ? "Sending..." : "Resend Verification Email"}
                  </Button>
                </div>
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
          <Button type="submit" className="w-full hover:cursor-pointer mt-8" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
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