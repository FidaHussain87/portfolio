
import { motion } from 'framer-motion';
import { GithubIcon, Linkedin, Twitter } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 text-center"
      >
        <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Full Stack Developer
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Turning ideas into elegant, scalable solutions
        </p>
        <div className="flex justify-center gap-6">
          <motion.a 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="#" 
            className="text-gray-300 hover:text-white"
          >
            <GithubIcon size={24} />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="#" 
            className="text-gray-300 hover:text-white"
          >
            <Linkedin size={24} />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="#" 
            className="text-gray-300 hover:text-white"
          >
            <Twitter size={24} />
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
