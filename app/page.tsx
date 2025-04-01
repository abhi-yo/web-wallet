'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { IoCopyOutline } from 'react-icons/io5';
import toast, { Toaster } from 'react-hot-toast';

const STORAGE_KEY = 'web-wallet-data';

interface StoredData {
  wallets: { name: string; address: string; privateKey: string }[];
  mnemonic: string;
}

export default function Home() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [wallets, setWallets] = useState<{ name: string, address: string, privateKey: string }[]>([]);
  const [walletName, setWalletName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'generate' | 'wallets'>('generate');
  const [showBatch, setShowBatch] = useState<boolean>(false);
  const [batchSize, setBatchSize] = useState<number>(1);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const { wallets: savedWallets, mnemonic: savedMnemonic } = JSON.parse(storedData) as StoredData;
        setWallets(savedWallets);
        setMnemonic(savedMnemonic);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const dataToStore: StoredData = {
        wallets,
        mnemonic
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [wallets, mnemonic]);

  const generateMnemonic = () => {
    const newMnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setMnemonic(newMnemonic);
    setWallets([]);
  };

  const createWallet = () => {
    if (!mnemonic) {
      toast.error('Please generate a mnemonic first');
      return;
    }

    try {
      if (showBatch) {
        const newWallets = [];
        for (let i = 0; i < batchSize; i++) {
          const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${wallets.length + i}`);
          newWallets.push({
            name: `Wallet ${wallets.length + i + 1}`,
            address: wallet.address,
            privateKey: wallet.privateKey
          });
        }
        setWallets([...wallets, ...newWallets]);
        setBatchSize(1);
        setShowBatch(false);
        toast.success(`Created ${batchSize} new wallets`);
      } else {
        const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${wallets.length}`);
        setWallets([...wallets, {
          name: walletName || `Wallet ${wallets.length + 1}`,
          address: wallet.address,
          privateKey: wallet.privateKey
        }]);
        setWalletName('');
        toast.success('Wallet created successfully');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error('Error creating wallet. Make sure your mnemonic is valid.');
    }
  };

  const deleteWallet = (indexToDelete: number) => {
    setWallets(wallets.filter((_, index) => index !== indexToDelete));
    toast.success('Wallet deleted', { 
      position: 'bottom-right',
      style: {
        background: '#111111',
        color: '#fff',
        border: '1px solid #262626'
      }
    });
  };

  const toggleBatchCreation = () => {
    setShowBatch(!showBatch);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard', { 
      position: 'bottom-right',
      style: {
        background: '#111111',
        color: '#fff',
        border: '1px solid #262626'
      }
    });
  };

  const deleteAllWallets = () => {
    setWallets([]);
    toast.success('All wallets deleted', { 
      position: 'bottom-right',
      style: {
        background: '#111111',
        color: '#fff',
        border: '1px solid #262626'
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#111111',
            color: '#fff',
            border: '1px solid #262626',
            padding: '16px'
          },
          success: {
            iconTheme: {
              primary: '#5b170b',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#5b170b',
              secondary: '#fff'
            }
          }
        }}
      />
      <div className="flex-1 max-w-7xl mx-auto p-4 md:p-8 w-full">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Web Wallet
        </h1>

        <div className="flex flex-wrap gap-4 mb-8 border-b border-neutral-800">
          <button 
            className={`px-4 py-2 ${activeTab === 'generate' ? 'text-white border-b-2 border-neutral-400 -mb-[2px]' : 'text-neutral-400'}`}
            onClick={() => setActiveTab('generate')}
          >
            Generate Mnemonic
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'wallets' ? 'text-white border-b-2 border-neutral-400 -mb-[2px]' : 'text-neutral-400'}`}
            onClick={() => setActiveTab('wallets')}
          >
            Manage Wallets
          </button>
        </div>

        {activeTab === 'generate' && (
          <div className="space-y-8">
            <div className="bg-black rounded-xl p-6 border border-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">Your Secret Phrase</h2>
                <div className="flex items-center gap-3">
                  {mnemonic && (
                    <button 
                      onClick={() => copyToClipboard(mnemonic)}
                      className="flex items-center gap-2 px-4 py-2 bg-black border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-900 transition-colors"
                    >
                      <IoCopyOutline className="text-lg" />
                      
                    </button>
                  )}
                  <button 
                    onClick={generateMnemonic}
                    className="px-4 py-2 bg-[#5b170b] text-white rounded-lg hover:bg-[#732F2F] transition-colors"
                  >
                    Generate New
                  </button>
                </div>
              </div>
              
              {mnemonic ? (
                <div className="bg-black rounded-lg p-6 border border-neutral-800">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mnemonic.split(' ').map((word, index) => (
                      <div 
                        key={index}
                        className="bg-neutral-900 p-3 rounded-lg text-white text-center"
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-black rounded-lg p-6 border border-neutral-800 text-center text-neutral-400">
                  No mnemonic generated yet. Click &quot;Generate New&quot; to create one.
                </div>
              )}
            </div>

            <div className="bg-black rounded-xl p-6 border border-neutral-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Create a Wallet</h2>
                <button 
                  onClick={toggleBatchCreation}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  {showBatch ? 'Create Single Wallet' : 'Create Multiple Wallets'}
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {!showBatch && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 text-neutral-300">
                      Wallet Name (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-[#111111] border border-neutral-700 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
                      placeholder="e.g. My Main Wallet"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                    />
                  </div>
                )}

                {showBatch && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 text-neutral-300">
                      Number of Wallets
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 bg-[#111111] border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-400"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Math.max(1, Number(e.target.value)))}
                      min="1"
                      max="50"
                    />
                  </div>
                )}
              </div>
              
              <button 
                onClick={createWallet}
                className="w-full py-3 bg-[#5b170b] text-white rounded-lg hover:bg-[#732F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!mnemonic}
              >
                {showBatch ? `Create ${batchSize} Wallets` : 'Create Wallet'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Your Wallets</h2>
              {wallets.length > 0 && (
                <button 
                  onClick={deleteAllWallets}
                  className="px-4 py-2 bg-[#5b170b] text-white rounded-lg hover:bg-[#732F2F] transition-colors"
                >
                  Delete All
                </button>
              )}
            </div>
            
            {wallets.length === 0 ? (
              <div className="text-center text-neutral-400 p-8 border border-neutral-800 rounded-lg">
                No wallets created yet. Go to the Generate tab to create a wallet.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {wallets.map((wallet, index) => (
                  <div key={index} className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-medium text-white">{wallet.name}</h3>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => deleteWallet(index)}
                          className="px-3 py-1 bg-[#5b170b] text-white text-sm rounded hover:bg-[#732F2F]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-400">Address:</span>
                        <button 
                          onClick={() => copyToClipboard(wallet.address)}
                          className="flex items-center gap-1 text-sm text-neutral-300 hover:text-white"
                        >
                          <IoCopyOutline />
                          
                        </button>
                      </div>
                      <div className="bg-[#111111] p-3 rounded-lg break-all text-white font-mono text-sm">
                        {wallet.address}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-400">Private Key:</span>
                        <button 
                          onClick={() => copyToClipboard(wallet.privateKey)}
                          className="flex items-center gap-1 text-sm text-neutral-300 hover:text-white"
                        >
                          <IoCopyOutline />
                          
                        </button>
                      </div>
                      <div className="bg-[#111111] p-3 rounded-lg break-all text-white font-mono text-sm">
                        {wallet.privateKey.substring(0, 6)}...{wallet.privateKey.substring(wallet.privateKey.length - 4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="w-full border-t border-neutral-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto flex justify-center px-4 md:px-8">
          <p className="text-neutral-400 text-sm">
            Secure web wallet - Your keys, your crypto
          </p>
        </div>
      </footer>
    </div>
  );
}
