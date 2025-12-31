# Chronicle

## Viewing the App Remotely

```
https://sparklyturtle17.github.io/chronicle/
```
this link is saved on your ipad as a button "...live"

github is hosting the app, but it will not update as you work, only when you save (as described below), and then it will take about 10 minutes to restart and show your changes

## Warning!
Rafiki should only edit files inside the folder /entries
we can discuss and work together on files outside of that

## To Create Blog Entries:

### New Entries:
From the github app, open and copy the template.html file
Open the editor app and paste template html you copied
Write html within the "replace" comments, dont forget the head title and create date tags
Theres a preview button at the top right
Copy file
In github app, create new file entry-name.html paste contents from the editor
In github app, commit

### Editing Published Entries:
In github app, copy file contents of entry you want to change
Paste in editor app and edit
Theres a preview button at the top right
Copy file
In github app, create new file entry-name.html paste contents from the editor
In github app, commit

## For the Blog Container: 

###### Open the Development Environment
to get to the code from the github repository click the green button "code" with a dropdown and select "stunning couscous"

###### Tour of Development Environment
the left window is the file directory, keep in mind, only files inside /entries should be edited without Olivia

the bottom window is called "terminal" and is used to start a server to host your webpage locally, so you can see changes as you make them, as well as where you will save your project when done

###### Terminal Commands

###### Starting the Webpage Locally

```
npm run dev
```

this starts your server and then something should pop up in the bottom right that says "open in browser"
    make sure and click this to open your webpage
    if it ever gets closed out, your terminal should have a link you can copy and paste into the browser to open it up again (this might be the exact link: http://localhost:5173/)
    I find it helpful when developing to open my code and webpage in "split screen mode"

```
crtl + C
```

this stops the server ***you must do this in order to save your work as described below***

###### Saving Your Work FROM THE DEVELOPMENT ENVIRONMENT

when you have completed a feature and are ready to save (don't save if your app is in a "broken" state, your changes will still be there, savepoints just make a good place to come back to)

```
git status
```

this should show a list of all the files you have changed (make sure they are all within /entries)

```
git add .

git commit -m "include a message of what feature you are adding"

git push
```
