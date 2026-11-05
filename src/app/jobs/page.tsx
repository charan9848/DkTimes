import LockedModuleView from '@/components/LockedModuleView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function JobsPage() {
  return (
    <main>
      <LockedModuleView
        title="Local Careers & Jobs Portal"
        categoryName="Jobs"
        description="The Employment Board, job application system, and candidate screening modules are configured for the Phase 2 Enterprise Release."
      />
    </main>
  );
}
