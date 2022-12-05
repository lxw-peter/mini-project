import { useState } from 'react';
import dayjs from 'dayjs';
import './app.less';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
dayjs.locale('zh-cn');
const weeks = ['日', '一', '二', '三', '四', '五', '六'];
// 获取当前月份包含的天数
const daysInMonth = (date) => dayjs(date).daysInMonth();

function useDateInfo() {
  const { $y, $M } = dayjs();
  const [year, setYear] = useState($y);
  const [month, setMonth] = useState($M + 1);

  // 上个月剩余的天数, 本月1日对应的星期 - 0
  const prevMonthRestDays = dayjs(`${year}-${month}-01`).day();
  // 上个月的总天数
  const prevMonthTotalDays = useMemo(() => {
    // 小于1，返回去年12月的天数
    if (month <= 1) {
      return daysInMonth(`${year - 1}-12`);
    }
    return daysInMonth(`${year}-${month - 1}`);
  }, [year, month]);

  /** 下个月显示的天数 */
  const nextMonthRestDays = useMemo(() => {
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
  }, [year, month]);

  /** 获取当前显示的日期 */
  const currentDays = useMemo(() => {
    let result = [];
    const prevMonthStartDay = prevMonthTotalDays - prevMonthRestDays + 1;

    const prevMonthInfo = {
      year,
      month: month - 1,
    };

    if (month <= 1) {
      prevMonthInfo.year = year - 1;
      prevMonthInfo.month = 1;
    }

    // 上个月的日期
    for (let index = prevMonthStartDay; index <= prevMonthTotalDays; index++) {
      prevMonthInfo.day = index;
      result.push(dayjs(Object.values(prevMonthInfo).join('-')));
    }

    // 本月日期
    for (let index = 1; index <= daysInMonth(`${year}-${month}`); index++) {
      result.push(dayjs([year, month, index].join('-')));
    }

    const nextMonthInfo = {
      year,
      month: month - 1,
    };

    if (month >= 12) {
      nextMonthInfo.year = year + 1;
      nextMonthInfo.month = 1;
    }

    // 下个月日期
    for (let index = 1; index <= nextMonthRestDays; index++) {
      nextMonthInfo.day = index;
      result.push(dayjs(Object.values(nextMonthInfo).join('-')));
    }

    return result;
  }, [year, month]);

  const onPrevYear = useCallback(() => setYear(year - 1), [year]);

  const onNextYear = useCallback(() => setYear(year + 1), [year]);

  const onPrevMonth = useCallback(() => {
    if (month <= 1) {
      setMonth(12);
      onPrevYear();
      return;
    }
    setMonth(month - 1);
  }, [month]);

  const onNextMonth = useCallback(() => {
    if (month >= 12) {
      setMonth(1);
      onNextYear();
      return;
    }
    setMonth(month + 1);
  }, [month]);

  const onToday = () => {
    const { $y, $M } = dayjs();
    setYear($y);
    setMonth($M + 1);
  };

  return { year, month, onPrevYear, onNextYear, onPrevMonth, onNextMonth, onToday, currentDays };
}

const list = [
  {
    date: '2022-11-8',
    data: [
      {
        type: 'warning',
        content: 'This is warning event.',
      },
      {
        type: 'success',
        content: 'This is usual event.',
      },
      {
        type: 'error',
        content: 'This is error event.',
      },
    ],
  },
  {
    date: '2022-11-28',
    data: [
      {
        type: 'warning',
        content: 'This is warning event.',
      },
      {
        type: 'success',
        content: 'This is usual event.',
      },
      {
        type: 'error',
        content: 'This is error event.',
      },
    ],
  },
  {
    date: '2022-12-5',
    data: [
      {
        type: 'warning',
        content: 'This is warning event.',
      },
      {
        type: 'success',
        content: 'This is usual event.',
      },
      {
        type: 'error',
        content: 'This is error event.',
      },
    ],
  },
  {
    date: '2022-12-25',
    data: [
      {
        type: 'success',
        content: 'This is usual event.',
      },
      {
        type: 'error',
        content: 'This is error event.',
      },
    ],
  },
  {
    date: '2023-1-4',
    data: [
      {
        type: 'error',
        content: 'This is error event.',
      },
    ],
  },
];

function App() {
  const { year, month, onPrevYear, onNextYear, onPrevMonth, onNextMonth, onToday, currentDays } =
    useDateInfo();

  const [listData, setListData] = useState(list);

  const handleDayClick = (val) => {
    console.log(val);
  };
  useEffect(() => {
    let timerId = setTimeout(() => {
      setListData([]);
    }, 10000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const dateCellRender = (value) => {
    let currentData = listData.find((item) => dayjs(item.date).isSame(value));
    return (
      <ul className="events">
        {currentData && currentData.data.map((item) => <li key={item.content}>{item.content}</li>)}
      </ul>
    );
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
          {currentDays.map((i, index) => {
            return (
              <div className="day-container" key={index} onClick={() => handleDayClick(i)}>
                <span>{i.date()}</span>
                {dateCellRender(i)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
