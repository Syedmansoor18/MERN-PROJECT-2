// src/components/StockCard.jsx
import React from 'react';
import './StockCard.css';

const StockCard = ({ stock }) => {
  if (!stock) return null;

  const isPositive = stock.changePercent >= 0;
  const changeClass = isPositive ? 'positive' : 'negative';
  const changeSymbol = isPositive ? '▲' : '▼';

  return (
    <div className="stock-card">
      <div className="stock-header">
        <h2 className="stock-symbol">{stock.symbol}</h2>
        <p className="stock-name">{stock.name}</p>
      </div>
      
      <div className="stock-price-container">
        <h3 className="stock-price">
          ${stock.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <p className={`stock-change ${changeClass}`}>
          {changeSymbol} {Math.abs(stock.changePercent)?.toFixed(2)}%
        </p>
      </div>
      
      <div className="stock-footer">
        <p>Exchange: {stock.exchange}</p>
      </div>
    </div>
  );
};

export default StockCard;
