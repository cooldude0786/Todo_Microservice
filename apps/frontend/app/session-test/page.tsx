'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function SessionTestPage() {
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Session Management Test</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Session Status: {status}</h2>
      </div>
      
      {status === 'loading' ? (
        <p>Loading session...</p>
      ) : session ? (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Session Details:</h3>
          <p><strong>User ID:</strong> {session.user?.id}</p>
          <p><strong>Name:</strong> {session.user?.name}</p>
          <p><strong>Email:</strong> {session.user?.email}</p>
          <p><strong>Access Token:</strong> {session?.accessToken ? 'Available' : 'Not available'}</p>
          
          <div className="mt-4">
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>No active session</p>
          <div className="mt-4">
            <button
              onClick={() => signIn('credentials', { 
                email: 'test@example.com', 
                password: 'password', 
                redirect: false 
              })}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign In (Test)
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium">API Routes Status:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Protected API routes now use Next-Auth sessions</li>
          <li>Login/Signup pages use Next-Auth signIn function</li>
          <li>Logout uses Next-Auth signOut function</li>
          <li>Navbar displays user name from session</li>
        </ul>
      </div>
    </div>
  );
}