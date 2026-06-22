'use client'

import { useRouter } from 'next/navigation';
import { FileText, Download, X, CheckCircle, TrendingUp, Loader2, Upload, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useSession } from 'next-auth/react';

import { useState, useEffect, type ReactNode } from 'react';
import {
  extractMatchPercent,
  getJobMatchPercent,
  parseSkills,
  parseSuggestedJobs,
} from '@/lib/cvAnalysis';

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof FileText;
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="stat-card flex items-start justify-between gap-4">
      <div>
        <p className="saas-metric-value">{value}</p>
        <p className="saas-metric-label">{label}</p>
      </div>
      <div className="icon-badge shrink-0">
        <Icon className="w-4 h-4" aria-hidden />
      </div>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'مستخدم غير معروف');
  const [documents, setDocuments] = useState<any[]>([]);
  const [stats, setStats] = useState({ cvCount: 0, views: 0, matches: 0, matchPercent: null as number | null });
  const [loading, setLoading] = useState(true);
  const [selectedCv, setSelectedCv] = useState<any>(null);

  useEffect(() => {
    // If session is still loading, wait
    if (session === undefined) return;

    // If no session, redirect to login
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [cvsRes, allJobsRes] = await Promise.all([
          fetch('/api/cv/my-cvs'),
          fetch('/api/jobs')
        ]);
        const cvsData = cvsRes.ok ? await cvsRes.json() : [];
        const allJobsData = allJobsRes.ok ? await allJobsRes.json() : [];
        
        const sortedCvs = (cvsData || []).sort((a: any, b: any) => 
          new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
        );
        
        const allJobs = Array.isArray(allJobsData) ? allJobsData : [];

        // Helper to get jobs list for a CV
        const getCvJobs = (cv: any) => {
          const analysis = cv.analysis || {};
          const jobsSource = analysis.suggestedJobs || analysis.suggested_jobs || 
                             analysis.jobs || analysis.jobSuggestions || analysis.matchedJobs || 
                             analysis.jobMatches || cv.suggestedJobs || cv.jobs;
          
          let jobs = [];
          if (jobsSource) {
            try {
              jobs = typeof jobsSource === 'string' ? JSON.parse(jobsSource) : jobsSource;
            } catch (e) {
              jobs = [];
            }
          }

          // Fallback matching if empty
          if (!Array.isArray(jobs) || jobs.length === 0) {
            let skills = [];
            if (analysis.skills) {
              try {
                skills = typeof analysis.skills === 'string' ? JSON.parse(analysis.skills) : analysis.skills;
              } catch (e) {
                skills = [];
              }
            }
            if (Array.isArray(skills) && skills.length > 0) {
              jobs = allJobs.filter((job: any) => 
                skills.some(skill => 
                  job.title?.toLowerCase().includes(skill.toLowerCase())
                )
              ).slice(0, 10);
            }
          }
          return Array.isArray(jobs) ? jobs : [];
        };

        // Aggregating statistics across all CVs
        const uniqueJobsMap = new Map<string, any>();
        let compatibilityScoresSum = 0;
        let validCvsWithScoresCount = 0;

        sortedCvs.forEach((cv: any) => {
          const cvJobs = getCvJobs(cv);
          
          // Add unique jobs
          cvJobs.forEach((job: any) => {
            if (job && job.title) {
              const key = job.url || job.title;
              if (!uniqueJobsMap.has(key)) {
                uniqueJobsMap.set(key, job);
              }
            }
          });

          // Calculate match percent for this CV
          const percent = extractMatchPercent(
            { ...cv, analysis: cv.analysis || {} },
            parseSkills({ ...cv, analysis: cv.analysis || {} }),
            parseSuggestedJobs({ ...cv, analysis: cv.analysis || {}, jobs: cvJobs.length ? cvJobs : undefined })
          );

          if (percent !== null) {
            compatibilityScoresSum += percent;
            validCvsWithScoresCount++;
          }
        });

        const totalUniqueMatches = uniqueJobsMap.size;
        const averageMatchPercent = validCvsWithScoresCount > 0 
          ? Math.round(compatibilityScoresSum / validCvsWithScoresCount) 
          : null;

        setDocuments(sortedCvs);
        setStats({
          cvCount: sortedCvs.length,
          views: 0,
          matches: totalUniqueMatches,
          matchPercent: averageMatchPercent,
        });
        (window as any).allJobs = allJobs;
      } catch (err) {
        console.error('Detailed Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session, router]);

  const handleDownload = async (storedFileName: string, originalFileName: string) => {
    if (!storedFileName) {
      toast.error('عذراً، اسم الملف غير موجود');
      return;
    }

    try {
      const response = await fetch(`/api/cv/download/${storedFileName}`);
      
      if (!response.ok) {
        throw new Error('No data received from server');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFileName || 'cv.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('بدأ التحميل...');
    } catch (err: any) {
      console.error('Download error details:', err);
      const status = err.response?.status;
      if (status === 404) {
        toast.error('الملف غير موجود على الخادم (404)');
      } else {
        toast.error('حدث خطأ أثناء تحميل الملف');
      }
    }
  };

  return (
    <div className="w-full relative z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Page header */}
        <header className="saas-page-header mt-20 sm:mt-24">
          <p className="saas-label">نظرة عامة</p>
          <h1 className="section-title mb-2">لوحة التحكم</h1>
          <p className="saas-subtitle">
            مرحباً بك، <span className="text-foreground font-medium">{displayName}</span>. إليك ملخص نشاطك وسيرك الذاتية.
          </p>
        </header>

        {loading ? (
          <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="جاري التحميل">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="stat-card h-[5.5rem] bg-zinc-800/40" />
              ))}
            </div>
            <div className="saas-profile-card h-28 bg-zinc-800/30" />
            <div className="glass-card p-6 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-zinc-800/30" />
              ))}
            </div>
            <div className="flex justify-center py-6 text-zinc-500 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              جاري تحميل البيانات...
            </div>
          </div>
        ) : (
        <>
        {/* Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          <StatCard icon={FileText} value={stats.cvCount} label="سيرة ذاتية محملة" />
          <StatCard icon={TrendingUp} value={stats.matches} label="وظيفة متاحة" />
          <StatCard
            icon={CheckCircle}
            value={stats.matchPercent !== null ? `${stats.matchPercent}%` : '—'}
            label="نسبة التوافق"
          />
        </motion.div>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="saas-profile-card mb-6"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="saas-avatar" aria-hidden>
                {getInitials(displayName)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">{displayName}</h2>
                <p className="text-sm text-zinc-400 mt-0.5">{user?.email || 'لا يوجد بريد إلكتروني'}</p>
                <span className="saas-badge-muted saas-badge mt-2">
                  {user?.role === 'User' ? 'مستخدم' : user?.role || 'مستخدم'}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push('/upload')}
              className="btn-primary gap-2"
            >
              <Upload className="w-4 h-4" aria-hidden />
              رفع سيرة جديدة
            </button>
          </div>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card overflow-hidden"
        >
          <div className="px-5 sm:px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" aria-hidden />
                إدارة المستندات
              </h3>
              <p className="text-sm text-zinc-500 mt-1">جميع سيرك الذاتية المحللة والمخزنة</p>
            </div>
            <button
              onClick={() => router.push('/upload')}
              className="btn-primary text-sm shrink-0"
            >
              رفع سيرة جديدة
            </button>
          </div>

          <div className="px-3 sm:px-4 py-4">
            <div className="saas-table-header">
              <span>المستند</span>
              <span>الإجراءات</span>
            </div>

            <div className="space-y-1">
              {documents.length > 0 ? (
                documents.map((doc, index) => {
                  let skills = [];
                  try {
                    if (doc.analysis?.skills) {
                      skills = typeof doc.analysis.skills === 'string' 
                        ? JSON.parse(doc.analysis.skills) 
                        : doc.analysis.skills;
                    }
                  } catch (e) {
                    console.error('Error parsing skills for doc:', doc.id, e);
                  }
                  
                  return (
                    <div 
                      key={doc.id || index} 
                      className="job-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                      onClick={() => setSelectedCv(doc)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-blue-400" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate group-hover:text-blue-400 transition-colors">
                            {doc.originalFileName || 'ملف غير معروف'}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-zinc-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" aria-hidden />
                              {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('ar-EG') : 'تاريخ غير معروف'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Target className="w-3 h-3" aria-hidden />
                              {Array.isArray(skills) ? skills.length : 0} مهارة
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <span className="hidden sm:inline-flex saas-badge">
                          <CheckCircle className="w-3 h-3" aria-hidden />
                          مكتمل
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="saas-empty-state">
                  <div className="saas-empty-icon">
                    <FileText className="w-5 h-5" aria-hidden />
                  </div>
                  <p className="text-sm font-medium text-zinc-300 mb-1">لا توجد سير ذاتية مرفوعة بعد</p>
                  <p className="text-xs text-zinc-500 mb-5">ابدأ برفع سيرتك الذاتية للحصول على تحليل ذكي</p>
                  <button
                    onClick={() => router.push('/upload')}
                    className="btn-primary text-sm"
                  >
                    <Upload className="w-4 h-4" aria-hidden />
                    رفع سيرة ذاتية
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        </>
        )}

        {/* Modal */}
        {selectedCv && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6 saas-modal-overlay"
            onClick={() => setSelectedCv(null)}
          >
            <motion.div 
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[85vh] overflow-hidden flex flex-col bg-[#0f0f12] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl z-[1000]"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="saas-label !mb-1">تحليل الذكاء الاصطناعي</p>
                  <h3 className="text-lg font-semibold text-foreground truncate">{selectedCv.originalFileName}</h3>
                </div>
                <button 
                  onClick={() => setSelectedCv(null)}
                  className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-foreground hover:bg-white/5 transition-colors shrink-0"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" aria-hidden />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" aria-hidden />
                    المهارات المستخرجة
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      try {
                        const skills = typeof selectedCv.analysis?.skills === 'string'
                          ? JSON.parse(selectedCv.analysis.skills)
                          : selectedCv.analysis?.skills || [];
                        return Array.isArray(skills) && skills.length > 0 ? (
                          skills.map((s: string, i: number) => (
                            <span key={i} className="skill-tag">{s}</span>
                          ))
                        ) : <p className="text-zinc-500 text-sm">لم يتم استخراج مهارات</p>
                      } catch(e) {
                        return <p className="text-red-400/80 text-sm">خطأ في عرض المهارات</p>
                      }
                    })()}
                  </div>
                </div>

                <div className="saas-section-divider">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" aria-hidden />
                    الوظائف المقترحة
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(() => {
                      try {
                        let jobs = parseSuggestedJobs(selectedCv);

                        if (!jobs || jobs.length === 0) {
                          const allJobs = (window as any).allJobs || [];
                          const skills = parseSkills(selectedCv);
                          if (skills.length > 0) {
                            jobs = allJobs.filter((job: any) => 
                              skills.some((skill: string) => 
                                job.title?.toLowerCase().includes(skill.toLowerCase())
                              )
                            );
                          }
                        }
                        
                        return Array.isArray(jobs) && jobs.length > 0 ? (
                          jobs.map((job: any, i: number) => {
                            const jobMatch = getJobMatchPercent(job);
                            return (
                            <a 
                              key={i} 
                              href={job.url || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="job-card flex flex-col gap-1 group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-sm text-foreground group-hover:text-blue-400 transition-colors line-clamp-2">{job.title}</span>
                                {jobMatch !== null && (
                                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">
                                    {jobMatch}%
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-zinc-500">{job.source || 'Wuzzuf'}</span>
                            </a>
                          );})
                        ) : <p className="text-zinc-500 text-sm col-span-2">لا توجد وظائف مقترحة حالياً</p>
                      } catch(e) {
                        return <p className="text-red-400/80 text-sm">خطأ في عرض الوظائف</p>
                      }
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => setSelectedCv(null)}
                  className="btn-secondary"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
