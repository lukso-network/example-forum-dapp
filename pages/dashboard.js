import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

function Dashboard() {

  const router = useRouter();

  return (
    <div className="App">
      <button
        className="nav-link dashboardButton"
        onClick={() => router.push('/create')}
      >
        Create Posts
      </button>
      <button
        className="nav-link dashboardButton"
        onClick={() => router.push('/browse')}
      >
        Browse Posts
      </button>
    </div>
  );
}

export default Dashboard;
