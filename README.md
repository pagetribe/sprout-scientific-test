# sprout-scientific-test

> **Note if you run the code locally there is an error in the console `index.js:1 Warning: findDOMNode is deprecated in StrictMode.` this is a known issue and will be fixed in the next version of material-ui.**

Problem Statement:
Create a UI component which has the following capabilities.
1. Enter an email ID into an input that validates the user input.
2. Attach a file of any file type, and show the progress of the upload.
3. Let the user send the email by clicking the send button
4. Let the user reset the component by clicking the reset button if a file and/or an email has
been set in the component. Otherwise disable this button.
5. Show the state of the button, such as not pressed, disabled, and pressed.
Error reporting:
1. Report the error message to the user when the email is not valid
2. Report the error message when the server connection fails
3. Report the error message when the attachment fails
Success:
If the entries are valid and the email goes through okay. Then let the user know the success
status. When it's successful, the email and the attachment must be cleared and only the
success message must be rendered. A timeout must be implemented to clear the success
message.
Emailing:
Use of Gmail API or something similar is essential. One of the purposes of this test is to see if
you are able to find the documentation of a third party API and able to integrate into your app.
Backend API and database:
1. Each submission must be recorded in a nonrelational or relational database.
2. To do so, implement your own REST API to save the following records for each
submission
a. Submission ID
b. Date and Time
c. Email
d. File Name
Frontend:
Follow the attached design files as a guide to get the frontend design right. The frontend must
be designed to be responsive. You can use the tool Figma to play with the design files.

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
