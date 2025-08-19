import WorkShirkingReminder from '@/components/WorkShirkingReminder';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  const { theme, toggleTheme, isDark } = useTheme();
  
  useEffect(() => {
    // 页面加载时的欢迎提示
    toast.success('欢迎使用摸鱼办提醒工具，每日更新，轻松摸鱼！', {
      duration: 3000,
      position: 'top-center',
      icon: '🐟'
    });
  }, []);
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100' 
        : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800'
    } py-8 px-4`}>
      <div className="max-w-5xl mx-auto">
        {/* 顶部导航栏 */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDark ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'
            } transition-all duration-300 hover:scale-110`}
            aria-label="切换主题"
          >
            <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
        
        {/* 页面标题 */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-[clamp(1.8rem,5vw,2.5rem)] font-bold mb-2 flex items-center justify-center">
            <i className="fa-solid fa-fish text-blue-500 mr-3 animate-pulse"></i>
            摸鱼办提醒工具
          </h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            每日自动更新，轻松复制，让你的摸鱼生活更有规划
          </p>
        </div>
        
        {/* 主内容区 */}
        <WorkShirkingReminder isDark={isDark} />
        
        {/* 页脚信息 */}
        <footer className={`mt-12 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
          <p>摸鱼办 © {new Date().getFullYear()} | 工作再忙，也要记得休息</p>
          <div className="mt-2 flex justify-center space-x-4">
            <span className="inline-flex items-center"><i className="fa-solid fa-coffee mr-1 text-amber-600"></i> 摸鱼愉快</span>
            <span className="inline-flex items-center"><i className="fa-solid fa-heart mr-1 text-red-500"></i> 健康第一</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
