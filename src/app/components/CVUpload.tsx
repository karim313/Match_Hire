
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Check, Briefcase, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cvService } from '@/services/cvService';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function CVUpload() {
  const router = useRouter();
  const { data: session } = useSession();
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ skills: string[], jobs: any[] } | null>(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setAnalyzing(true);
    setUploaded(false);
    setResults(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await cvService.analyzeAndSuggestJobs(formData);
      setResults({
        skills: data.extractedWords?.skills || [],
        jobs: data.suggestedJobs || []
      });
      setUploaded(true);
      toast.success('تم تحليل السيرة الذاتية بنجاح!');
    } catch (err: any) {
      toast.error('حدث خطأ أثناء تحليل الملف. يرجى المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

 return (
  <div className="w-full relative z-10 min-h-screen overflow-x-hidden ">
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 text-center sm:text-right"
      >
        <h2 className="mb-2 section-title text-xl sm:text-2xl md:text-3xl">
          تحليل السيرة الذاتية
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
          ارفع ملفك للحصول على تحليل ذكي للوظائف والمهارات
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-start">

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <div className={`border-2 border-dashed relative overflow-hidden transition-all duration-500 
            rounded-2xl sm:rounded-[2rem] 
            p-4 sm:p-6 md:p-10 text-center ${
              uploaded
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-white/10 bg-white/5'
            }`}>

            {!uploaded && !analyzing && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  ارفع سيرتك الذاتية
                </h3>

                <p className="text-white/40 text-xs sm:text-sm mb-6 sm:mb-8">
                  PDF, DOCX حتى 5 ميجابايت
                </p>

                <input
                  type="file"
                  id="cv-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />

                <label
                  htmlFor="cv-upload"
                  className="btn-primary w-full sm:w-auto justify-center cursor-pointer inline-flex items-center gap-2 py-3 text-sm hover:scale-105 transition"
                >
                  اختيار الملف
                </label>
              </motion.div>
            )}

            {/* Loading */}
            <AnimatePresence>
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 relative">
                    <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-xl sm:rounded-2xl animate-spin" />
                    <FileText className="absolute inset-0 m-auto w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-1">
                    جارٍ التحليل...
                  </h3>

                  <p className="text-white/40 text-xs sm:text-sm">
                    الذكاء الاصطناعي يقوم بمعالجة ملفك
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {!analyzing && uploaded && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-4"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />
                  </div>

                  <h3 className="text-green-400 font-bold text-lg sm:text-xl mb-1">
                    تم بنجاح!
                  </h3>

                  <p className="text-white/30 text-xs mb-6 truncate px-2">
                    {fileName}
                  </p>

                  <button
                    onClick={() => setUploaded(false)}
                    className="btn-ghost text-xs hover:scale-105 transition"
                  >
                    رفع ملف جديد
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skills */}
          <AnimatePresence>
            {!analyzing && uploaded && results && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 glass-card p-4 sm:p-6"
              >
                <h3 className="flex items-center gap-2 font-bold mb-3 text-xs sm:text-sm md:text-base">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  المهارات المستخرجة
                </h3>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {results.skills.map((s, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="skill-tag text-[10px] sm:text-xs md:text-sm px-2 py-1"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <AnimatePresence mode="wait">

            {analyzing ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-spin" />
                  <span className="text-white/70 text-xs sm:text-sm font-medium">
                    جارٍ جلب أفضل الوظائف...
                  </span>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 sm:h-20 bg-white/5 rounded-xl animate-pulse" />
                  ))}
                </div>
              </motion.div>

            ) : uploaded && results ? (

              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >

                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    وظائف مقترحة
                  </h3>

                  <span className="text-[10px] sm:text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {results.jobs.length} وظيفة
                  </span>
                </div>

                <div className="space-y-2">
                  {results.jobs.map((job, i) => (
                    <motion.a
                      key={i}
                      href={job.url || '#'}
                      target="_blank"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="job-card flex items-center justify-between p-3 sm:p-4 rounded-xl group hover:scale-[1.02] transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-primary/20 transition">
                          <Briefcase className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-white font-bold text-xs sm:text-sm truncate">
                            {job.title}
                          </p>
                          <p className="text-white/40 text-[10px] sm:text-[11px]">
                            {job.source || 'Wuzzuf'}
                          </p>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full mt-3 btn-ghost py-3 text-xs sm:text-sm hover:scale-[1.02] transition"
                >
                  عرض في لوحة التحكم
                </button>
              </motion.div>

            ) : (
              <div className="glass-card p-8 sm:p-12 text-center opacity-40">
                <Briefcase className="w-10 h-10 mb-3 mx-auto text-white/20" />
                <p className="text-xs sm:text-sm">
                  فرصك الوظيفية بانتظارك<br />
                  ارفع سيرتك الذاتية الآن
                </p>
              </div>
            )}

          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  </div>
);
}
