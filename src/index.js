import './main.css';
import { toggleSidebar } from './app/toggleSidebar';
import { sidebarResize } from './app/sidebarResize';
import { searchBarFocus } from './app/searchBarFocus';
import addTaskBox from './app/addTaskBox';
import tasks from './app/tasks';

toggleSidebar();
sidebarResize();
searchBarFocus();
addTaskBox.activateBtns();
tasks.displayTasks();