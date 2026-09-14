'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteAssessmentButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this assessment? This will also delete all its attempts and results.')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/assessment/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete assessment');
      }
      
      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error deleting assessment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-slate-400 hover:text-red-500 transition-colors p-1"
      title="Delete Assessment"
    >
      {isDeleting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Trash2 className="w-5 h-5" />
      )}
    </button>
  );
}
