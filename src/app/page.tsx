'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Tender {
  id: number;
  title: string;
  buyer: string;
  notice_id: string;
  source: string;
}

export default function HomePage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('id', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching tenders:', error.message);
      } else {
        setTenders(data || []);
      }
      setLoading(false);
    };

    fetchTenders();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading tenders...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">
        🧹 Cleaning / FM Tenders
      </h1>

      {tenders.length === 0 ? (
        <p className="text-gray-500">No tenders found.</p>
      ) : (
        <div className="space-y-4">
          {tenders.map((t) => (
            <div
              key={t.id}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-orange-600 hover:underline">
                <Link href={`/tender/${t.id}`}>{t.title}</Link>
              </h2>
              <p className="text-sm text-gray-700">
                Buyer: <span className="font-medium">{t.buyer}</span>
              </p>
              <p className="text-xs text-gray-500">
                Notice ID: {t.notice_id} | Source: {t.source}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
