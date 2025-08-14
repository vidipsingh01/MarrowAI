import ConnectClientPage from './connect-client';
import { getDoctorData } from '@/lib/doctors'; // Corrected import path and importing our new function


export default function ConnectPage() {
  // 1. Get data by calling the function directly. No fetch, no network call!
  const doctors = getDoctorData();

  // 2. The data is passed to our interactive Client Component as a prop.
  return <ConnectClientPage doctors={doctors} />;
}