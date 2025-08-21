import { useMockedAuth } from "../contexts/MockedAuthContext";

export const HomePage = () => {
  const { user, logout } = useMockedAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="w-[401px] h-[600px] bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold text-[#08194D] mb-4">Sofya Extension</h1>
      
      <div className="text-center mb-8">
        <p className="text-lg text-[#303A5A] mb-2">You are logged in!</p>
        <p className="text-sm text-[#6B86D6]">{user?.email}</p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-[#6B86D6] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#365FD7] transition-colors"
      >
        Logout
      </button>
    </div>
  );
};