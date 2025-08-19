import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { generateReminderText } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface WorkShirkingReminderProps {
  isDark?: boolean;
}

// 格式化时间为HH:MM:SS格式
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// 计算距离下班时间的剩余时间 (默认18:00下班)
const getTimeUntilWorkEnd = (date: Date): string => {
  // 创建今天18:00的日期对象
  const workEnd = new Date(date);
  workEnd.setHours(18, 0, 0, 0);
  
  // 如果当前时间已过18:00，则显示明日下班倒计时
  if (date > workEnd) {
    workEnd.setDate(workEnd.getDate() + 1);
    return "今日已下班，距离明日下班还有 18小时00分00秒";
  }
  
  // 计算剩余毫秒数
  const diffMs = workEnd.getTime() - date.getTime();
  
  // 转换为小时、分钟、秒
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return `距离下班还有 ${hours.toString().padStart(2, '0')}小时${minutes.toString().padStart(2, '0')}分${seconds.toString().padStart(2, '0')}秒`;
};

// 计算下班进度百分比
const getWorkProgressPercentage = (date: Date): number => {
  // 假设工作时间为9:00-18:00
  const workStart = new Date(date);
  workStart.setHours(9, 0, 0, 0);
  
  const workEnd = new Date(date);
  workEnd.setHours(18, 0, 0, 0);
  
  // 如果还没到上班时间
  if (date < workStart) {
    return 0;
  }
  
  // 如果已经下班
  if (date > workEnd) {
    return 100;
  }
  
  // 计算工作日总时长（毫秒）
  const totalWorkMs = workEnd.getTime() - workStart.getTime();
  
  // 计算已经工作的时长（毫秒）
  const workedMs = date.getTime() - workStart.getTime();
  
  // 计算百分比
  return Math.min(100, Math.max(0, Math.floor((workedMs / totalWorkMs) * 100)));
};

export default function WorkShirkingReminder({ isDark = false }: WorkShirkingReminderProps) {
  const [reminderText, setReminderText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeUntilWorkEnd, setTimeUntilWorkEnd] = useState('');
  const [workProgress, setWorkProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 生成提醒文本
  useEffect(() => {
    updateReminderText();
    
    // 设置每秒自动更新时间和进度
    const updateInterval = setInterval(() => {
      setCurrentDate(new Date());
      setTimeUntilWorkEnd(getTimeUntilWorkEnd(new Date()));
      setWorkProgress(getWorkProgressPercentage(new Date()));
    }, 1000);
    
    return () => clearInterval(updateInterval);
  }, []);
  
  // 更新提醒文本
  const updateReminderText = () => {
    setReminderText(generateReminderText(new Date()));
  };
  
  // 刷新提醒文本
  const refreshReminderText = () => {
    setIsRefreshing(true);
    
    // 添加动画效果
    setTimeout(() => {
      updateReminderText();
      setIsRefreshing(false);
      toast.success('提醒内容已更新！', {
        icon: '🔄',
        position: 'top-center'
      });
    }, 600);
  };
  
  // 复制文本到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(reminderText).then(() => {
      setIsCopied(true);
      toast.success('文本已复制到剪贴板！', {
        icon: '📋',
        position: 'top-center'
      });
      
      // 2秒后重置复制状态
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      toast.error('复制失败，请手动复制', {
        icon: '❌',
        position: 'top-center'
      });
      console.error('复制失败:', err);
    });
  };
  
  // 分享到微信
  const shareToWeChat = () => {
    // 实际上这里应该调用微信分享API，但为了演示，我们只显示一个提示
    toast.info('请在微信中点击右上角分享按钮', {
      icon: '💬',
      position: 'top-center'
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full max-w-2xl mx-auto rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl",
        isDark 
          ? "bg-gray-800 shadow-blue-900/20" 
          : "bg-white shadow-xl"
      )}
    >
      {/* 头部区域 */}
      <div className={cn(
        "p-6 relative overflow-hidden",
        isDark 
          ? "bg-gradient-to-r from-blue-700 to-indigo-800 text-white" 
          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
      )}>
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-2xl font-bold flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <i className="fa-solid fa-coffee mr-3"></i>摸鱼办提醒
          </motion.h1>
          <div className="text-right">
            <motion.div 
              className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              当前时间: {formatTime(currentDate)}
            </motion.div>
            <motion.div 
              className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm mt-1"
              whileHover={{ scale: 1.05 }}
            >
              {timeUntilWorkEnd}
            </motion.div>
          </div>
        </div>
        
        {/* 工作进度条 */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>工作进度</span>
            <span>{workProgress}%</span>
          </div>
          <div className={cn(
            "h-2 rounded-full overflow-hidden bg-white/20",
            isDark ? "bg-gray-700/50" : "bg-white/20"
          )}>
            <motion.div 
              className={cn(
                "h-full rounded-full",
                workProgress < 30 ? "bg-red-500" :
                workProgress < 70 ? "bg-yellow-400" : "bg-green-500"
              )}
              initial={{ width: "0%" }}
              animate={{ width: `${workProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className={cn(
        "p-6",
        isDark ? "bg-gray-800" : "bg-white"
      )}>
        <div className="flex justify-between items-center mb-2">
          <h2 className={cn(
            "text-sm font-medium",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            今日摸鱼提醒
          </h2>
          <motion.button
            onClick={refreshReminderText}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isRefreshing}
            className={cn(
              "p-2 rounded-full transition-all",
              isDark ? "text-blue-400 hover:bg-gray-700" : "text-blue-500 hover:bg-gray-100"
            )}
            title="刷新提醒内容"
          >
            <i className={cn(
              "fa-solid fa-arrows-rotate",
              isRefreshing && "animate-spin"
            )}></i>
          </motion.button>
        </div>
        
        <motion.div 
          key={reminderText} // 当文本变化时触发动画
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "rounded-xl p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-6 min-h-[400px] transition-all duration-200",
            isDark 
              ? "bg-gray-900 text-gray-300 hover:bg-gray-900/80" 
              : "bg-gray-50 text-gray-800 hover:bg-gray-100"
          )}
        >
          {reminderText || '加载中...'}
        </motion.div>
        
        {/* 按钮组 */}
        <div className="flex gap-2">
          {/* 复制按钮 */}
          <motion.button
            onClick={copyToClipboard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
              isCopied 
                ? isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                : isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
            )}
          >
            {isCopied ? (
              <>
                <i className="fa-solid fa-check-circle"></i>
                <span>已复制到剪贴板</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-copy"></i>
                <span>复制文本内容</span>
              </>
            )}
          </motion.button>
          
          {/* 分享按钮 */}
          <motion.button
            onClick={shareToWeChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center",
              isDark 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            )}
          >
            <i className="fa-solid fa-share-nodes"></i>
          </motion.button>
        </div>
      </div>
      
      {/* 页脚提示 - 动态显示摸鱼指数 */}
      <div className={cn(
        "px-6 py-3 text-center text-xs border-t",
        isDark 
          ? "bg-gray-900 text-gray-400 border-gray-700" 
          : "bg-gray-50 text-gray-500 border-gray-100"
      )}>
        <p className="flex items-center justify-center">
          <i className="fa-solid fa-fish text-blue-500 mr-2"></i>
          <span>点击刷新按钮获取新的摸鱼提示</span>
        </p>
      </div>
    </motion.div>
  );
}