/**
 * 日期工具函数 - 用于计算"摸鱼办"提醒中的各种倒计时
 */

// 格式化日期为"YYYY年MM月DD日"格式
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

// 获取星期几的中文名称
export function getWeekdayName(date: Date): string {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekdays[date.getDay()];
}

// 计算一年中的第几天
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// 计算两个日期之间的天数差（精确到毫秒）
function getDaysDifference(date1: Date, date2: Date): number {
  const oneDayMs = 24 * 60 * 60 * 1000; // 一天的毫秒数
  
  // 创建日期副本，避免修改原日期对象
  const startDate = new Date(date1);
  const endDate = new Date(date2);
  
  // 标准化时间部分，避免时区问题
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  // 计算时间差（毫秒）
  const timeDiff = endDate.getTime() - startDate.getTime();
  
  // 计算天数差并取绝对值
  const dayDiff = Math.abs(timeDiff / oneDayMs);
  
  // 返回四舍五入后的天数差
  return Math.round(dayDiff);
}

// 检查日期是否已过（考虑时间）
function isDatePassed(targetDate: Date, currentDate: Date = new Date()): boolean {
  return targetDate.getTime() < currentDate.getTime();
}

// 计算距离发工资的天数
export function getPaydayCountdowns(currentDate: Date = new Date()): Record<string, number> {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  
  const payDays = [1, 5, 8, 10, 15, 20, 25, 30];
  const countdowns: Record<string, number> = {};
  
  payDays.forEach(day => {
    // 创建当月的发薪日
    let payday = new Date(currentYear, currentMonth, day);
    
    // 处理小月的31日发薪日
    if (payday.getDate() !== day) {
      // 如果日期自动调整了，说明是小月，设置为当月最后一天
      payday = new Date(currentYear, currentMonth + 1, 0);
    }
    
    // 如果发薪日已过，则计算下个月的
    if (payday < currentDate) {
      const nextMonth = currentMonth + 1;
      let nextMonthYear = currentYear;
      
      if (nextMonth > 11) {
        nextMonthYear = currentYear + 1;
      }
      
      // 创建下个月的发薪日
      payday = new Date(nextMonthYear, nextMonth, day);
      
      // 再次检查下个月是否是小月
      if (payday.getDate() !== day) {
        payday = new Date(nextMonthYear, nextMonth + 1, 0);
      }
    }
    
    const daysDiff = getDaysDifference(currentDate, payday);
    countdowns[day < 10 ? `0${day}` : day.toString()] = daysDiff;
  });
  
  return countdowns;
}

// 计算距离周末的天数（中国双休制度：周六和周日）
export function getWeekendCountdowns(currentDate: Date = new Date()): { doubleWeekend: number, singleWeekend: number } {
  const dayOfWeek = currentDate.getDay(); // 0是星期日，6是星期六
  
  // 计算距离下一个周六的天数（双休开始）
  let daysToSaturday: number;
  if (dayOfWeek === 6) {
    // 如果今天是周六，距离下一个周六是7天
    daysToSaturday = 7;
  } else {
    daysToSaturday = 6 - dayOfWeek;
  }
  
  // 计算距离下一个周日的天数
  let daysToSunday: number;
  if (dayOfWeek === 0) {
    // 如果今天是周日，距离下一个周日是7天
    daysToSunday = 7;
  } else {
    daysToSunday = 0 - dayOfWeek + 7;
  }
  
  return {
    doubleWeekend: daysToSaturday, // 距离双休周末(周六)的天数
    singleWeekend: daysToSunday    // 距离单休周末(周日)的天数
  };
}

// 计算距离节假日的天数并按时间远近升序排序
export function getHolidayCountdowns(currentDate: Date = new Date()): Array<{ name: string, days: number }> {
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear + 1;
  
  // 2025年农历节日对应的公历日期（精确版）
  // 数据来源：中国政府网节假日安排通知
  const holidays2025 = {
    '元旦': new Date(currentYear, 0, 1),          // 1月1日（公历固定）
    '春节': new Date(currentYear, 0, 29),         // 1月29日（农历正月初一）
    '元宵': new Date(currentYear, 1, 12),         // 2月12日（农历正月十五）
  '端午': new Date(currentYear, 5, 20),         // 6月20日（农历五月初五）
  '七夕': new Date(currentYear, 7, 30),         // 8月30日（农历七月初七）
     '中秋': new Date(currentYear, 9, 7),          // 10月7日（农历八月十五）
     '国庆': new Date(currentYear, 9, 1),          // 10月1日（公历固定）
     '重阳': new Date(currentYear, 9, 12),         // 10月12日（农历九月初九）
  };
  
  // 2026年重要农历节日公历日期（用于跨年计算）
  const holidays2026 = {
    '元旦': new Date(nextYear, 0, 1),
    '春节': new Date(nextYear, 1, 17),            // 2026年春节是2月17日
  };
  
  const countdowns: Array<{ name: string, days: number }> = [];
  
  // 处理当前年份的节日
  Object.entries(holidays2025).forEach(([name, date]) => {
    // 检查节日是否已过
    if (date < currentDate) {
      // 对于元旦和春节，使用下一年的日期
      if (name === '元旦') {
        countdowns.push({ name, days: getDaysDifference(currentDate, holidays2026[name]) });
      } else if (name === '春节') {
        countdowns.push({ name, days: getDaysDifference(currentDate, holidays2026[name]) });
      } else {
        // 其他节日计算到下一年对应日期的天数
        const nextYearDate = new Date(date);
        nextYearDate.setFullYear(nextYear);
        countdowns.push({ name, days: getDaysDifference(currentDate, nextYearDate) });
      }
    } else {
      // 节日尚未到来，直接计算天数差
      countdowns.push({ name, days: getDaysDifference(currentDate, date) });
    }
  });
  

  
  // 按天数升序排序（最近的节日排在前面）
  countdowns.sort((a, b) => a.days - b.days);
  
  return countdowns;
}

// 计算距离年底和新年的天数
export function getYearEndCountdowns(currentDate: Date = new Date()): { nextYear: number, nextChineseNewYear: number } {
  const currentYear = currentDate.getFullYear();
  
  // 距离下一年的天数
  const nextYear = new Date(currentYear + 1, 0, 1);
  const nextYearDays = getDaysDifference(currentDate, nextYear);
  
  // 春节日期查找表（公历）
  const springFestivalDates: Record<number, [number, number]> = {
    2025: [0, 29], // 2025年1月29日
    2026: [1, 17], // 2026年2月17日
    2027: [1, 6],  // 2027年2月6日
    2028: [0, 26], // 2028年1月26日
    2029: [1, 13], // 2029年2月13日
  };
  
  // 确定应该使用哪一年的春节日期
  let targetYear = currentYear;
  const [month, day] = springFestivalDates[currentYear] || [0, 29]; // 默认使用2025年日期
  const currentYearSpringFestival = new Date(currentYear, month, day);
  
  if (currentDate > currentYearSpringFestival) {
    targetYear = currentYear + 1;
  }
  
  // 获取目标年份的春节日期
  const [targetMonth, targetDay] = springFestivalDates[targetYear] || [0, 29];
  const nextChineseNewYear = new Date(targetYear, targetMonth, targetDay);
  const nextChineseNewYearDays = getDaysDifference(currentDate, nextChineseNewYear);
  
  return {
    nextYear: nextYearDays,
    nextChineseNewYear: nextChineseNewYearDays
  };
}

// 生成完整的提醒文本
export function generateReminderText(currentDate: Date = new Date()): string {
  const dateStr = formatDate(currentDate);
  const weekday = getWeekdayName(currentDate);
  const paydays = getPaydayCountdowns(currentDate);
  const weekends = getWeekendCountdowns(currentDate);
  const holidays = getHolidayCountdowns(currentDate);
  const yearEnds = getYearEndCountdowns(currentDate);
  
  // 生成问候语(根据时间段)
  const hour = currentDate.getHours();
  let greeting = "早上好";
  if (hour >= 12 && hour < 18) {
    greeting = "下午好";
  } else if (hour >= 18) {
    greeting = "晚上好";
  }
  
  // 构建文本内容
   // 每日不同的开场白模板
    const openingTemplates = [
      "今天是${dateStr}，${weekday}。${greeting}，摸鱼人！工作再忙也要记得休息，毕竟身体是革命的本钱。",
      "欢迎来到${dateStr}的摸鱼时间！${greeting}，今天也要合理安排工作与休息哦！",
      "${greeting}，摸鱼人！今天是${dateStr}，${weekday}。记得多喝水，多走动，保持健康工作状态。",
      "【摸鱼办】提醒您：${dateStr}，${weekday}。${greeting}！工作再努力，也别忘了给自己放个小假。",
      "美好的一天从摸鱼开始！今天是${dateStr}，${weekday}。${greeting}，愿您工作顺利，摸鱼愉快！",
      "${greeting}，今天是${dateStr}，${weekday}。摸鱼小贴士：每小时起身活动5分钟，健康工作每一天。",
      "【摸鱼办】温馨提示：${dateStr}，${weekday}。${greeting}！适当摸鱼有助于提高工作效率哦！",
      "今天是${dateStr}，${weekday}。${greeting}，摸鱼人！记得劳逸结合，才能事半功倍。",
      "又是一天摸鱼日！${dateStr}，${weekday}，${greeting}！让我们在忙碌工作中寻找小确幸。",
      "时间过得真快，今天是${dateStr}，${weekday}。${greeting}，摸鱼人！享受此刻的宁静时光吧。",
      "${greeting}！今天是${dateStr}，${weekday}。摸鱼办提醒您：适时休息，保持高效工作状态。",
      "欢迎来到${dateStr}的摸鱼时刻！${greeting}，今天也要元气满满地工作与生活哦！",
      "早安摸鱼人！今天是${dateStr}，${weekday}。新的一天，愿你工作轻松，摸鱼愉快！",
      "${greeting}！${dateStr}，${weekday}。摸鱼办温馨提示：工作再忙，也别忘了抬头看看窗外的风景。",
      "今天是${dateStr}，${weekday}。${greeting}！摸鱼人必备心态：工作是做不完的，但生活还要继续。",
      "【摸鱼办】报道：${dateStr}，${weekday}。${greeting}！今日摸鱼指数：★★★★☆，适合轻度摸鱼。",
      "又是元气满满的一天！今天是${dateStr}，${weekday}。${greeting}，摸鱼人！记得微笑面对工作挑战。",
      "${greeting}，摸鱼人！${dateStr}，${weekday}。今日宜摸鱼，忌过度劳累，保持好心情最重要。",
      "今天是${dateStr}，${weekday}。${greeting}！摸鱼办提醒您：合理分配时间，工作娱乐两不误。",
      "欢迎来到${dateStr}的摸鱼频道！${greeting}，今天也是努力工作和适当摸鱼的一天！",
      "${greeting}，今天是${dateStr}，${weekday}。摸鱼小技巧：把大任务分解成小目标，逐个击破。",
      "今天是${dateStr}，${weekday}。${greeting}，摸鱼人！愿您的工作像咖啡一样香醇，摸鱼像甜点一样美好。",
      "【摸鱼办】温馨提示：${dateStr}，${weekday}。${greeting}！久坐伤腰，记得定时起身活动哦。",
      "新的一天，新的摸鱼计划！今天是${dateStr}，${weekday}。${greeting}，摸鱼人！加油！",
      "${greeting}！今天是${dateStr}，${weekday}。摸鱼办祝您工作顺利，摸鱼愉快，度过美好的一天！",
      "今天是${dateStr}，${weekday}。${greeting}，摸鱼人！工作再忙，也要给自己留一点放空的时间。",
      "【摸鱼办】特别报道：${dateStr}，${weekday}。${greeting}！今日宜摸鱼，宜放松，宜微笑。",
      "${greeting}，摸鱼人！今天是${dateStr}，${weekday}。记得工作再忙也要按时吃饭，保持健康作息。",
      "今天是${dateStr}，${weekday}。${greeting}！摸鱼办提醒您：保持积极心态，工作再累也不怕。",
      "欢迎来到${dateStr}的摸鱼小天地！${greeting}，愿您今天工作轻松，摸鱼愉快！"
    ];
   
   // 根据一年中的第几天选择不同的开场白，确保每天不同但整天保持一致
   const dayOfYear = getDayOfYear(currentDate);
    // 使用更复杂的计算确保每天不同的开场白
    const templateIndex = (dayOfYear * 31) % openingTemplates.length;
    const openingLine = openingTemplates[templateIndex]
     .replace('${dateStr}', dateStr)
     .replace('${weekday}', weekday)
     .replace('${greeting}', greeting);
   
   let text = `【摸鱼办】提醒您：
${openingLine}有事没事起身去茶水间，去厕所，去廊道走走，别总在工位上坐着，钱是老板的，但健康是自己的。
温馨提示：
`;
  
  // 添加发工资倒计时
  Object.entries(paydays).forEach(([day, days]) => {
    text += `离【${day}号发工资】：${days}天
`;
  });
  
  // 添加周末倒计时
  text += `离【双休周末】还有：${weekends.doubleWeekend}天
离【单休周末】还有：${weekends.singleWeekend}天
`;
  
  // 添加节假日倒计时（已按时间远近升序排序）
  holidays.forEach(({ name, days }) => {
    text += `距离【 ${name} 】还有：${days}天
`;
  });
  
  // 添加年底倒计时
  text += `距离【${currentDate.getFullYear() + 1}年】还有：${yearEnds.nextYear}天
距离【下次过年】还有：${yearEnds.nextChineseNewYear}天`;
  
  return text;
}