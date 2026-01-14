
import React from 'react';
import { useRouter } from '../../lib/router';
import VentingWall from '../../components/VentingWall';

export default function VentingPage() {
  const router = useRouter();

  return (
    <VentingWall
      onBack={() => router.push('/')}
      onGoToSurvey={() => router.push('/survey')}
    />
  );
}
