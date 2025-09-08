import { Coins, ImageIcon, LogOut, Send, Vault, Wallet } from "lucide-react";

export default function Navbar({
  isConnected,
  connectWallet,
  walletAddress,
  watrBalance,
  activeSection,
  setActiveSection,
}) {
  console.log("watrBalance", watrBalance);
  const navigationItems = [
    { id: "send", label: "Send WATR", icon: Send },
    { id: "tokens", label: "ERC20 Tokens", icon: Coins },
    { id: "nfts", label: "NFTs", icon: ImageIcon },
    { id: "vault", label: "WatrVault", icon: Vault },
  ];
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">WATR Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-medium">
                    Connected Wallet
                  </p>
                  <p className="text-sm font-mono text-gray-800">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                  </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
                  <span className="text-sm font-semibold text-gray-700">
                    {watrBalance} WATR
                  </span>
                </div>
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </button>
              </div>
            ) : null}

            {!isConnected && (
              <button
                onClick={connectWallet}
                className="px-6 py-3 rounded-2xl font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:shadow-xl"
              >
                <Wallet className="w-5 h-5 mr-2 inline" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
