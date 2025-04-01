import { BackofficeLayout } from "../components/backoffice/backoffice";
import UserManagement from "../components/UserManagement/UserManagement";
import ContentModeration from "../components/ContentModeration/ContentModeration";

export default function BackofficePage() {
  return (
    <BackofficeLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h2>
          <UserManagement />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Modération des contenus</h2>
          <ContentModeration />
        </div>
      </div>
    </BackofficeLayout>
  );
}