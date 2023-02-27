import './main.css';
import { toggleSidebar } from './app/toggleSidebar';
import { sidebarResize } from './app/sidebarResize';
import { searchBarFocus } from './app/searchBarFocus';
import addTaskMouseEventManager from './app/addTaskMouseEventManager';

toggleSidebar();
sidebarResize();
searchBarFocus();
addTaskMouseEventManager.run();