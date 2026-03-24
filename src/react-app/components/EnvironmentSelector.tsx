import { useEnvironment } from '@/react-app/context/EnvironmentContext';
import { Environment } from '@/react-app/config/environments';
import { Server, FlaskConical, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/react-app/components/ui/dropdown-menu';

const environments: { value: Environment; label: string; icon: typeof Server }[] = [
  { value: 'production', label: 'Production', icon: Server },
  { value: 'sandbox', label: 'Sandbox', icon: FlaskConical },
];

export function EnvironmentSelector() {
  const { environment, setEnvironment } = useEnvironment();
  
  const currentEnv = environments.find(e => e.value === environment) || environments[0];
  const Icon = currentEnv.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
          <Icon className="w-4 h-4" />
          <span>{currentEnv.label}</span>
          <ChevronDown className="w-4 h-4 text-white/70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {environments.map((env) => {
          const EnvIcon = env.icon;
          return (
            <DropdownMenuItem
              key={env.value}
              onClick={() => setEnvironment(env.value)}
              className={`flex items-center gap-2 ${
                environment === env.value ? 'bg-accent/10' : ''
              }`}
            >
              <EnvIcon className="w-4 h-4" />
              <span>{env.label}</span>
              {environment === env.value && (
                <span className="ml-auto text-xs text-accent">Active</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
