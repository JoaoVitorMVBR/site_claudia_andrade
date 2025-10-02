import Sidebar from '@/components/administration/Sidebar';

console.log('Rendering AdminLayout');

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-0 md:ml-64 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}