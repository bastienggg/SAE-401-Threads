import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Auth } from "../../data/auth";
import { Loader2 } from "lucide-react"; // Import the Loader2 component

export default function VerifyComponent() {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [resendLoading, setResendLoading] = useState(false); // Add resend loading state
  const [resendMessage, setResendMessage] = useState(""); // Add resend message state

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    const email = sessionStorage.getItem('email'); // Assuming email is stored in session storage
    if (!email) {
      throw new Error('Email not found in session storage');
    }
    const response = await Auth.verify({ email, verificationCode: code });
    setLoading(false); // Set loading state to false
    if(response.code === "C-1301") {
      navigate('/home');
    } else if(response.code === "C-3231") {
      setErrorMessage("Le code n'est pas valide");
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true); // Set resend loading state to true
    const email = sessionStorage.getItem('email'); // Assuming email is stored in session storage
    if (!email) {
      throw new Error('Email not found in session storage');
    }
    const response = await Auth.resendVerificationEmail(email);
    setResendLoading(false); // Set resend loading state to false
    if(response.code === "C-1251") {
      setResendMessage("Email de vérification renvoyé");
      setTimeout(() => setResendMessage(""), 5000); // Clear message after 5 seconds
    } else {
      setErrorMessage("Erreur lors de l'envoi de l'email de vérification");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Code</CardTitle>
        <CardDescription>Enter the code you have received in Email</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="code"
                placeholder="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={errorMessage ? "input-error" : ""}
              />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
          <Button type="submit" className="w-full hover:cursor-pointer mt-8" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
        <div className="text-center mt-4">
          <button onClick={handleResendEmail} className="text-primary hover:underline hover:cursor-pointer" disabled={resendLoading}>
            {resendLoading ? (
              <>
                Sending...
              </>
            ) : (
              resendMessage || "Resend Verification Email"
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}