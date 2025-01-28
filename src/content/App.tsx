import { Button } from '@/components/ui/button';
import jiraIcon from '@/assets/jira.svg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import Issues from './components/Issues';
import Requirements from './components/About';
import TaskImage from '@/assets/jira/task.svg';
import RequirementsImage from '@/assets/jira/requirements.svg';

type TABS = 'issues' | 'requirements';

export default function App() {
  const [response, setResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TABS>('issues');
  const [selectedIssues, setSelectedIssues] = useState<boolean[]>([]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: 'fetchJiraData',
        jql: 'issuetype = Task AND assignee = currentUser()',
        githubLink: window.location.href,
      },
      // {
      //   action: 'fetchJiraData',
      //   jql: 'sprint in openSprints() AND issuetype = Task AND assignee = currentUser()',
      //   githubLink: window.location.href,
      // },
      (response) => {
        console.log(response);
        setResponse(response);
        if (response?.issues && selectedIssues.length === 0) {
          setSelectedIssues(new Array(response.issues.length).fill(false));
        }
      }
    );
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="flex items-center rounded-md mx-1.5 text-zinc-50 gap-2 h-8 w-full md:w-auto bg-blue-900 hover:bg-blue-800">
          <img src={jiraIcon} className="h-4" alt="jira icon" width={14} height={14} />
          Open Jira
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="shadow-lg p-2 m-0"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onKeyPress={handleKeyPress}
      >
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TABS)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="issues" className="tab-trigger">
              <img src={TaskImage} className="mr-1" width={14} height={14} />
              Issues
            </TabsTrigger>
            <TabsTrigger value="requirements" className="tab-trigger">
              <img src={RequirementsImage} className="mr-1" width={14} height={14} />
              Requirements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="issues" forceMount className="data-[state=inactive]:hidden">
            <Issues response={response} selectedIssues={selectedIssues} setSelectedIssues={setSelectedIssues} />
          </TabsContent>
          <TabsContent value="requirements" className="data-[state=inactive]:hidden">
            <Requirements />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
