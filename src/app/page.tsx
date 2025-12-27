'use client';

import LandingPage from '../components/LandingPage';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { appointments, registerNewBooking, settings } = useAppContext();

  return (
    <LandingPage
      appointments={appointments}
      onBookingComplete={registerNewBooking}
      settings={settings}
    />
  );
}
