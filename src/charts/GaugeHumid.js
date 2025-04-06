import React from 'react';
import ReactECharts from 'echarts-for-react';

const GaugeHumid = ({ value = 70 }) => {
  const getColorByHumidity = (val) => {
    if (val <= 10) return '#FF4C4C';       
    if (val <= 20) return '#C45C71';      
    if (val <= 30) return '#7E85A3';      
    if (val <= 39) return '#5D9BCF';       
    if (val <= 60) return '#4DD0E1';      
    if (val <= 70) return '#4FC3F7';    
    if (val <= 80) return '#42A5F5';       
    return '#1E88E5';                     
  };

  const option = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        itemStyle: { color: getColorByHumidity(value) },
        progress: { show: true, width: 20 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 20 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '0%'],
          fontSize: 30,
          fontWeight: 'bolder',
          formatter: `{value}%`,
          color: 'inherit'
        },
        data: [{ value }]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '200px', width: '100%' }} />;
};

export default GaugeHumid;
