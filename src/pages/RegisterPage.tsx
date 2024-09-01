import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebaseconfig.ts';  

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      console.log("User signed up and profile updated:", user);

      window.location.href = 'main.html';
    } catch (error) {
      console.error("Sign up error:");
      alert("Sign up failed: ");
    }
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Sign Up</h2>
        <form id="signup-form" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-purple-500"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-purple-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-purple-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password-confirmation" className="block text-sm font-medium text-gray-300">Confirm Password</label>
            <input
              type="password"
              id="password-confirmation"
              name="password_confirmation"
              className="mt-1 w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-purple-500"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full py-2 bg-purple-500 rounded-lg text-white text-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-400">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-purple-500 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}