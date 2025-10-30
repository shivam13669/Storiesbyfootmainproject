import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup:", { signupEmail, signupPassword });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-white border-0 p-0 overflow-hidden shadow-2xl max-h-[85vh] rounded-lg" style={{width: '85vw', maxWidth: '1000px'}}>
        <DialogTitle className="sr-only">Login or Sign Up</DialogTitle>
        <div className="flex h-full min-h-[600px]">
          {/* Left Side - Premium Hero Image */}
          <div className="hidden md:flex md:w-[55%] relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=80"
              alt="Adventure experience"
              className="w-full h-full object-cover"
            />
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex flex-col justify-between p-6">
              <div className="text-white">
                <div className="inline-block bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-4">
                  ✨ TRUSTED BY TRAVELERS
                </div>
                <h3 className="text-2xl font-bold leading-tight">
                  Discover Your Next Adventure
                </h3>
              </div>
              
              <div className="space-y-3 text-white/90 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" />
                  <span>Experience 20,000+ verified activities</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" />
                  <span>1,500+ trusted suppliers worldwide</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" />
                  <span>Best price guarantee on every booking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Premium Form */}
          <div className="w-full md:w-[45%] flex flex-col bg-white overflow-y-auto">
            <Tabs defaultValue="login" className="w-full flex flex-col h-full">
              {/* Premium Tab Headers */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <TabsList className="w-full rounded-none bg-white p-0 h-auto flex justify-start gap-0">
                  <TabsTrigger
                    value="login"
                    className="flex-1 px-6 py-3.5 rounded-none text-sm font-bold text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-orange-500 data-[state=active]:bg-gray-50/50 hover:text-gray-900 hover:bg-gray-50/30 transition-colors"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="flex-1 px-6 py-3.5 rounded-none text-sm font-bold text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-orange-500 data-[state=active]:bg-gray-50/50 hover:text-gray-900 hover:bg-gray-50/30 transition-colors"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Login Tab */}
              <TabsContent value="login" className="mt-0 flex-1 overflow-y-auto">
                <div className="p-7 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Welcome Back
                    </h2>
                    <p className="text-sm text-gray-600">
                      Log in to your account and explore amazing experiences
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex justify-between items-center pt-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                          Remember me
                        </span>
                      </label>
                      <a
                        href="#"
                        className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Login & Explore
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex items-center gap-3 py-1">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Or continue with
                    </span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  {/* Google & Facebook Sign In */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="border-2 border-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200 flex items-center justify-center gap-2 group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm">Google</span>
                    </button>
                    <button className="border-2 border-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 flex items-center justify-center gap-2 group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-sm">Facebook</span>
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-700">
                      Don't have an account?{" "}
                      <button
                        onClick={() => {
                          const loginTab = document.querySelector('[value="login"]');
                          const signupTab = document.querySelector('[value="signup"]');
                          if (signupTab) signupTab.click();
                        }}
                        className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                      >
                        Sign up free
                      </button>
                    </p>
                  </div>

                  {/* Trust Section */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                      🏆 Book With Confidence
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-green-50 to-green-50/50 p-3 rounded-lg border border-green-100">
                        <div className="text-lg font-bold text-green-600">4.8</div>
                        <p className="text-xs text-gray-600 mt-1">2.5K+ Reviews</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <div className="text-lg font-bold text-blue-600">4.6</div>
                        <p className="text-xs text-gray-600 mt-1">15K+ Bookings</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms Text */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By continuing, you agree to StoriesByFoot's{" "}
                    <a href="#" className="text-orange-600 hover:underline">
                      Terms & Conditions
                    </a>
                  </p>
                </div>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="mt-0 flex-1 overflow-y-auto">
                <div className="p-7 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Create Your Account
                    </h2>
                    <p className="text-sm text-gray-600">
                      Join thousands of travelers and start your adventure today
                    </p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <label className="flex items-start gap-2 cursor-pointer group mt-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer mt-0.5"
                        required
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        I agree to the{" "}
                        <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
                          Terms & Conditions
                        </a>
                      </span>
                    </label>

                    {/* Sign Up Button */}
                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Create Account
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex items-center gap-3 py-1">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Or continue with
                    </span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  {/* Google & Facebook Sign Up */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="border-2 border-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200 flex items-center justify-center gap-2 group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm">Google</span>
                    </button>
                    <button className="border-2 border-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 flex items-center justify-center gap-2 group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-sm">Facebook</span>
                    </button>
                  </div>

                  {/* Already Have Account Link */}
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-700">
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          const loginTab = document.querySelector('[value="login"]');
                          if (loginTab) loginTab.click();
                        }}
                        className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                      >
                        Login here
                      </button>
                    </p>
                  </div>

                  {/* Trust Section */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                      🏆 Book With Confidence
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-green-50 to-green-50/50 p-3 rounded-lg border border-green-100">
                        <div className="text-lg font-bold text-green-600">4.8</div>
                        <p className="text-xs text-gray-600 mt-1">2.5K+ Reviews</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <div className="text-lg font-bold text-blue-600">4.6</div>
                        <p className="text-xs text-gray-600 mt-1">15K+ Bookings</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms Text */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By continuing, you agree to StoriesByFoot's{" "}
                    <a href="#" className="text-orange-600 hover:underline">
                      Terms & Conditions
                    </a>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogClose className="hidden" />
      </DialogContent>
    </Dialog>
  );
};
