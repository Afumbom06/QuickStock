import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Store, Loader2, Check, ArrowRight, ArrowLeft, User, Mail, Lock, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Progress } from '../components/ui/progress';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    shopName: '',
    shopCategory: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    emailOrPhone: '',
    shopName: '',
    shopCategory: '',
    password: '',
    confirmPassword: '',
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'emailOrPhone':
        if (!value) return 'Email or phone is required';
        if (value.includes('@')) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return 'Invalid email format';
        } else {
          const phoneRegex = /^[\d\s+()-]+$/;
          if (!phoneRegex.test(value)) return 'Invalid phone format';
        }
        return '';
      case 'shopName':
        if (!value) return 'Shop name is required';
        return '';
      case 'shopCategory':
        if (!value) return 'Shop category is required';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const nameError = validateField('name', formData.name);
      const emailError = validateField('emailOrPhone', formData.emailOrPhone);
      setErrors(prev => ({ ...prev, name: nameError, emailOrPhone: emailError }));
      return !nameError && !emailError;
    } else if (step === 2) {
      const shopNameError = validateField('shopName', formData.shopName);
      const shopCategoryError = validateField('shopCategory', formData.shopCategory);
      setErrors(prev => ({ ...prev, shopName: shopNameError, shopCategory: shopCategoryError }));
      return !shopNameError && !shopCategoryError;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const passwordError = validateField('password', formData.password);
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);

    if (passwordError || confirmPasswordError) {
      setErrors(prev => ({ ...prev, password: passwordError, confirmPassword: confirmPasswordError }));
      return;
    }

    setLoading(true);

    try {
      const success = await signup({
        name: formData.name,
        emailOrPhone: formData.emailOrPhone,
        shopName: formData.shopName,
        shopCategory: formData.shopCategory,
        password: formData.password,
      });

      if (success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error('Account creation failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Create Account Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-12 flex flex-col justify-center order-2 lg:order-1"
          >
            <div className="max-w-md mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl text-blue-900 mb-2">Create Account</h2>
                <p className="text-gray-500">Start managing your shop in minutes</p>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Step {currentStep} of 3</span>
                  <span className="text-sm text-blue-900">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                        <div className="relative mt-2">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            onBlur={() => handleBlur('name')}
                            className={`pl-11 h-12 border-2 ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-blue-900'}`}
                          />
                        </div>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-600 mt-1"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="emailOrPhone" className="text-gray-700">Email or Phone Number *</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="emailOrPhone"
                            placeholder="your@email.com or +237..."
                            value={formData.emailOrPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, emailOrPhone: e.target.value }))}
                            onBlur={() => handleBlur('emailOrPhone')}
                            className={`pl-11 h-12 border-2 ${errors.emailOrPhone ? 'border-red-500' : 'border-gray-200 focus:border-blue-900'}`}
                          />
                        </div>
                        {errors.emailOrPhone && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-600 mt-1"
                          >
                            {errors.emailOrPhone}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Shop Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label htmlFor="shopName" className="text-gray-700">Shop Name *</Label>
                        <div className="relative mt-2">
                          <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="shopName"
                            placeholder="My Shop"
                            value={formData.shopName}
                            onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                            onBlur={() => handleBlur('shopName')}
                            className={`pl-11 h-12 border-2 ${errors.shopName ? 'border-red-500' : 'border-gray-200 focus:border-blue-900'}`}
                          />
                        </div>
                        {errors.shopName && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-600 mt-1"
                          >
                            {errors.shopName}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="shopCategory" className="text-gray-700">Shop Category *</Label>
                        <Select
                          value={formData.shopCategory}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, shopCategory: value }))}
                        >
                          <SelectTrigger className={`h-12 border-2 mt-2 ${errors.shopCategory ? 'border-red-500' : 'border-gray-200'}`}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Store</SelectItem>
                            <SelectItem value="food">Food & Beverages</SelectItem>
                            <SelectItem value="clothing">Clothing & Fashion</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="cosmetics">Cosmetics & Beauty</SelectItem>
                            <SelectItem value="hardware">Hardware</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.shopCategory && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-600 mt-1"
                          >
                            {errors.shopCategory}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Password */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label htmlFor="password" className="text-gray-700">Password *</Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="At least 6 characters"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            onBlur={() => handleBlur('password')}
                            className={`pl-11 h-12 border-2 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-blue-900'}`}
                          />
                        </div>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-600 mt-1"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password *</Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            onBlur={() => handleBlur('confirmPassword')}
                            className={`pl-11 h-12 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-blue-900'}`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-600 mt-1"
                          >
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 h-12 border-2 border-gray-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className={`${currentStep === 1 ? 'w-full' : 'flex-1'} h-12 bg-blue-900 hover:bg-blue-800 text-white rounded-full`}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 bg-blue-900 hover:bg-blue-800 text-white rounded-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-900 hover:underline">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Welcome Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden order-1 lg:order-2"
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
                HELLO, FRIEND!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-200 mb-8 max-w-sm mx-auto text-lg leading-relaxed"
              >
                Enter your personal details and start your journey with us
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-2 border-white bg-transparent text-white hover:bg-transparent hover:text-blue-400 px-8 py-6 text-lg rounded-full transition-all duration-300"
                  >
                    SIGN IN
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
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-white">Offline Support</p>
                    <p className="text-sm text-blue-300">Works without internet</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-blue-200">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-white">Free Forever</p>
                    <p className="text-sm text-blue-300">No hidden charges</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}