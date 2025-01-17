import { Button } from '@/components/ui/button';
import jiraIcon from '@/assets/jira.svg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function JiraPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="flex items-center rounded-md mx-1.5 text-zinc-50 gap-2 h-8 w-full md:w-auto bg-blue-900 hover:bg-blue-800">
          <img src={jiraIcon} className="h-4" alt="jira icon" />
          Open Jira
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-zinc-950 opacity-100 bg-opacity-100">
        <div className="p-12"></div>
      </PopoverContent>
    </Popover>
  );
}
