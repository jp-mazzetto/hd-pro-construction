import { AuthProvider } from "../contexts/AuthContext";
import RootContent from "./RootContent";

const RootLayout = () => (
  <AuthProvider>
    <RootContent />
  </AuthProvider>
);

export default RootLayout;
