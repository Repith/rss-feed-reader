# Option 1: Pull first, then push (if you want to merge remote changes)
git pull --rebase origin main
git push -u origin main

# Option 2: Force push (CAUTION: only use if you're sure you want to overwrite remote)
git push -u origin main --force

# Option 3: If the remote repository has a README or other files you don't have locally
# Pull first to get those files, then commit your changes
git pull origin main
# Resolve any conflicts if needed
git add .
git commit -m "Initial commit"
git push -u origin main