import { useEffect } from 'react';

export const useLeadRetry = () => {
  useEffect(() => {
    const retryPendingLead = async () => {
      const pendingLead = localStorage.getItem('pendingLead');
      
      if (!pendingLead) return;
      
      try {
        const leadData = JSON.parse(pendingLead);
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-lead-v2`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData),
          }
        );

        if (response.ok) {
          // Successfully synced, remove from localStorage
          localStorage.removeItem('pendingLead');
          console.log('Pending lead successfully synced');
        }
      } catch (error) {
        console.error('Failed to retry pending lead:', error);
        // Keep in localStorage for next retry
      }
    };

    // Retry on page load
    retryPendingLead();
  }, []);
};

