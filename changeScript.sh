#this script allows me to add files to the develop branch, commit the changes, push to github and heroku, switch branches to staging, merge and push to github and heroku without having to type all of these commands to get the job done.

echo "Adding files to git.."
git add --all

echo "Enter a description for the commit: "
read commitMessage

echo "Committing changes.."
git commit -m "$commitMessage"

echo "Pushing to GitHub develop branch.."
git push origin develop

echo "Switching to staging branch.."
git checkout staging

echo "Merging staging branch with develop branch.."
git merge develop

echo "Pushing staging branch to GitHub.."
git push origin staging

echo "Pushing staging branch to Heroku.."
git push staging-heroku staging:master

