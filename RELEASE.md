# 3.5.0
* The installation process is now easier 
* Added download to CSV feature

# 3.4.0
* Added user management systems
* Added sign up route
* Added sidebar icons
* Added gallery attribute
* Fixed capabilities for administrators and editors
* Login now returns jwt if the host is not from the cms
* Plugins can now have sub items on the sidebar
* Users can now update their profile

# 3.3.0
* Allow plugins to have migrations 

# 3.2.2
* Fixed a bug that prevents users from changing the front logo

# 3.2.1
* Refactored out migration scripts and plugin system to @klaudsol/commons
* Bump up @klaudsol/commons to 1.4.0

# 3.2.0
* New Plugin System - introduce custom code to Klaudsol CMS without modifying a single line to the codebase.
* JWT tokens - enable authentication for external systems
* New DB Migration system - include database changes in the codebase for easier deploy to multiple systems.
