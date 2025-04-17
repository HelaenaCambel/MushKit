import React from 'react';
import ReactECharts from 'echarts-for-react';

const GaugeTemp = ({ value = 0 }) => {
  const max = 40;

  const getColorByValue = (val) => {
    if (val <= 3) return 'rgb(0, 255, 255)';         // Cool cyan (cold)
    if (val <= 6) return 'rgb(30, 240, 230)';        // Light cyan
    if (val <= 9) return 'rgb(60, 220, 200)';        // Light turquoise
    if (val <= 12) return 'rgb(90, 200, 170)';       // Turquoise
    if (val <= 15) return 'rgb(120, 180, 140)';      // Light green
    if (val <= 18) return 'rgb(150, 160, 110)';      // Green-yellow
    if (val <= 21) return 'rgb(180, 140, 80)';       // Yellow-orange
    if (val <= 24) return 'rgb(210, 120, 50)';       // Orange
    if (val <= 27) return 'rgb(240, 100, 20)';       // Orange-red
    if (val <= 30) return 'rgb(255, 80, 0)';         // Red-orange
    if (val <= 33) return 'rgb(255, 60, 0)';         // Red
    if (val <= 36) return 'rgb(255, 40, 0)';         // Dark red
    if (val <= 39) return 'rgb(255, 20, 0)';         // Darker red
    if (val <= 42) return 'rgb(255, 0, 0)';          // Bright red (hot)
    return 'rgb(255, 0, 0)';                  
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
