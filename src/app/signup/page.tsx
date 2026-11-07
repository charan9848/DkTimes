import LockedModuleView from '@/components/LockedModuleView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SignupPage() {
  return (
    <main>
      <LockedModuleView
        title="Reader Registration & Sign Up"
        categoryName="Account"
        description="New reader registration, subscriber onboarding, and account creation are part of the Phase 2 Enterprise Release."
      />
    </main>
  );
}
