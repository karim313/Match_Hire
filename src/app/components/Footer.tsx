export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <video 
                src="/images/hero%20logo.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-8 h-8 object-cover rounded-lg opacity-80"
              />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Match Hire
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              منصة متقدمة لتحليل السيرة الذاتية ومطابقة الوظائف باستخدام الذكاء الاصطناعي لتمكين مستقبلك المهني.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">روابط سريعة</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الميزات</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الأسعار</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">من نحن</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>الدعم الفني</li>
              <li>المبيعات</li>
              <li>support@matchhire.com</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© 2026 Match Hire. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-primary transition-colors">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
