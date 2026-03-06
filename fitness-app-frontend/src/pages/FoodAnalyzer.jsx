import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiX, FiImage, FiInfo } from 'react-icons/fi';
import { GiMeal, GiWheat, GiMeat, GiWaterDrop, GiSugarCane } from 'react-icons/gi';
import { analyzeFoodImage } from '../services/api';
import { staggerContainer, fadeInUp } from '../utils/animations';
import PageWrapper from '../components/ui/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const healthRatingColor = (rating) => {
  if (!rating) return '#94A3B8';
  const r = rating.toLowerCase();
  if (r.includes('healthy') && !r.includes('unhealthy')) return '#00D9A6';
  if (r.includes('moderate')) return '#FBBF24';
  return '#FF6B6B';
};

const NutrientBar = ({ label, value, icon: Icon, color, max = 100 }) => {
  const numericValue = Number.parseInt(value) || 0;
  const pct = Math.min((numericValue / max) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-sm text-slate-400">{label}</span>
        </div>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
};

const FoodAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be under 10MB.');
      return;
    }
    setError(null);
    setResult(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeFoodImage(selectedFile);
      setResult(res.data);
    } catch (err) {
      console.error('Food analysis error:', err);
      const serverMsg = err.response?.data?.error;
      setError(serverMsg || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <GiMeal className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Food Analyzer</h1>
          </div>
          <p className="text-slate-400">Upload a food photo and let AI analyze its nutritional content</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div variants={fadeInUp}>
            <GlassCard hover={false}>
              <h2 className="text-lg font-semibold text-white mb-4">Upload Food Image</h2>

              {!preview ? (
                <div
                  role="button"
                  tabIndex={0}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-primary bg-primary/10'
                      : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
                  }`}
                >
                  <FiUploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-white font-medium mb-1">
                    {dragActive ? 'Drop your image here' : 'Click or drag & drop'}
                  </p>
                  <p className="text-slate-500 text-sm">Supports JPG, PNG, WEBP (max 10MB)</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Food preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={handleClear}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white text-xs">
                      <FiImage className="w-3 h-3" />
                      <span>{selectedFile.name}</span>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-accent text-sm flex items-center gap-2"
                >
                  <FiInfo className="w-4 h-4 shrink-0" />
                  {error}
                </motion.p>
              )}

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || loading}
                  loading={loading}
                  className="flex-1"
                >
                  {loading ? 'Analyzing...' : 'Analyze Food'}
                </Button>
                {preview && (
                  <Button variant="ghost" onClick={handleClear}>
                    Clear
                  </Button>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Results Section */}
          <motion.div variants={fadeInUp}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard hover={false} className="flex flex-col items-center justify-center min-h-[400px]">
                    <LoadingSpinner text="AI is analyzing your food..." />
                    <p className="text-slate-600 text-xs mt-2">This may take a few seconds</p>
                  </GlassCard>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {/* Food Name & Health Rating */}
                  <GlassCard hover={false}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Detected Food</p>
                        <h3 className="text-xl font-bold text-white">{result.foodName}</h3>
                      </div>
                      <div
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          background: `${healthRatingColor(result.healthRating)}15`,
                          color: healthRatingColor(result.healthRating),
                          border: `1px solid ${healthRatingColor(result.healthRating)}30`,
                        }}
                      >
                        {result.healthRating}
                      </div>
                    </div>

                    {/* Calories Highlight */}
                    <div className="bg-white/5 rounded-xl p-4 text-center mb-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estimated Calories</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {result.calories}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">kcal</p>
                    </div>

                    {/* Macro Nutrients */}
                    <div className="space-y-4">
                      <NutrientBar label="Protein" value={result.protein} icon={GiMeat} color="#6C63FF" max={80} />
                      <NutrientBar label="Carbohydrates" value={result.carbohydrates} icon={GiWheat} color="#00D9A6" max={120} />
                      <NutrientBar label="Fat" value={result.fat} icon={GiWaterDrop} color="#FBBF24" max={60} />
                      <NutrientBar label="Fiber" value={result.fiber} icon={GiWheat} color="#A78BFA" max={30} />
                      <NutrientBar label="Sugar" value={result.sugar} icon={GiSugarCane} color="#F472B6" max={50} />
                    </div>
                  </GlassCard>

                  {/* Ingredients */}
                  {result.ingredients?.length > 0 && (
                    <GlassCard hover={false}>
                      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Ingredients</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.ingredients.map((item, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </GlassCard>
                  )}

                  {/* Health Summary */}
                  {result.explanation && (
                    <GlassCard hover={false}>
                      <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Health Summary</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{result.explanation}</p>
                    </GlassCard>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard hover={false} className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <GiMeal className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-medium mb-1">No analysis yet</p>
                    <p className="text-slate-600 text-sm max-w-[280px]">
                      Upload a food image and click "Analyze Food" to get nutritional information
                    </p>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default FoodAnalyzer;
