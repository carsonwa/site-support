import { useState, useEffect } from 'react';
import { instructionService } from '../services/instructionService';
import metaInstructions from '../instructions/meta.md?raw';

const STORAGE_KEY = 'site-support-instructions';
type Tab = 'wordpress' | 'general' | 'meta';

export default function InstructionEditor() {
  const [instructions, setInstructions] = useState(instructionService.getInstructions());
  const [activeTab, setActiveTab] = useState<Tab>('wordpress');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setInstructions(instructionService.getInstructions());
  }, []);

  const handleContentChange = (content: string) => {
    setInstructions(prev => ({
      ...prev,
      [activeTab]: content
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    instructionService.updateInstructions(activeTab as 'wordpress' | 'general', instructions[activeTab]);
    setIsDirty(false);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('wordpress')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'wordpress'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            WordPress
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'general'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'meta'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Meta
          </button>
        </div>
      </div>

      {activeTab === 'meta' ? (
        <textarea
          value={instructions.meta}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full mb-4 p-4 border rounded-lg font-mono text-sm resize-none"
          style={{ height: '70vh' }}
          placeholder="Enter meta instructions..."
        />
      ) : (
        <textarea
          value={activeTab === 'wordpress' ? instructions.wordpress : instructions.general}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full mb-4 p-4 border rounded-lg font-mono text-sm resize-none"
          style={{ height: '70vh' }}
          placeholder={`Enter ${activeTab} instructions...`}
        />
      )}

      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`w-full px-4 py-2 rounded-lg ${
            isDirty
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Save Changes
        </button>
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
} 