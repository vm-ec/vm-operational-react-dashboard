import { Header } from '@/react-app/components/Header';
import { MetadataBar } from '@/react-app/components/MetadataBar';
import { StatusLegend } from '@/react-app/components/StatusLegend';
import { ServiceGrid } from '@/react-app/components/ServiceGrid';
import { AISnapshot } from '@/react-app/components/AISnapshot';
import { useServiceState } from '@/react-app/context/ServiceStateContext';

export default function Dashboard() {
  const { serviceStates } = useServiceState();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F9FF' }}>
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <MetadataBar />
        
        <StatusLegend />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          <ServiceGrid />
          <AISnapshot allServiceStates={serviceStates} />
        </div>
        
      </main>
      
<footer className="bg-gradient-to-r from-[#0A2538] via-[#3B2F80] to-[#6B46C1] py-8 sm:py-12">      
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 text-center">
         <p className="text-base sm:text-lg text-white font-semibold">
  ValueMomentum Operational Health Dashboard
</p>
<p className="text-xs sm:text-sm text-gray-200 mt-2">
  Real-time service monitoring and health tracking
</p>
        </div>
      </footer>
    </div>
  );
}
