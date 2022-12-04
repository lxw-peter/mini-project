import { useState } from 'react';
import dayjs from 'dayjs';
import './app.less';
dayjs.locale('zh-cn');
const weeks = ['日', '一', '二', '三', '四', '五', '六'];
const days = new Array(42).fill(1);
// 获取当前月份包含的天数
const daysInMonth = (date) => dayjs(date).daysInMonth();
function App() {
  const { $y, $M, $D } = dayjs();
  const [year, setYear] = useState($y);
  const [month, setMonth] = useState($M + 1);
  const [day, setDay] = useState($D);
  // 上个月剩余的天数, 本月1日对应的星期 - 0
  const prevMonthRestDays = dayjs(`${year}-${month}-01`).day();
  // 上个月的总天数
  const getPrevMonthTotalDays = () => {
    // 小于1，返回去年12月的天数
    if (month <= 1) {
      return daysInMonth(`${year - 1}-12`);
    }
    return daysInMonth(`${year}-${month - 1}`);
  };

  /** 下个月显示的天数 */
  const getNextMonthRestDays = () => {
    // 本月最后一天对应的星期
    const currentMonthLastDay = dayjs(`${year}-${month}-${daysInMonth(`${year}-${month}`)}`).day();
    // 如果本月最后一天刚好周六，说明不显示下个月
    if (currentMonthLastDay === 6) {
      return 0;
    }
    let nextMonthFirstDay = dayjs(`${year}-${month + 1}-01`).day();
    // 大于12， 返回明年一月一号的星期
    if (month >= 12) {
      nextMonthFirstDay = dayjs(`${year + 1}-01-01`).day();
    }
    // 返回 6 - 下个月一号的星期
    return nextMonthFirstDay === 7 ? 0 : 7 - nextMonthFirstDay;
  };

  /** 获取当前显示的日期 */
  const getCurrentDays = () => {
    let result = [];
    const prevMonthStartDay = getPrevMonthTotalDays() - prevMonthRestDays + 1;

    // 上个月的日期
    for (let index = prevMonthStartDay; index <= getPrevMonthTotalDays(); index++) {
      result.push({ date: `${year}-${month - 1}-${index}`, day: index });
    }

    // 本月日期
    for (let index = 1; index <= daysInMonth(`${year}-${month}`); index++) {
      result.push({ date: `${year}-${month}-${index}`, day: index });
    }

    // 下个月日期
    for (let index = 1; index <= getNextMonthRestDays(); index++) {
      result.push({ date: `${year}-${month + 1}-${index}`, day: index });
    }
    return result;
  };

  const onPrevYear = () => {
    setYear(year - 1);
  };
  const onNextYear = () => {
    setYear(year + 1);
  };
  const onPrevMonth = () => {
    if (month <= 1) {
      setMonth(12);
      onPrevYear();
      return;
    }
    setMonth(month - 1);
  };
  const onNextMonth = () => {
    if (month >= 12) {
      setMonth(1);
      onNextYear();
      return;
    }
    setMonth(month + 1);
  };
  const onToday = () => {
    const { $y, $M, $D } = dayjs();
    setYear($y);
    setMonth($M + 1);
    setDay($D);
  };
  const handleDayClick = (val) => {
    console.log(val);
  };
  return (
    <div className="App">
      <div className="date-tool-container">
        <div className="date-control-container">
          <span className="date-control-btn" onClick={onPrevYear}>
            &lt;&lt;
          </span>
          <span className="date-control-btn" onClick={onPrevMonth}>
            &lt;
          </span>
          <span>
            {year} 年 {month} 月
          </span>
          <span className="date-control-btn" onClick={onNextMonth}>
            &gt;
          </span>
          <span className="date-control-btn" onClick={onNextYear}>
            &gt;&gt;
          </span>
        </div>
        <button className="today-btn" onClick={onToday}>
          今天
        </button>
      </div>
      <div className="calendar-container">
        <div className="weeks-container">
          {weeks.map((i) => (
            <div key={i}>{i}</div>
          ))}
        </div>
        <div className="days-container">
          {getCurrentDays().map((i, index) => {
            return (
              <div className="day-container" key={index} onClick={() => handleDayClick(i)}>
                <span>{i.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
