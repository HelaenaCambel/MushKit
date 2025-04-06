import React from 'react';
import ReactECharts from 'echarts-for-react';

const GaugeTemp = ({ value = 0 }) => {
  const max = 40;

  const getColorByValue = (val) => {
    if (val <= 8) return '#FFFF00';       
    if (val <= 16) return '#FFCC00';      
    if (val <= 24) return '#FF9900';      
    if (val <= 32) return '#FF6600';    
    return '#FF0000';                    
  };

  const option = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: max,
        itemStyle: { color: getColorByValue(value) }, 
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
          formatter: `{value}°C`,
          color: 'inherit'
        },
        data: [{ value }]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '200px', width: '100%' }} />;
};

export default GaugeTemp;
