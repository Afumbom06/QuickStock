import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { BarChart3, Package, TrendingUp, Wifi, ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: BarChart3,
    title: 'Track Your Sales',
    description: 'Record every sale easily and watch your business grow. Support for cash and mobile money payments.',
    color: 'bg-blue-500',
  },
  {
    icon: Package,
    title: 'Manage Inventory',
    description: 'Keep track of your stock levels and get alerts when items are running low. Never run out of products!',
    color: 'bg-green-500',
  },
  {
    icon: TrendingUp,
    title: 'View Reports',
    description: 'Get insights into your business with beautiful charts and analytics. Make data-driven decisions.',
    color: 'bg-purple-500',
  },
  {
    icon: Wifi,
    title: 'Works Offline',
    description: "No internet? No problem! Mini-ERP works completely offline and syncs when you're back online.",
    color: 'bg-orange-500',
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-200, 200], [-15, 15]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (info.offset.x < -threshold && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/dashboard');
  };

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {currentSlide + 1} / {slides.length}
        </div>
        {!isLastSlide && (
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
        )}
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ x, rotateZ }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`inline-flex items-center justify-center w-32 h-32 ${slides[currentSlide].color} rounded-3xl mb-8 shadow-lg`}
              >
                {(() => {
                  const Icon = slides[currentSlide].icon;
                  return <Icon className="w-16 h-16 text-white" />;
                })()}
              </motion.div>

              {/* Content */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl text-gray-900 mb-4"
              >
                {slides[currentSlide].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 mb-8 leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 space-y-4">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentSlide(currentSlide - 1)}
              className="flex-1 h-12"
            >
              Previous
            </Button>
          )}
          
          {isLastSlide ? (
            <Button
              onClick={handleGetStarted}
              className={`${currentSlide === 0 ? 'w-full' : 'flex-1'} h-12`}
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentSlide(currentSlide + 1)}
              className={`${currentSlide === 0 ? 'w-full' : 'flex-1'} h-12`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Swipe Hint */}
        <p className="text-center text-sm text-gray-500">
          Swipe or tap to navigate
        </p>
      </div>
    </div>
  );
}
