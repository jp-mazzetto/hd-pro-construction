import { AuthProvider } from "../contexts/AuthProvider";
import RootContent from "./RootContent";

const RootLayout = () => (
  <AuthProvider>
    <RootContent />
  </AuthProvider>
);

export default RootLayout;
