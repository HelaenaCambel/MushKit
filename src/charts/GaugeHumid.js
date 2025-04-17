import React from 'react';
import ReactECharts from 'echarts-for-react';

const GaugeHumid = ({ value = 70 }) => {
  const getColorByHumidity = (val) => {
    if (val <= 8) return 'rgb(240, 0, 0)';             // Red
    if (val <= 12) return 'rgb(240, 0, 0)';            // Red
    if (val <= 18) return 'rgb(200, 66, 13)';          // Dark orange
    if (val <= 22) return 'rgb(200, 66, 13)';          // Dark orange
    if (val <= 28) return 'rgb(194, 134, 62)';         // Dark yellow-brown
    if (val <= 32) return 'rgb(194, 134, 62)';         // Dark yellow-brown
    if (val <= 38) return 'rgb(105, 173, 56)';         // Olive green
    if (val <= 42) return 'rgb(105, 173, 56)';         // Olive green
    if (val <= 48) return 'rgb(117, 203, 190)';        // Light teal
    if (val <= 52) return 'rgb(117, 203, 190)';        // Light teal
    if (val <= 58) return 'rgb(56, 174, 173)';         // Cyan-teal
    if (val <= 62) return 'rgb(56, 174, 173)';         // Cyan-teal
    if (val <= 68) return 'rgb(56, 157, 173)';         // Blue-teal
    if (val <= 72) return 'rgb(56, 157, 173)';         // Blue-teal
    if (val <= 78) return 'rgb(15, 147, 167)';         // Teal-blue
    if (val <= 82) return 'rgb(15, 147, 167)';         // Teal-blue
    if (val <= 88) return 'rgb(56, 132, 173)';         // Blue
    if (val <= 92) return 'rgb(56, 132, 173)';         // Blue
    return 'rgb(56, 70, 114)';                         // Dark blue
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
