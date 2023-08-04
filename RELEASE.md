# 3.8.1
* Added the following to `Rich text` attribute type:
  * Normal heading
  * Color
  * Highlight

# 3.8.0
* Add filter for boolean attribute type
* Add File Attribute Type
* Fix Galleries
* Return 404 when API entity is missing
* Attribute Type Improvements

# 3.7.0
* You can now save content as draft first, then publish later on.
* Fixed bug involving deletion of entries.
* Introduced singleton-related bug fixes.

# 3.6.2
* Add default value for empty galleries

# 3.6.1
* Add anchor links to Rich Text Attribute Type


# 3.6.0
* Added Boolean attribute type
* Added Video attribute type
* Added Custom Attribute types feature via plugins.
* Can now use exported classes of plugins using the `plugin()` function
* Added Singleton variant for Content Type.
* Added Rich Text Attribute type

# 3.5.1
* Removed fields validation for now, will roll-out a more robust field validation mechanism in the future.

# 3.5.0
* The installation process is now easier 
* Added download to CSV feature

# 3.4.0
* Added user management systems
* Added sign up route
* Added sidebar icons
* Added Gallery attribute
* Fixed capabilities for Administrators and Editors
* Login now returns JWT if the host is not from the CMS
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
