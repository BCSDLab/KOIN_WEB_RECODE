import { abTestAssign } from 'api/test';
import React, { useState } from 'react';
import useTokenState from 'utils/hooks/state/useTokenState';

export default function TestPage() {
  const [title, setTitle] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useTokenState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setResult(null);

    // const { data: abTestValue } = useABTestValue<'A' | 'B'>('title', 'A');

    try {
      const accessHistoryId = localStorage.getItem('access_history_id');

      if (accessHistoryId) {
        const assignResponse = await abTestAssign(title, token, Number(accessHistoryId));
        localStorage.setItem('access_history_id', assignResponse.access_history_id.toString());
        setResult(assignResponse);
      } else {
        const assignResponse = await abTestAssign(title, token);
        localStorage.setItem('access_history_id', assignResponse.access_history_id.toString());
        setResult(assignResponse);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>AB Test Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={handleInputChange} />
        </label>
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
