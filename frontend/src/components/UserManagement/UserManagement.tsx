import { useState, useEffect } from "react";
import { Search, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EditUserDialog } from "../userDialogue/Userdialogue";
import { User } from "../../data/user";
import { UserManagementSqueleton } from "./UserManagementSqueleton";
import { Switch } from "../ui/switch";
import { Blocked } from "../../data/blocked";

interface User {
  id: number;
  pseudo: string;
  email: string;
  isVerified: boolean;
  isBlocked?: boolean; // Optional property to avoid runtime errors
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const usersPerPage = 7;

  const fetchUsers = async () => {
    let token = sessionStorage.getItem("Token");
    let fetchedUsers = token ? await User.getAllUsers(token) : [];
    setUsers(fetchedUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  const handleToggleBlock = async (user: User) => {
    const token = sessionStorage.getItem("Token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      if (user.isBlocked) {
        await Blocked.UnblockUser(token, user.id.toString());
      } else {
        await Blocked.BlockUser(token, user.id.toString());
      }

      // Mettre à jour l'état local après le changement
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, isBlocked: !user.isBlocked } : u
        )
      );
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  const handleSaveEdit = (updatedUser: User) => {
    // Update the user in our state
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    fetchUsers(); // Refresh users after closing the dialog
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un utilisateur..."
            className="pl-8 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <UserManagementSqueleton />
      ) : (
        <div className="rounded-lg border shadow-sm">
          <div className="relative w-full overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                    ID
                  </th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                    Pseudo
                  </th>
                  <th className="text-foreground h-10 px-2 text-center align-middle font-medium whitespace-nowrap">
                    Bloqué
                  </th>
                  <th className="text-foreground h-10 px-2 text-right align-middle font-medium whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                    >
                      <td className="p-2 align-middle whitespace-nowrap">{user.id}</td>
                      <td className="p-2 align-middle whitespace-nowrap">{user.pseudo}</td>
                      <td className="p-2 align-middle whitespace-nowrap text-center">
                        <Switch
                          variant="secondary"
                          checked={user.isBlocked || false}
                          onChange={() => handleToggleBlock(user)}
                        />
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          className="hover:cursor-pointer"
                          size="default"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-t">
              <div className="text-sm text-muted-foreground">
                {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur{" "}
                {filteredUsers.length} utilisateurs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Page précédente</span>
                </Button>
                <div className="text-xs">
                  {currentPage}/{totalPages}
                </div>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Page suivante</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit User Dialog as a separate component */}
      <EditUserDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseDialog}
        user={currentUser}
        onSave={handleSaveEdit}
      />
    </div>
  );
}