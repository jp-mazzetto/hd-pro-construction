import useAuth from "../hooks/useAuth";
import AppSeo from "../components/AppSeo";
import AdminLayout from "../components/admin/AdminLayout";
import VisitCalendarPage from "../components/admin/pages/VisitCalendarPage";
import type { AdminSection } from "../types/admin";

interface AdminPageProps {
  section: AdminSection;
}

const AdminPage = ({ section }: AdminPageProps) => {
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

  const content = section === "visit-calendar" ? <VisitCalendarPage /> : null;

  return (
    <>
      <AppSeo />
      <AdminLayout session={session} onLogout={logout}>
        {content}
      </AdminLayout>
    </>
  );
};

export default AdminPage;
