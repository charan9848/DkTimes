import LockedModuleView from '@/components/LockedModuleView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MarketplacePage() {
  return (
    <main>
      <LockedModuleView
        title="Marketplace & Classifieds"
        categoryName="Marketplace"
        description="The Real Estate, Vehicles, and Classifieds Marketplace with direct WhatsApp seller chat is configured for the Phase 2 Enterprise Release."
      />
    </main>
  );
}
