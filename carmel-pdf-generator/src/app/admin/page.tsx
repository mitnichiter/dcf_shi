import { promises as fs } from 'fs';
import path from 'path';

async function getAnalyticsData() {
  const filePath = path.join(process.cwd(), 'analytics.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const analyticsData = await getAnalyticsData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Data</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <pre className="p-4 text-sm text-gray-800 overflow-x-auto">
          {JSON.stringify(analyticsData, null, 2)}
        </pre>
      </div>
    </div>
  );
}