
import React from 'react';
import ExtensionSidebar from '@/components/ExtensionSidebar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mock Codeforces Problem Page */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">B. Maximum Subarray Sum</h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Rating: 1900
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Time: 2s
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Memory: 256MB
              </span>
            </div>
          </div>
          
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              Given an array of integers, find the contiguous subarray with the largest sum and return its sum.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Input</h3>
            <p className="mb-4">
              The first line contains an integer n (1 ≤ n ≤ 10⁵) — the number of elements in the array.
              The second line contains n integers a₁, a₂, ..., aₙ (-10⁹ ≤ aᵢ ≤ 10⁹).
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Output</h3>
            <p className="mb-4">
              Output a single integer — the maximum sum of a contiguous subarray.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Example</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Input:</strong>
                  <pre className="mt-1 text-sm">5
-2 1 -3 4 5</pre>
                </div>
                <div>
                  <strong>Output:</strong>
                  <pre className="mt-1 text-sm">9</pre>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Note</h3>
            <p>
              In the example, the maximum sum subarray is [4, 5] with sum 9.
            </p>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Submit Solution</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>C++17 (GCC 9-64)</option>
                <option>Python 3.8.10</option>
                <option>Java 11.0.6</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Code</label>
              <textarea 
                className="w-full h-64 p-3 font-mono text-sm border border-gray-300 rounded-md"
                placeholder="Enter your solution here..."
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Extension Sidebar */}
      <ExtensionSidebar />
    </div>
  );
};

export default Index;
