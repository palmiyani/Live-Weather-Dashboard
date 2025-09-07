import { useState, useEffect } from 'react';

export const useHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('weatherHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const addToHistory = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      searchTime: new Date().toISOString(),
    };

    const updatedHistory = [newEntry, ...history.slice(0, 49)];
    setHistory(updatedHistory);
    localStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weatherHistory');
  };

  return { history, addToHistory, clearHistory };
};
