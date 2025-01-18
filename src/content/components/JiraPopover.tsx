import { Button } from '@/components/ui/button';
import jiraIcon from '@/assets/jira.svg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import Issues from './Issues';
import About from './About';

type TABS = 'ISSUES' | 'ABOUT';

export default function JiraPopover() {
  const [activeTab, setActiveTab] = useState<TABS>('ISSUES');
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="flex items-center rounded-md mx-1.5 text-zinc-50 gap-2 h-8 w-full md:w-auto bg-blue-900 hover:bg-blue-800">
          <img src={jiraIcon} className="h-4" alt="jira icon" />
          Open Jira
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white dark:bg-zinc-950 dark:border-zinc-800 border-zinc-200 shadow-lg p-2 m-0">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 ${activeTab === 'ISSUES' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('ISSUES')}
          >
            ISSUES
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'ABOUT' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('ABOUT')}
          >
            ABOUT
          </button>
        </div>
        <div className="flex items-center justify-center p-16">
          {activeTab === 'ISSUES' && <Issues />}
          {activeTab === 'ABOUT' && <About />}
        </div>
      </PopoverContent>
    </Popover>
  );
}
