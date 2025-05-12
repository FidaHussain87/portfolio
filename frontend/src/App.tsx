import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black text-white min-h-screen"
    >
      <Navbar />
      <Hero />
    </motion.div>
  );
}