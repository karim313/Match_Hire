'use client'

import { useRouter } from 'next/navigation';
import { FileText, Download, Eye, CheckCircle, Clock, Home, Upload, Settings, LogOut, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

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
        const [cvsData, jobsData] = await Promise.all([
          cvService.getMyCvs(),
          jobService.getAllJobs()
        ]);
        
        setDocuments(cvsData || []);
        setStats({
          cvCount: cvsData?.length || 0,
          views: 0,
          matches: jobsData?.length || 0
        });
      } catch (err) {
        console.error('Detailed Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session, router]);

  return (
    <div className="w-full relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 mt-10">
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
              className="btn-primary text-sm py-2 px-5"
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
                  <div key={doc.id || index} className="job-card flex items-center justify-between">
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
                      <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                        <CheckCircle className="w-3 h-3" />
                        مكتمل
                      </span>
                      <a
                        href={`/api/proxy/Cv/download/${doc.storedFileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg transition-all hover:bg-primary/10"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        <Download className="w-4 h-4" />
                      </a>
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
      </div>
    </div>
  );
}
