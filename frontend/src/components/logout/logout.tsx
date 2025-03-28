export default function Logout() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50  backdrop-blur-sm">
            <div className="bg-white p-5 rounded-lg text-center shadow-lg">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
            <p className="mt-3">Déconnexion en cours...</p>
            </div>
        </div>
    );
}