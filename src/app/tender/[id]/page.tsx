'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@lib/supabaseClient';
import Link from 'next/link';

interface Tender {
  id: number;
  title: string;
  buyer: string;
  notice_id: string;
  source: string;
  sector?: string | null;
  description?: string | null;
  value?: string | null;
  created_at?: string;
}

export default function TenderDetail() {
  const { id } = useParams();
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTender = async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error(error);
      else setTender(data);

      setLoading(false);
    };
    fetchTender();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading tender...</p>;
  if (!tender) return <p className="p-6 text-gray-500">Tender not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/" className="text-orange-600 hover:underline mb-4 inline-block">← Back to tenders</Link>

      <h1 className="text-2xl font-bold mb-2 text-gray-800">{tender.title}</h1>
      <p className="text-gray-600 mb-1">Buyer: {tender.buyer}</p>
      <p className="text-gray-600 mb-1">Notice ID: {tender.notice_id}</p>
      <p className="text-gray-500 text-sm mb-4">Source: {tender.source}</p>

      {tender.description && (
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-1">Description</h2>
          <p className="text-gray-700">{tender.description}</p>
        </div>
      )}

      {tender.value && (
        <p className="text-gray-700 font-medium mb-2">
          💰 Estimated Value: {tender.value}
        </p>
      )}

      {tender.created_at && (
        <p className="text-gray-500 text-sm">
          Published on: {new Date(tender.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
