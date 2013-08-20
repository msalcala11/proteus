#this script allows me to add files to the develop branch, commit the changes, push to github and heroku, switch branches to staging, merge and push to github and heroku without having to type all of these commands to get the job done.

git add --all
echo "Enter a description for the commit: "
read commitMessage
git commit -m "$commitMessage"
git push origin develop

git checkout staging
git merge develop
git push origin staging
git push staging-heroku staging:master

