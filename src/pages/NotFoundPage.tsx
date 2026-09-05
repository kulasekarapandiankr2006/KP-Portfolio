import React from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { Button } from '../components/common/Button';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigateToPage } = useNavigation();

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-rose-400 flex items-center justify-center mx-auto shadow-2xl">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-extrabold font-mono text-white">404</div>
          <h1 className="text-xl font-bold text-slate-200">Specification Route Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            The requested URI does not exist or has been relocated within the engineering database.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigateToPage('/')}
        >
          Return to Portfolio Landing
        </Button>
      </div>
    </div>
  );
};
