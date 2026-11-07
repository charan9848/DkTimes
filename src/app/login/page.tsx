import LockedModuleView from '@/components/LockedModuleView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginPage() {
  return (
    <main>
      <LockedModuleView
        title="Reader Login & Sign In"
        categoryName="Account"
        description="Reader sign-in, subscriber access, and member authentication are part of the Phase 2 Enterprise Release."
      />
    </main>
  );
}
