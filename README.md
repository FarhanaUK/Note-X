# NOTE X

## APP SUMMARY

This app is a note-taking tool that allows users to create, manage, and download sections of notes with URLs. Here's a summary of its key features and functionality:

## Key Features:

## 1. Sections and Notes:

Users can add new sections, each with a title (subject) and notes field.
Sections are collapsible and can be toggled open or closed.
Each section can hold multiple URLs.

## 2. URL Management:

Users can add valid URLs to each section.
The app extracts the domain name from the URL for display purposes.
Users can delete individual URLs from a section.

## 3. Validation:

Before adding a URL, the app checks if the input is valid. If invalid, an error message is displayed.
Sections with empty titles are highlighted in red, and users cannot download their notes unless all sections have titles.

## 4. Download Functionality:

Users can download their notes, including titles, notes, and links, as a text file. The download button triggers a check to ensure that all sections have titles.
## 5. Dark Mode:

A toggle switch allows users to switch between light and dark modes.

## 6. Persistent State:

The state of the app, including all sections and URLs, is saved in localStorage and reloaded when the user revisits the app.


## APP WORKFLOW:

Adding Sections: Clicking the "Add New" button creates a new section with empty fields for title, notes, and URLs.
Adding Links: Users submit links through a form. If the URL is valid, it is added to the corresponding section; otherwise, an error message appears.
Deleting Sections/Links: Users can delete individual sections or links within a section.
Downloading Notes: Once all section titles are filled, users can download the notes in a structured format.
The app is designed with accessibility and usability in mind, ensuring easy note management with built-in validation and a clean user interface.

# STACK

- JavaScript
- React
- HTML5
- CSS3
- FontAwesome
- Validator.js
- GitHub
- VS Code
- Vite
- Local Storage


#### Contact FarhanaUK:: farhanaaktar@live.co.uk
