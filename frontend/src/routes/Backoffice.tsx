import { BackofficeLayout } from "../components/backoffice/backoffice";
import UserManagement from "../components/UserManagement/UserManagement";

export default function BackofficePage() {
  return (
    <BackofficeLayout>
    <UserManagement />
  </BackofficeLayout>
  );
}