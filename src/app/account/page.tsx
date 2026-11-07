import LockedModuleView from '@/components/LockedModuleView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AccountPage() {
  return (
    <main>
      <LockedModuleView
        title="Reader Account & Profiles"
        categoryName="Account"
        description="Reader authentication, subscriber profiles, personalized feed preferences, and saved cloud bookmarks are part of the Phase 2 Enterprise Release."
      />
    </main>
  );
}
