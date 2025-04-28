// NarrativeOverlay.jsx
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Loader } from '@react-three/drei'

export default function NarrativeOverlay({ onStart, assetsLoaded }) {
  const [selectedRole, setSelectedRole] = useState(null)

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {!assetsLoaded ? (
        <div className="text-center">
          <Loader />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-white/80"
          >
            Loading magical world...
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 p-8 rounded-3xl max-w-2xl text-center shadow-2xl backdrop-blur-lg border-2 border-white/20"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            The Bridge of Friendship
          </h1>
          <p className="text-xl text-white/80 mb-8">
            "Two heroes must unite to unlock the path forward. Choose your destiny!"
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-2xl transition-all ${selectedRole === 'Map Keeper' ? 'bg-blue-600/90 shadow-lg' : 'bg-blue-800/50'} backdrop-blur-sm`}
              onClick={() => setSelectedRole('Map Keeper')}
            >
              <div className="text-4xl mb-2 animate-float">🗺️</div>
              <h3 className="text-xl font-bold text-white">Map Keeper</h3>
              <p className="text-sm opacity-80 mt-2">Decipher the ancient clues</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-2xl transition-all ${selectedRole === 'Key Holder' ? 'bg-yellow-600/90 shadow-lg' : 'bg-yellow-800/50'} backdrop-blur-sm`}
              onClick={() => setSelectedRole('Key Holder')}
            >
              <div className="text-4xl mb-2 animate-float">🔑</div>
              <h3 className="text-xl font-bold text-white">Key Holder</h3>
              <p className="text-sm opacity-80 mt-2">Unlock hidden paths</p>
            </motion.button>
          </div>

          <motion.button
            onClick={() => onStart(selectedRole)}
            disabled={!selectedRole}
            className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-pink-500 hover:to-yellow-500 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Begin Adventure 🚀</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'linear'
              }}
            />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}