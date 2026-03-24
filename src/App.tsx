import { useState, useEffect } from "react";
import { connectWallet, fetchBalance, getPollVotes, castVote, FREIGHTER_ID, XBULL_ID } from "./lib/stellar";

function App() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [activeWallet, setActiveWallet] = useState<string>("");

  // Poll State
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [isVoting, setIsVoting] = useState(false);

  // App Notifications
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errMessage, setErrMessage] = useState<string | null>(null);

  // Poll synchronization
  useEffect(() => {
    const fetchVotes = async () => {
      const v = await getPollVotes();
      setVotes(v);
    };
    fetchVotes();
    // Real-time synchronization interval
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async (walletId: string) => {
    setErrMessage(null);
    try {
      const key = await connectWallet(walletId);
      if (key) {
        setPublicKey(key);
        setActiveWallet(walletId);
        const bal = await fetchBalance(key);
        setBalance(bal);
      }
    } catch (e: any) {
      if (e.message === "WalletNotFound") {
        setErrMessage(`Wallet extension for ${walletId} was not found. Please install it.`);
      } else if (e.message === "WalletRejected") {
        setErrMessage("Connection request was rejected by the user.");
      } else {
        setErrMessage("Failed to connect wallet.");
      }
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    setBalance(null);
    setActiveWallet("");
    setTxHash(null);
    setErrMessage(null);
    // Disconnect via kit if supported, although clearing local state is usually enough
  };

  const handleVote = async (voteYes: boolean) => {
    if (!publicKey) return;
    setIsVoting(true);
    setTxHash(null);
    setErrMessage(null);

    try {
      const hash = await castVote(publicKey, voteYes);
      setTxHash(hash);

      // Refresh state
      const bal = await fetchBalance(publicKey);
      setBalance(bal);
      const v = await getPollVotes();
      setVotes(v);
    } catch (error: any) {
      if (error.message === "InsufficientBalance") {
        setErrMessage("Insufficient balance to cast a vote. Need at least 2 XLM to cover base reserve and fees.");
      } else if (error.message === "WalletRejected") {
        setErrMessage("Transaction signing was rejected.");
      } else {
        setErrMessage(error.message || "Failed to submit vote.");
      }
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-neutral-900 shadow-xl rounded-2xl p-8 border border-neutral-800">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent mb-2 text-center">
          Soroban Live Poll
        </h1>
        <p className="text-center text-neutral-400 mb-6 text-sm">
          Stellar Level 2 Yellow Belt Submission
        </p>

        {!publicKey ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-neutral-300 text-center mb-2">
              Connect a wallet to participate in the poll.
            </p>
            <button
              onClick={() => handleConnect(FREIGHTER_ID)}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 transition font-semibold rounded-xl text-white shadow-lg cursor-pointer flex justify-center items-center gap-2"
            >
              Connect Freighter
            </button>
            <button
              onClick={() => handleConnect(XBULL_ID)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 transition font-semibold rounded-xl text-white shadow-lg cursor-pointer flex justify-center items-center gap-2"
            >
              Connect xBull
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {/* Wallet Info */}
            <div className="w-full bg-neutral-800 p-4 rounded-xl border border-neutral-700">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                  Connected: {activeWallet}
                </p>
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                  Balance: {balance !== null ? `${parseFloat(balance).toFixed(2)} XLM` : "..."}
                </p>
              </div>
              <p className="font-mono text-cyan-400 text-sm break-all font-semibold mt-2">
                {publicKey}
              </p>
            </div>

            <div className="w-full h-px bg-neutral-800 my-2" />

            {/* Poll UI */}
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Do you like building on Soroban?</h2>

              <div className="flex justify-between gap-4 mb-6">
                <div className="flex-1 bg-green-900/30 border border-green-800 p-4 rounded-xl">
                  <p className="text-sm text-green-400 font-bold mb-1">YES</p>
                  <p className="text-3xl font-mono text-white">{votes.yes}</p>
                </div>
                <div className="flex-1 bg-red-900/30 border border-red-800 p-4 rounded-xl">
                  <p className="text-sm text-red-400 font-bold mb-1">NO</p>
                  <p className="text-3xl font-mono text-white">{votes.no}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleVote(true)}
                  disabled={isVoting}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-neutral-800 transition font-bold rounded-xl text-white cursor-pointer disabled:cursor-not-allowed"
                >
                  Vote Yes
                </button>
                <button
                  onClick={() => handleVote(false)}
                  disabled={isVoting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 transition font-bold rounded-xl text-white cursor-pointer disabled:cursor-not-allowed"
                >
                  Vote No
                </button>
              </div>
              {isVoting && <p className="text-sm text-cyan-400 mt-3 animate-pulse">Processing transaction...</p>}
            </div>

            {/* Error & Success Messages */}
            {errMessage && (
              <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-xl mt-4">
                <p className="text-sm text-red-400 font-medium">⚠️ {errMessage}</p>
              </div>
            )}

            {txHash && (
              <div className="p-4 bg-green-950/30 border border-green-900/40 rounded-xl mt-4">
                <p className="text-sm text-green-400 font-medium mb-1">
                  ✅ Vote successfully recorded!
                </p>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition text-xs break-all font-mono underline block mt-2"
                >
                  View on Explorer
                </a>
              </div>
            )}

            <button
              onClick={handleDisconnect}
              className="w-full py-2.5 px-4 bg-transparent border border-neutral-700 hover:bg-neutral-800 transition font-semibold rounded-xl text-neutral-300 cursor-pointer mt-4"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
