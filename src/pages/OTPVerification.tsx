import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/config/api";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from state passed during navigation
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email is provided, redirect back to forgot password
      toast({
        title: "Error",
        description: "Email information missing. Please try again.",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [location, navigate, toast]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP sent to your email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/password-reset/verify", { email, otp });
      
      toast({
        title: "OTP Verified",
        description: "OTP verified successfully. Please set your new password",
      });
      
      // Navigate to reset password page with verification token
      navigate("/reset-password", { 
        state: { 
          verificationToken: response.data.verificationToken,
          email: email
        } 
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email information missing. Please try again.",
        variant: "destructive",
      });
      navigate("/forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/password-reset/forgot", { email });
      
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>
            Enter the OTP sent to {email}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleVerifyOTP}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter the 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="text-center text-lg tracking-wider"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <div className="text-sm text-center space-y-2">
              <p>
                Didn't receive the OTP?{" "}
                <button 
                  type="button"
                  onClick={handleResendOTP} 
                  className="text-blue-600 hover:underline"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </p>
              <p className="text-gray-600">
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                  Back to Forgot Password
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
