"use client";

import { useState } from 'react';

const ReportForm = () => {
  const [submittedBy, setSubmittedBy] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userAgent = window.navigator.userAgent;
      let deviceName = 'Unknown';
      let androidVersion = 'Unknown';

      if (/android/i.test(userAgent)) {
        const androidMatch = userAgent.match(/Android\s([0-9.]+)/);
        if (androidMatch) {
          androidVersion = androidMatch[1];
        }
        const deviceMatch = userAgent.match(/\(([^;]+);/);
        if (deviceMatch) {
          deviceName = deviceMatch[1];
        }
      } else {
        const platform = window.navigator.platform;
        const deviceMatch = userAgent.match(/\(([^)]+)\)/);
        if (deviceMatch) {
          deviceName = deviceMatch[1];
        } else {
          deviceName = platform;
        }
      }

      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceName,
          androidVersion,
          formData: { submittedBy, registerNumber, groupMembers },
        }),
      });

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submittedBy, registerNumber, groupMembers }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'carmel_report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="submittedBy" className="block text-sm font-medium text-gray-700">
          Submitted By
        </label>
        <input
          type="text"
          id="submittedBy"
          value={submittedBy}
          onChange={(e) => setSubmittedBy(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="registerNumber" className="block text-sm font-medium text-gray-700">
          Register Number
        </label>
        <input
          type="text"
          id="registerNumber"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="groupMembers" className="block text-sm font-medium text-gray-700">
          Group Members
        </label>
        <textarea
          id="groupMembers"
          value={groupMembers}
          onChange={(e) => setGroupMembers(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate & Download PDF'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default ReportForm;