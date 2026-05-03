import { FileText, Download, Eye, CheckCircle, Clock, Home, Upload, Settings, LogOut, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const documents = [
    {
      name: 'CV_Ahmed_Senior_Developer.pdf',
      uploadDate: '2026-04-25',
      status: 'verified',
      views: 145,
      matches: 23
    },
    {
      name: 'CV_Ahmed_Updated_2026.pdf',
      uploadDate: '2026-04-20',
      status: 'verified',
      views: 98,
      matches: 18
    },
    {
      name: 'CV_Ahmed_Arabic.pdf',
      uploadDate: '2026-04-15',
      status: 'pending',
      views: 45,
      matches: 12
    }
  ];

  return (
    <div className="w-full relative z-10">

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-2" style={{ fontSize: '2rem' }}>
            لوحة التحكم
          </h2>
          <p className="text-muted-foreground">
            مرحباً بك، أحمد. إليك ملخص نشاطك وسيرك الذاتية
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-card/70 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mb-1" style={{ fontSize: '2rem' }}>3</div>
            <div className="text-muted-foreground">سيرة ذاتية محملة</div>
          </div>

          <div className="bg-card/70 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mb-1" style={{ fontSize: '2rem' }}>288</div>
            <div className="text-muted-foreground">إجمالي المشاهدات</div>
          </div>

          <div className="bg-card/70 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mb-1" style={{ fontSize: '2rem' }}>53</div>
            <div className="text-muted-foreground">وظيفة مطابقة</div>
          </div>

          <div className="bg-card/70 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mb-1" style={{ fontSize: '2rem' }}>95%</div>
            <div className="text-muted-foreground">نسبة الاكتمال</div>
          </div>
        </motion.div>

        <div className="bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2" style={{ fontSize: '1.5rem' }}>
                أحمد محمد العلي
              </h3>
              <p className="opacity-90 mb-4">مهندس برمجيات أول | خبرة 8 سنوات</p>
              <div className="flex gap-4">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm">
                  ahmed@example.com
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm">
                  +966 50 123 4567
                </span>
              </div>
            </div>
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              إدارة المستندات
            </h3>
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              رفع سيرة جديدة
            </button>
          </div>

          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="p-4 border border-border/50 rounded-xl bg-card/40 hover:bg-card/80 hover:border-primary/50 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="mb-1">{doc.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>📅 {doc.uploadDate}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {doc.views}
                        </span>
                        <span>🎯 {doc.matches} وظيفة</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {doc.status === 'verified' ? (
                      <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        موثق
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm">
                        <Clock className="w-4 h-4" />
                        قيد المراجعة
                      </span>
                    )}
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
