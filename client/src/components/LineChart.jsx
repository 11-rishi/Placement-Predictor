import React, { useEffect, useRef } from 'react';
import './LineChart.css';

const LineChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Make sure data is defined and has at least one item
    if (!data || !Array.isArray(data) || data.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas dimensions accounting for device pixel ratio
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - (padding * 2);
    const chartHeight = rect.height - (padding * 2);

    // Extract scores and dates
    const scores = data.map(item => item.score);
    const dates = data.map(item => new Date(item.date).toLocaleDateString());

    // Find min and max values for scaling
    const maxScore = Math.max(...scores, 100);
    const minScore = Math.min(...scores, 0);
    const range = maxScore - minScore;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;

    // X-axis
    ctx.moveTo(padding, rect.height - padding);
    ctx.lineTo(rect.width - padding, rect.height - padding);

    // Y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, rect.height - padding);
    ctx.stroke();

    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Horizontal grid lines (score)
    const gridStep = 20;
    for (let i = 0; i <= 100; i += gridStep) {
      const y = rect.height - padding - (i / 100 * chartHeight);
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);

      // Add score labels
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.fillText(i.toString(), padding - 10, y + 4);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot data points and line
    if (scores.length > 0) {
      // Draw line
      ctx.beginPath();
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';

      scores.forEach((score, i) => {
        const x = padding + (i / (scores.length - 1 || 1)) * chartWidth;
        const y = rect.height - padding - ((score - minScore) / (range || 1)) * chartHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points
      scores.forEach((score, i) => {
        const x = padding + (i / (scores.length - 1 || 1)) * chartWidth;
        const y = rect.height - padding - ((score - minScore) / (range || 1)) * chartHeight;

        // Draw point
        ctx.beginPath();

        // Color based on score
        let gradient;
        if (score >= 70) {
          gradient = ctx.createLinearGradient(x - 6, y - 6, x + 6, y + 6);
          gradient.addColorStop(0, '#10b981');
          gradient.addColorStop(1, '#059669');
        } else if (score >= 50) {
          gradient = ctx.createLinearGradient(x - 6, y - 6, x + 6, y + 6);
          gradient.addColorStop(0, '#f59e0b');
          gradient.addColorStop(1, '#d97706');
        } else {
          gradient = ctx.createLinearGradient(x - 6, y - 6, x + 6, y + 6);
          gradient.addColorStop(0, '#ef4444');
          gradient.addColorStop(1, '#dc2626');
        }

        ctx.fillStyle = gradient;
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw white inner circle
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Add score label above point
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(score.toString(), x, y - 15);

        // Add date label below x-axis
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText(dates[i], x, rect.height - padding + 20);
      });
    }

  }, [data]);

  return (
    <div className="line-chart-container">
      <canvas ref={canvasRef} className="line-chart"></canvas>
    </div>
  );
};

export default LineChart;
