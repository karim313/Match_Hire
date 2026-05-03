import { useState } from 'react';
import { Upload, FileText, Check, Briefcase, TrendingUp, Home, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

interface CVUploadProps {
  onNavigate: (screen: string) => void;
}

export function CVUpload({ onNavigate }: CVUploadProps) {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setUploaded(true);
    }, 2000);
  };

  const extractedSkills = [
    'إدارة المشاريع',
    'القيادة',
    'التخطيط الاستراتيجي',
    'React.js',
    'Node.js',
    'Python',
    'تحليل البيانات',
    'التواصل الفعال',
    'العمل الجماعي',
    'حل المشكلات',
    'التفكير النقدي',
    'إدارة الوقت'
  ];

  const jobMatches = [
    {
      title: 'مدير مشاريع تقنية',
      company: 'شركة التقنية المتقدمة',
      match: 95,
      location: 'الرياض، السعودية',
      salary: '15,000 - 20,000 ريال'
    },
    {
      title: 'مهندس برمجيات أول',
      company: 'مجموعة الابتكار الرقمي',
      match: 92,
      location: 'دبي، الإمارات',
      salary: '18,000 - 25,000 درهم'
    },
    {
      title: 'مستشار تقني',
      company: 'بيت الاستشارات',
      match: 88,
      location: 'عن بُعد',
      salary: '12,000 - 18,000 ريال'
    },
    {
      title: 'قائد فريق تطوير',
      company: 'شركة البرمجيات الحديثة',
      match: 85,
      location: 'جدة، السعودية',
      salary: '14,000 - 19,000 ريال'
    }
  ];

  return (
    <div className="w-full relative z-10">

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-2" style={{ fontSize: '2rem' }}>
            تحليل السيرة الذاتية
          </h2>
          <p className="text-muted-foreground">
            قم برفع سيرتك الذاتية للحصول على تحليل شامل واقتراحات وظيفية مخصصة
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div>
            <div
              className={`border-2 border-dashed ${
                uploaded ? 'border-primary bg-secondary' : 'border-border'
              } rounded-xl p-12 text-center transition-all ${
                !uploaded && 'hover:border-primary hover:bg-accent/50'
              }`}
            >
              {!uploaded ? (
                <>
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="mb-3">اسحب وأفلت السيرة الذاتية</h3>
                  <p className="text-muted-foreground mb-6">
                    أو انقر للاختيار من جهازك
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    الصيغ المدعومة: PDF, DOC, DOCX (الحد الأقصى: 5MB)
                  </p>
                  <button
                    onClick={handleUpload}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    اختر الملف
                  </button>
                </>
              ) : analyzing ? (
                <>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="mb-3">جارٍ التحليل...</h3>
                  <p className="text-muted-foreground">
                    الذكاء الاصطناعي يقوم بتحليل سيرتك الذاتية
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="mb-3 text-primary">تم التحليل بنجاح!</h3>
                  <p className="text-muted-foreground mb-6">
                    CV_Ahmed_2026.pdf
                  </p>
                  <button
                    onClick={() => {
                      setUploaded(false);
                      setAnalyzing(false);
                    }}
                    className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    رفع ملف جديد
                  </button>
                </>
              )}
            </div>

            {uploaded && !analyzing && (
              <div className="mt-6 bg-card/70 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  المهارات المستخرجة
                </h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-secondary text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {uploaded && !analyzing && (
            <div>
              <div className="bg-card/70 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  الوظائف المقترحة
                </h3>
                <div className="space-y-4">
                  {jobMatches.map((job, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border/50 rounded-xl bg-card/40 hover:bg-card/80 hover:border-primary/50 transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="mb-1">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-primary">{job.match}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                      </div>
                      <button className="mt-3 w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                        عرض التفاصيل
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
