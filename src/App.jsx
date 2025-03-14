import { useEffect, useState } from 'react';
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { mainnet, sepolia, lisk, liskSepolia, base, polygon } from 'wagmi/chains';

const WalletConnect = () => {
  const accounts = useAccount();
  const connectors = useConnectors();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [connectClick, setConnectClick] = useState(false);
  const [connector, setConnector] = useState(null);
  const supportedChains = [mainnet, sepolia, lisk, liskSepolia, base, polygon];

  useEffect(() => {
    if (!connectors) return;
    if (accounts.address === undefined) return;
    setConnector(accounts.connector);
    setConnectClick(false);
  }, [accounts.connector]);

  const handleConnectWallet = () => {
    setConnectClick(true);
  };

  const handleConnector = (_connector) => {
    connect({ connector: _connector });
  };

  const handleDisconnect = () => {
    if (connector) {
      disconnect();
      setConnector(null);
      setConnectClick(false);
    }
  };

  const handleSwitchChain = async (id) => {
    await switchChain({ chainId: Number(id) });
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-purple-900 to-black p-4">
      <div className="w-full max-w-md">
        {!connector ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-lg">
            {!connectClick ? (
              <div className="p-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Connect Your Wallet
                </h1>
                <button
                  onClick={handleConnectWallet}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  🚀 Connect Wallet
                </button>
              </div>
            ) : (
              <div>
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Select Wallet</h2>
                  <button
                    onClick={() => setConnectClick(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    ✖
                  </button>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => handleConnector(connector)}
                      className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                      <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-800">
                        {connector.id === 'injected' ? '🦊' : connector.id === 'walletConnect' ? '🔗' : '💼'}
                      </div>
                      <span className="text-sm font-medium text-white">{connector.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Wallet Connected</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gray-700 rounded-lg p-4 flex items-center">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">Address</div>
                  <div className="font-mono text-white flex items-center">
                    {truncateAddress(accounts.address)}
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Network</div>
                <select
                  value={accounts.chain.id}
                  onChange={(e) => handleSwitchChain(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white py-2 px-3 pr-8 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {supportedChains.map((chain) => (
                    <option key={chain.id} value={chain.id} className="bg-gray-800 text-white">
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={handleDisconnect}
                className="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                ⛔ Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <WalletConnect />
    </div>
  );
}

export default App;