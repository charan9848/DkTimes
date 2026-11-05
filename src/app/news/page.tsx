import LockedModuleView from '@/components/LockedModuleView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AllNewsPage() {
  return (
    <main>
      <LockedModuleView
        title="500+ Articles Broadsheet Archive"
        categoryName="Archive"
        description="The continuous 500+ story broadsheet archive, pagination, and multi-year historical logs are part of the Phase 2 Enterprise Release."
      />
    </main>
  );
}
