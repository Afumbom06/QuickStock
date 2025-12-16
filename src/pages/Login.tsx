import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Store, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate authentication (offline-first)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const success = await login(email, password, rememberMe);
      
      if (success) {
        toast.success('Welcome back to QuickStock!', {
          description: 'You have successfully logged in.',
        });
        
        // Redirect to root, which will determine the appropriate dashboard
        navigate('/');
      } else {
        toast.error('Login failed', {
          description: 'Please check your credentials and try again.',
        });
      }
    } catch (error) {
      toast.error('Login failed', {
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Welcome Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden order-2 lg:order-1"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-700 rounded-full opacity-20 -ml-32 -mt-32"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full opacity-10 -mr-48 -mb-48"></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20"
              >
                <Store className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl mb-4"
              >
                WELCOME BACK!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-200 mb-8 max-w-sm mx-auto text-lg leading-relaxed"
              >
                To keep connected with us please login with your personal info
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/signup">
                  <Button
                    variant="outline"
                    className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-900 px-8 py-6 text-lg rounded-full transition-all duration-300"
                  >
                    SIGN UP
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 space-y-4"
              >
                <div className="flex items-center gap-4 text-blue-200">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-white">100% Offline</p>
                    <p className="text-sm text-blue-300">Works without internet</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-blue-200">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-white">Fast & Secure</p>
                    <p className="text-sm text-blue-300">Your data stays safe</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-12 flex flex-col justify-center order-1 lg:order-2"
          >
            <div className="max-w-md mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl text-blue-900 dark:text-blue-400 mb-2">Sign in to QuickStock</h2>
                <p className="text-gray-500 dark:text-gray-400">Enter your credentials to continue</p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-900 dark:focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-900 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-900 dark:focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white rounded-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="text-blue-900 dark:text-blue-400 hover:underline">
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
