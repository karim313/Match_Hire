'use client'

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Check, Briefcase, TrendingUp, Loader2, X, FileCheck2, Brain, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import {
  extractMatchPercent,
  getJobMatchPercent,
  parseSkills,
  parseSuggestedJobs,
} from '@/lib/cvAnalysis';

/* ─── Drag & Drop Upload Zone ─────────────────────── */
function UploadZone({
  onFile,
  analyzing,
}: {
  onFile: (file: File) => void;
  analyzing: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="منطقة رفع السيرة الذاتية — اسحب وأفلت أو انقر للاختيار"
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      className="relative w-full rounded-3xl cursor-pointer select-none outline-none transition-all duration-300 group"
      style={{
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
        border: dragging
          ? '2px dashed rgba(79,142,247,0.8)'
          : '2px dashed rgba(255,255,255,0.1)',
        background: dragging
          ? 'rgba(79,142,247,0.06)'
          : 'rgba(255,255,255,0.02)',
        boxShadow: dragging
          ? '0 0 40px rgba(79,142,247,0.12), inset 0 0 30px rgba(79,142,247,0.04)'
          : 'none',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        aria-hidden="true"
      />

      {/* Inner glow when dragging */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(79,142,247,0.08) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <motion.div
          animate={dragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors"
          style={{
            background: dragging
              ? 'rgba(79,142,247,0.2)'
              : 'rgba(79,142,247,0.08)',
            border: dragging
              ? '1px solid rgba(79,142,247,0.4)'
              : '1px solid rgba(79,142,247,0.15)',
            boxShadow: dragging
              ? '0 8px 32px rgba(79,142,247,0.25)'
              : 'none',
          }}
        >
          <Upload
            className="w-9 h-9 transition-colors"
            style={{ color: dragging ? '#4f8ef7' : 'rgba(255,255,255,0.35)' }}
          />
        </motion.div>

        {/* Text */}
        <motion.h3
          animate={{ color: dragging ? '#4f8ef7' : '#ffffff' }}
          className="text-xl font-bold mb-2 transition-colors"
        >
          {dragging ? 'أفلت الملف هنا' : 'اسحب وأفلت السيرة الذاتية'}
        </motion.h3>

        <p className="text-white/35 text-sm mb-1">
          أو{' '}
          <span className="text-blue-400 underline underline-offset-2 group-hover:text-blue-300 transition-colors">
            انقر لاختيار الملف
          </span>
        </p>
        <p className="text-white/20 text-xs mt-2">PDF · DOC · DOCX — حتى 5 ميجابايت</p>

        {/* Supported formats row */}
        <div className="flex items-center gap-3 mt-6">
          {['PDF', 'DOC', 'DOCX'].map(fmt => (
            <span
              key={fmt}
              className="px-3 py-1 rounded-lg text-[10px] font-semibold tracking-wide"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── File Preview Card ───────────────────────────── */
function FileCard({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl mt-4"
      style={{
        background: 'rgba(79,142,247,0.06)',
        border: '1px solid rgba(79,142,247,0.15)',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(79,142,247,0.12)' }}
      >
        <FileCheck2 className="w-5 h-5 text-blue-400" />
      </div>
      <p className="flex-1 text-sm text-white/70 truncate">{name}</p>
      <button
        onClick={e => { e.stopPropagation(); onRemove(); }}
        aria-label="إزالة الملف"
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-white/30" />
      </button>
    </motion.div>
  );
}

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const interval = 1000 / 60;
    const increment = end / (duration * 60);
    
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}%</span>;
}

/* ─── AI Thinking Experience ────────────────────────── */
const THINKING_STEPS = [
  { text: "جاري قراءة محتوى الملف...", icon: FileText },
  { text: "استخراج المهارات والخبرات...", icon: Brain },
  { text: "تحليل البيانات بالذكاء الاصطناعي...", icon: Zap },
  { text: "مطابقة مهاراتك مع سوق العمل...", icon: Target }
];

function AiThinking() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < THINKING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-10 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 animate-pulse" />
      
      <div className="relative z-10">
        <div className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center">
          {/* Rotating Rings */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-primary/40 border-r-2 border-transparent"
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-b-2 border-purple-500/40 border-l-2 border-transparent"
          />
          <motion.div 
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 bg-primary/20 rounded-full blur-md absolute"
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.5, rotate: 45 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const Icon = THINKING_STEPS[currentStep].icon;
                return <Icon className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="h-16 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <h3 className="text-lg font-bold text-white mb-1 tracking-wide">
                {THINKING_STEPS[currentStep].text}
              </h3>
              <p className="text-white/40 text-xs">الرجاء الانتظار، لا تغلق الصفحة</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / THINKING_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

function ScanningJobsSkeleton() {
  return (
    <div className="glass-card p-6 overflow-hidden relative min-h-[300px]">
      <motion.div 
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-primary/60 blur-[1px] z-20"
        style={{ boxShadow: "0 0 12px rgba(79,142,247,0.8)" }}
      />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(79,142,247,0.8)]"
        />
        <span className="text-white/80 text-sm font-medium tracking-wide">
          جاري مسح قاعدة البيانات...
        </span>
      </div>

      <div className="space-y-3 relative z-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 rounded-xl border border-white/5 bg-white/5 overflow-hidden relative">
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────── */
export function CVUpload() {
  const router = useRouter();
  const { data: session } = useSession();
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ skills: string[]; jobs: any[]; matchPercent: number } | null>(null);
  const [fileName, setFileName] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) router.push('/login');
  }, [session, router]);

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setPendingFile(file);
    setAnalyzing(true);
    setUploaded(false);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/cv/analyze-and-suggest-jobs', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء تحليل الملف.');
      }

      const skills = parseSkills(data);
      const jobs = parseSuggestedJobs(data);
      const matchPercent = extractMatchPercent(data, skills, jobs) ?? 0;

      setResults({ skills, jobs, matchPercent });
      setUploaded(true);
      toast.success('تم تحليل السيرة الذاتية بنجاح!');
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ أثناء تحليل الملف. يرجى المحاولة مرة أخرى.');
      console.error(err);
      setPendingFile(null);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const reset = () => {
    setUploaded(false);
    setAnalyzing(false);
    setResults(null);
    setFileName('');
    setPendingFile(null);
  };

  return (
    <div className="w-full relative z-10 min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-2 section-title text-xl sm:text-2xl md:text-3xl">
            تحليل السيرة الذاتية
          </h2>
          <p className="text-white/40 text-sm">
            ارفع ملفك واحصل على تحليل ذكي للوظائف المناسبة والمهارات
          </p>
        </motion.div>

        {/* Two-column grid / Single column centered on mobile */}
        <div className={`grid gap-6 items-start ${
          uploaded && results 
            ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl lg:max-w-7xl mx-auto' 
            : 'grid-cols-1 lg:grid-cols-2'
        }`}>

          {/* ── Left: Upload/Success (Main Column) ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`w-full ${uploaded && results ? 'max-w-md lg:max-w-none mx-auto' : ''}`}
          >
            <AnimatePresence mode="wait">
              {!uploaded && !analyzing ? (
                <motion.div key="upload-zone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <UploadZone onFile={processFile} analyzing={analyzing} />
                </motion.div>
              ) : analyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AiThinking />
                </motion.div>
              ) : (
                 <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 sm:p-8 text-center w-full shadow-2xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h3 className="text-green-400 font-bold text-xl mb-1">تم بنجاح! 🎉</h3>
                  <p className="text-white/30 text-xs truncate px-4 mb-6">{fileName}</p>
                  <button onClick={reset} className="btn-secondary py-2.5 px-6 text-xs mx-auto">
                    رفع ملف تاني
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File preview card */}
            <AnimatePresence>
              {pendingFile && !analyzing && (
                <FileCard name={fileName} onRemove={reset} />
              )}
            </AnimatePresence>

            {/* Skills (Appears below success on mobile) */}
            <AnimatePresence>
              {!analyzing && uploaded && results && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 glass-card p-5 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 font-bold text-sm text-white/80">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      المهارات المستخرجة
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {results.skills.map((s, i) => {
                      const status = i % 3 === 0 ? 'matched' : i % 5 === 0 ? 'partial' : 'matched';
                      return (
                        <motion.span
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className={`px-3 py-1 rounded-lg text-[10px] font-medium border ${
                            status === 'matched' 
                              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                              : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {s}
                        </motion.span>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Right: Results (Secondary Column) ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`w-full ${uploaded && results ? 'max-w-md lg:max-w-none mx-auto' : ''}`}
          >
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ScanningJobsSkeleton />
                </motion.div>
              ) : uploaded && results ? (
                 <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 w-full"
                >
                  {/* Compatibility Score Card */}
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-3xl border border-primary/20 bg-primary/5 text-center relative overflow-hidden shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 p-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    </div>
                    <p className="text-white/50 text-[10px] mb-1 uppercase font-bold">نسبة التوافق</p>
                    <div className="text-5xl font-black text-primary mb-2">
                      <CountUp end={results.matchPercent} />
                    </div>
                    <p className="text-white/40 text-[9px]">
                      تم تحليل مهاراتك ومقارنتها بسوق العمل.
                    </p>
                  </motion.div>

                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-bold flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-primary" />
                      وظائف مقترحة
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {results.jobs.map((job, i) => {
                      const jobMatch = getJobMatchPercent(job);
                      return (
                      <motion.a
                        key={i}
                        href={job.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="job-card flex items-center justify-between group p-3 sm:p-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                            <Briefcase className="w-4 h-4 text-primary/60" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-xs truncate">{job.title}</p>
                            <span className="text-white/35 text-[10px]">{job.source || 'Wuzzuf'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {jobMatch !== null && (
                            <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                              {jobMatch}%
                            </span>
                          )}
                          <span className="text-white/20 group-hover:text-primary transition-colors">←</span>
                        </div>
                      </motion.a>
                    );})}
                  </div>

                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-primary w-full py-4 text-sm font-bold shadow-xl"
                  >
                    عرض التفاصيل في لوحة التحكم
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  className="glass-card p-14 text-center"
                >
                  <Briefcase className="w-10 h-10 mb-4 mx-auto text-white/20" />
                  <p className="text-sm text-white/50">فرصك الوظيفية بانتظارك</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
