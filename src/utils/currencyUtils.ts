
import { useState, useEffect } from 'react';

// API to convert USD to COP
export const fetchUSDtoCOP = async (): Promise<number> => {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    
    if (data && data.rates && data.rates.COP) {
      return data.rates.COP;
    }
    
    return 4000; // Fallback rate if API fails
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 4000; // Fallback exchange rate
  }
};

// Format currency for display
export const formatCurrency = (amount: number, currency: 'USD' | 'COP'): string => {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  } else {
    return `COP ${Math.round(amount).toLocaleString('es-CO')}`;
  }
};

// Hook to get currency conversion
export const useCurrencyConversion = () => {
  const [exchangeRate, setExchangeRate] = useState<number>(4000);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const rate = await fetchUSDtoCOP();
        setExchangeRate(rate);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      } finally {
        setLoading(false);
      }
    };

    getExchangeRate();
  }, []);

  const convertUSDtoCOP = (usdAmount: number): number => {
    return usdAmount * exchangeRate;
  };

  return { exchangeRate, loading, convertUSDtoCOP };
};
