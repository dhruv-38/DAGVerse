import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Helper component for Release Funds button
function ProfileReleaseButton({ req, fetchSolutionHash, handleRelease, account }) {
  const [solutionHash, setSolutionHash] = useState('');
  useEffect(() => {
    fetchSolutionHash(req.id).then(setSolutionHash);
  }, [req.id]);
  // Only show if user is payer, request is pending, and solution exists
  if (req.payer && req.payer.toLowerCase() === account.toLowerCase() && Number(req.status) === 0 && solutionHash) {
    return (
      <>
        <a href={`https://ipfs.io/ipfs/${solutionHash}`} target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold mr-2">View Solution</a>
        <button onClick={() => handleRelease(req.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">Release Funds</button>
      </>
    );
  }
  return null;
}

export default ProfileReleaseButton; 