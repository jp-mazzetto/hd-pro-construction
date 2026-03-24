import useAuth from "../hooks/useAuth";
import AppSeo from "../components/AppSeo";
import AdminLayout from "../components/admin/AdminLayout";
import VisitCalendarPage from "../components/admin/pages/VisitCalendarPage";
import type { AdminSection } from "../types/admin";

interface AdminPageProps {
  section: AdminSection;
}

const AdminPage = ({ section: _section }: AdminPageProps) => {
  const { session, isAuthLoading, logout } = useAuth();

  if (isAuthLoading) {
    return (
      <>
        <AppSeo />
        <div className="min-h-screen bg-slate-950" />
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <AppSeo />
      <AdminLayout session={session} onLogout={logout}>
        <VisitCalendarPage />
      </AdminLayout>
    </>
  );
};

export default AdminPage;
