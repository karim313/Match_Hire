'use client'

import { useRouter } from 'next/navigation';
import { FileText, Download, Eye, CheckCircle, Clock, Home, Upload, Settings, LogOut, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';

import { useSession } from 'next-auth/react';
import { cvService } from '@/services/cvService';
import { jobService } from '@/services/jobService';
import { useState, useEffect } from 'react';

export function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'مستخدم غير معروف');
  const [documents, setDocuments] = useState<any[]>([]);
  const [stats, setStats] = useState({ cvCount: 0, views: 0, matches: 0 });
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
        const [cvsData, allJobsData] = await Promise.all([
          cvService.getMyCvs(),
          jobService.getAllJobs()
        ]);
        
        const sortedCvs = (cvsData || []).sort((a: any, b: any) => 
          new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
        );
        
        const latestCv = sortedCvs[0];
        let lastMatchCount = 0;
        const allJobs = Array.isArray(allJobsData) ? allJobsData : [];

        if (latestCv) {
          const analysis = latestCv.analysis || {};
          const jobsSource = analysis.suggestedJobs || analysis.suggested_jobs || 
                             analysis.jobs || analysis.jobSuggestions || analysis.matchedJobs || 
                             analysis.jobMatches || latestCv.suggestedJobs || latestCv.jobs;
          
          let jobs = [];
          if (jobsSource) {
            jobs = typeof jobsSource === 'string' ? JSON.parse(jobsSource) : jobsSource;
          }

          // Fallback matching if empty
          if (!Array.isArray(jobs) || jobs.length === 0) {
            let skills = [];
            if (analysis.skills) {
              skills = typeof analysis.skills === 'string' ? JSON.parse(analysis.skills) : analysis.skills;
            }
            if (Array.isArray(skills) && skills.length > 0) {
              jobs = allJobs.filter((job: any) => 
                skills.some(skill => 
                  job.title?.toLowerCase().includes(skill.toLowerCase())
                )
              ).slice(0, 10);
            }
          }
          
          lastMatchCount = Array.isArray(jobs) ? jobs.length : 0;
        }

        setDocuments(sortedCvs);
        setStats({
          cvCount: sortedCvs.length,
          views: 0,
          matches: lastMatchCount
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
      console.log('Attempting to download:', storedFileName);
      const response = await cvService.downloadCv(storedFileName);
      
      if (!response || !response.data) {
        throw new Error('No data received from server');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
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
    <div className="w-full relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 mt-24">
          <h2 className="mb-2 section-title">لوحة التحكم</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            مرحباً بك، {displayName}. إليك ملخص نشاطك وسيرك الذاتية
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
        >
          <div className="stat-card">
            <div className="icon-badge mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold mb-1 text-white">{stats.cvCount}</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>سيرة ذاتية محملة</div>
          </div>

          <div className="stat-card">
            <div className="icon-badge mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold mb-1 text-white">{stats.matches}</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>وظيفة متاحة</div>
          </div>

          <div className="stat-card">
            <div className="icon-badge mb-4">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold mb-1 text-white">
              {stats.cvCount > 0 ? '100%' : '70%'}
            </div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>نسبة الاكتمال</div>
          </div>
        </motion.div>

        <div className="bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="mb-1 font-bold" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
                {displayName}
              </h3>
              <p className="opacity-80 mb-3 text-sm">{user?.email || 'لا يوجد بريد إلكتروني'}</p>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                {user?.role === 'User' ? 'مستخدم' : user?.role || 'مستخدم'}
              </span>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
              👤
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <FileText className="w-5 h-5 text-primary" />
              إدارة المستندات
            </h3>
            <button
              onClick={() => router.push('/upload')}
              className="btn-primary text-sm py-2 px-6"
            >
              رفع سيرة جديدة
            </button>
          </div>

          <div className="space-y-3">
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
                    className="job-card flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => setSelectedCv(doc)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="icon-badge flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white mb-0.5">{doc.originalFileName || 'ملف غير معروف'}</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          <span>📅 {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('ar-EG') : 'تاريخ غير معروف'}</span>
                          <span>🎯 {Array.isArray(skills) ? skills.length : 0} مهارة</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc.storedFileName, doc.originalFileName);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group/btn"
                        title="تحميل الملف"
                      >
                        <Download className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        مكتمل
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-14" style={{ color: 'rgba(255,255,255,0.3)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '1rem' }}>
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>لا توجد سير ذاتية مرفوعة بعد</p>
                <p className="text-xs mt-1 opacity-60">ابدأ برفع سيرتك الذاتية الآن</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed View Modal */}
        {selectedCv && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center pt-20 pb-10 px-4 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelectedCv(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.9)] border-white/10"
              style={{ background: 'rgba(5, 5, 10, 0.98)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{selectedCv.originalFileName}</h3>
                  <p className="text-sm text-white/40">نتائج تحليل الذكاء الاصطناعي</p>
                </div>
                <button 
                  onClick={() => setSelectedCv(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5 rotate-180" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Skills Section */}
                <div>
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-primary">
                    <TrendingUp className="w-5 h-5" />
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
                            <span key={i} className="skill-tag px-3 py-1.5 text-sm">{s}</span>
                          ))
                        ) : <p className="text-white/30 text-sm italic">لم يتم استخراج مهارات</p>
                      } catch(e) {
                        return <p className="text-red-400/60 text-sm">خطأ في عرض المهارات</p>
                      }
                    })()}
                  </div>
                </div>

                {/* Jobs Section */}
                <div>
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-primary">
                    <CheckCircle className="w-5 h-5" />
                    الوظائف المقترحة
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      try {
                        const analysis = selectedCv.analysis || {};
                        const jobsSource = analysis.suggestedJobs || analysis.suggested_jobs || 
                                           analysis.jobs || analysis.jobSuggestions || analysis.matchedJobs || 
                                           analysis.jobMatches || selectedCv.suggestedJobs || selectedCv.jobs;
                        
                        let jobs = [];
                        if (jobsSource) {
                          jobs = typeof jobsSource === 'string' ? JSON.parse(jobsSource) : jobsSource;
                        }

                        // Fallback matching if empty
                        if (!Array.isArray(jobs) || jobs.length === 0) {
                          const allJobs = (window as any).allJobs || [];
                          let skills = [];
                          if (analysis.skills) {
                            skills = typeof analysis.skills === 'string' ? JSON.parse(analysis.skills) : analysis.skills;
                          }
                          if (Array.isArray(skills) && skills.length > 0) {
                            jobs = allJobs.filter((job: any) => 
                              skills.some(skill => 
                                job.title?.toLowerCase().includes(skill.toLowerCase())
                              )
                            ).slice(0, 10);
                          }
                        }
                        
                        return Array.isArray(jobs) && jobs.length > 0 ? (
                          jobs.map((job: any, i: number) => (
                            <a 
                              key={i} 
                              href={job.url || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="job-card p-4 flex flex-col gap-2 hover:border-primary/40 transition-all group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white group-hover:text-primary transition-colors">{job.title}</span>
                                <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <span className="text-xs text-white/40">{job.source || 'Wuzzuf'}</span>
                            </a>
                          ))
                        ) : <p className="text-white/30 text-sm italic">لا توجد وظائف مقترحة حالياً</p>
                      } catch(e) {
                        return <p className="text-red-400/60 text-sm">خطأ في عرض الوظائف</p>
                      }
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/[0.03] border-t border-white/5 text-center">
                <button 
                  onClick={() => setSelectedCv(null)}
                  className="btn-primary px-12 py-4"
                >
                  إغلاق النافذة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
