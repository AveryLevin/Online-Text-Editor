# Online-Text-Editor       
This project is an online code editor where users can create coding projects and share them with their freinds. The main goal of this project was to further familiarize myself with many of the Web Application Frameworks used today in professional software development. It initially was planned, designed, developed, and tested over the course of a few weeks and was designed in a way to allow for future features to be added on.      

[Live Demo](https://my-codeshare.herokuapp.com/)      

## Project Features:
>__Dynamic page rendering__: Uses Vue.js and fetch API to send data updates to and receive updates from the backend without reloading the page.  
>__User creation and Authentication__: Website supports creation of and login of users. User preferences are automatically saved to their profiles in the database.  
>__Generated File/Folder System__: Web app implements a folder system with basic add/delete functionality to store coding files
>__Multiple Programming Language Support__: Online code editor supports '.py', '.html', '.css', '.java', '.js' filetypes  
>__Shareable Projects__: Users can add others as collaborators on their projects so they can asynchronously contribute to the code

## Technologies Used:
>__Django__: for backend data management. Utilized the object-relational mapping layer to interact with the database.  
>__Vue.js__: for frontend reactivity. Used along with fetch API to make live updates to both the back and frontend based off user input.  
>__CodeMirror__: for frontend implementation of a code editor
>__MySQL__: for local database.  
>__PostgreSQL__: for hosted database.  

## Languages Used:
>__Python__  
>__HTML5__  
>__CSS__  
>__JavaScript__  

## Future Features:
>__Publishing Projects__: making projects public for all to see              
>__Synchronous Collaboration__: codefiles can be edited at the same time by multiple users in a 'google docs'-esque way          
>__Integrated Version Control__: integration for basic git commands               
