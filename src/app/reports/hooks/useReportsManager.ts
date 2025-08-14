import { useState, useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MedicalReport } from '@/lib/firestore-client';
import { auth, db } from '@/lib/firebase'; // Use client-side firebase
import { collection, query, where, orderBy, getDocs, Timestamp, doc, deleteDoc } from 'firebase/firestore';

export const useReportsManager = () => {
  const [user, loading, error] = useAuthState(auth);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      if (!user) {
        setReports([]);
        return;
      }
      setIsLoading(true);
      try {
        const q = query(
          collection(db, 'medicalReports'),
          where('userId', '==', user.uid),
          orderBy('uploadDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedReports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as MedicalReport[];
        setReports(fetchedReports);
      } catch (err) {
        console.error('Error loading reports:', err);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, [user]);

  const deleteReport = async (reportId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const reportRef = doc(db, 'medicalReports', reportId);
      await deleteDoc(reportRef);
      setReports(reports.filter(report => report.id !== reportId));
    } catch (err) {
      console.error('Error deleting report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report =>
      report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.notes && report.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.extractedText && report.extractedText.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [reports, searchTerm]);

  const formatDate = (date: unknown) => {
    return date instanceof Timestamp
      ? date.toDate().toLocaleDateString()
      : new Date(date as string | number | Date).toLocaleDateString();
  };

  return {
    reports: filteredReports,
    searchTerm,
    setSearchTerm,
    isLoading,
    formatDate,
    loading,
    error,
    deleteReport,
  };
};
