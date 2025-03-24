import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Import the Loader2 component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Auth } from "../../data/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [pseudoError, setPseudoError] = useState(false); // Add pseudo error state
  const [emailError, setEmailError] = useState(false); // Add email error state
  const [requiredFieldsError, setRequiredFieldsError] = useState(false); // Add required fields error state

  const navigate = useNavigate();

  const evaluatePasswordStrength = (password: string) => {
    let strength = 0;
  
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
  
    if (strength <= 2) {
      return "Weak";
    } else if (strength <= 4) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    setPseudoError(false); // Reset pseudo error state
    setEmailError(false); // Reset email error state
    setRequiredFieldsError(false); // Reset required fields error state
    try {
      let credentials = { email, password, pseudo };
      console.log('Sending signup data:', credentials); // Log the data being sent
      const response = await Auth.signup({ email, password, pseudo });
      console.log('Signup successful:', response);

      if(response.code === "C-1251") {
        sessionStorage.setItem('Token', response.token);
        sessionStorage.setItem('Pseudo', response.pseudo);
        sessionStorage.setItem('email', response.email);
        sessionStorage.setItem('id', response.id);


        navigate('/verify');
      } else if(response.code === "C-3242") {
        setPseudoError(true); // Set pseudo error state
      } else if(response.code === "C-3241") {
        setEmailError(true); // Set email error state

      } else if(response.code === "C-3111") {
        setRequiredFieldsError(true); // Set required fields error state
      }
      // Handle successful signup (e.g., redirect to login page)
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup error (e.g., display error message)
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Enter your informations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {requiredFieldsError && (
              <p className="text-red-500 text-sm">All fields are required</p>
            )}
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
                <p className="text-red-500 text-sm">Email already exists</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="pseudo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pseudo
              </label>
              <Input
                id="pseudo"
                placeholder="Pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className={pseudoError ? "border-red-500" : ""}
              />
              {pseudoError && (
                <p className="text-red-500 text-sm">Pseudo already exists</p>
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
          <Button type="submit" className="w-full hover:cursor-pointer mt-8" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}