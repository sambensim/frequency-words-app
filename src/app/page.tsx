'use client'; // Tells Next that this is a client component not server component
import { useState, useEffect} from 'react';

interface Word {
  id: number;
  word: string;
}

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWords();
  }, []) //Apparently the empty array will make sure this only runs once, why is this?

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getPair');
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      const data = await response.json();
      setWords(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch words.');
      setLoading(false);
    }
  };

  const handleSelection = async (selectedId: number) => { //why isn't int an acceptable type?
    const [word1, word2] = words;
    try {
      await fetch('/api/submitResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          word1_id: word1.id,
          word2_id: word2.id,
          selected_id: selectedId,
        }),
      });
      fetchWords();
    } catch (err) {
      setError('Failed to submit response.');
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div style = {{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Which word indicates higher frequency?</h1>
      {words.map((word) => (
        <button
          key={word.id}
          onClick={() => handleSelection(word.id)}
          style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
        >
          {word.word}
        </button>
      ))}
    </div>
  );
}