import './main.css';
import { toggleSidebar } from './app/toggleSidebar';
import { sidebarResize } from './app/sidebarResize';
import { searchBarFocus } from './app/searchBarFocus';
import toggleBoxesMouseClick from './app/toggleBoxesMouseClick';
import tasks from './app/tasks';

toggleSidebar();
sidebarResize();
searchBarFocus();
toggleBoxesMouseClick.run();
tasks.displayTasks();