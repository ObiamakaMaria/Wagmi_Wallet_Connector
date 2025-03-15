import { useState } from 'react';
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain, useConfig } from 'wagmi';

const WalletConnectComponent = () => {
  const { chains: supportedChains } = useConfig();
  const { address, chain, connector: activeConnector } = useAccount();
  const connectors = useConnectors();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const initiateWalletConnection = () => {
    setShowWalletOptions(true);
  };

  const initiateConnection = (selectedConnector) => {
    connect({ connector: selectedConnector });
  };

  const terminateConnection = () => {
    if (activeConnector) {
      disconnect();
      setShowWalletOptions(false);
    }
  };

  const switchToChain = async (id) => {
    await switchChain({ chainId: Number(id) });
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddressToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getChainById = (id) => {
    return supportedChains.find(chain => chain.id === Number(id));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-purple-900 to-black p-4">
      <div className="w-full max-w-md">
        {!activeConnector ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-lg">
            {!showWalletOptions ? (
              <div className="p-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Connect Your Wallet
                </h1>
                <button
                  onClick={initiateWalletConnection}
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
                    onClick={() => setShowWalletOptions(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    ✖
                  </button>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => initiateConnection(connector)}
                      className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                      <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-800 overflow-hidden">
                        {connector.icon ? (
                          <img 
                            src={connector.icon}
                            alt={connector.name} 
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <div className="text-xl">
                            {connector.id === 'injected' ? '🦊' : connector.id === 'walletConnect' ? '🔗' : '💼'}
                          </div>
                        )}
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
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 mr-3 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                  {activeConnector.icon ? (
                    <img 
                      src={activeConnector.icon}
                      alt={activeConnector.name} 
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <div className="text-lg">
                      {activeConnector.id === 'injected' ? '🦊' : activeConnector.id === 'walletConnect' ? '🔗' : '💼'}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white">{activeConnector.name} Connected</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gray-700 rounded-lg p-4 flex items-center">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">Address</div>
                  <div className="font-mono text-white flex items-center">
                    {formatAddress(address)}
                    <button 
                      onClick={() => copyAddressToClipboard(address)}
                      className="ml-2 text-blue-400 hover:text-blue-300 text-sm"
                      title="Copy full address"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Network</div>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-2 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                    {chain?.iconUrl ? (
                      <img 
                        src={chain.iconUrl}
                        alt={chain?.name} 
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <div className="text-sm font-bold text-white">
                        {chain?.name?.substring(0, 1) || "?"}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-white">
                    Currently on: {chain?.name}
                  </span>
                </div>
                <select
                  value={chain?.id}
                  onChange={(e) => switchToChain(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white py-2 px-3 pr-8 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {supportedChains.map((chain) => (
                    <option key={chain.id} value={chain.id} className="bg-gray-800 text-white">
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Available Networks</div>
                <div className="grid grid-cols-3 gap-2">
                  {supportedChains.map((chainItem) => (
                    <button
                      key={chainItem.id}
                      onClick={() => switchToChain(chainItem.id)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                        chain?.id === chainItem.id 
                          ? 'bg-blue-500/20 border border-blue-500/40' 
                          : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                      }`}
                    >
                      <div className="w-8 h-8 mb-1 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {chainItem.iconUrl ? (
                          <img 
                            src={chainItem.iconUrl}
                            alt={chainItem.name} 
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <div className="text-sm font-bold text-white">
                            {chainItem.name.substring(0, 1)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-white truncate w-full text-center">
                        {chainItem.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Chain Details</div>
                <div className="text-sm text-white">
                  <div className="flex justify-between py-1 border-b border-gray-600">
                    <span>Chain ID:</span>
                    <span className="font-mono">{chain?.id}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Native Currency:</span>
                    <span className="font-mono">{chain?.nativeCurrency?.symbol}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={terminateConnection}
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
      <WalletConnectComponent />
    </div>
  );
}

export default App;