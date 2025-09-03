'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  LabelList
} from 'recharts';

interface CompletionRateData {
  name: string;
  value: number;
}

interface CompletionRateChartProps {
  data: CompletionRateData[];
  title?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-600 mt-1">
          完了率: <span className="font-bold text-orange-600">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <text
      x={x + width + 5}
      y={y + height / 2}
      fill="#374151"
      textAnchor="start"
      dominantBaseline="middle"
      className="text-sm font-medium"
    >
      {value}%
    </text>
  );
};

export default function CompletionRateChart({ data, title = "完了率ランキング" }: CompletionRateChartProps) {
  return (
    <div className="rounded-2xl shadow-lg bg-white p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      )}
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 30, right: 60, bottom: 10, left: 100 }}
          >
            <defs>
              <linearGradient id="completionGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="2 2" 
              stroke="#f3f4f6"
              strokeOpacity={0.8}
              horizontal={true}
              vertical={true}
            />
            
            <XAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#374151' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              width={90}
            />
            
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(234, 88, 12, 0.05)' }}
            />
            
            <ReferenceLine
              x={80}
              stroke="#ea580c"
              strokeDasharray="5 5"
              strokeOpacity={0.7}
              label={{
                value: "目標: 80%",
                position: "insideTopRight",
                fill: "#ea580c",
                fontSize: 11,
                fontWeight: 600,
                offset: 10
              }}
            />
            
            <Bar
              dataKey="value"
              radius={[0, 12, 12, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="url(#completionGradient)" />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                content={renderCustomLabel}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600"></div>
          <span>完了率</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-orange-500"></div>
          <span>目標ライン (80%)</span>
        </div>
      </div>
    </div>
  );
}