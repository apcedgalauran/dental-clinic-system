# ========================================
# Git Setup and Push to GitHub Script
# ========================================

Write-Host "🦷 Dental Clinic - GitHub Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Check if git is installed
Write-Host "Step 1: Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first from https://git-scm.com/`n" -ForegroundColor Red
    exit
}

# Step 2: Get GitHub repository URL
Write-Host "Step 2: GitHub Repository Setup" -ForegroundColor Yellow
Write-Host "Please create a new repository on GitHub first (https://github.com/new)`n" -ForegroundColor Cyan

$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/dental-clinic.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Repository URL is required!`n" -ForegroundColor Red
    exit
}

Write-Host "`n✅ Repository URL: $repoUrl`n" -ForegroundColor Green

# Step 3: Initialize Git repository
Write-Host "Step 3: Initializing Git repository..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "⚠️  Git repository already exists. Skipping initialization.`n" -ForegroundColor Yellow
} else {
    git init
    Write-Host "✅ Git repository initialized`n" -ForegroundColor Green
}

# Step 4: Add all files
Write-Host "Step 4: Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added to staging area`n" -ForegroundColor Green

# Step 5: Create initial commit
Write-Host "Step 5: Creating initial commit..." -ForegroundColor Yellow
$commitMessage = Read-Host "Enter commit message (press Enter for 'Initial commit: Dental Clinic Management System')"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit: Dental Clinic Management System"
}

git commit -m "$commitMessage"
Write-Host "✅ Commit created: $commitMessage`n" -ForegroundColor Green

# Step 6: Add remote repository
Write-Host "Step 6: Adding remote repository..." -ForegroundColor Yellow

# Check if remote already exists
$remoteExists = git remote | Select-String -Pattern "origin"

if ($remoteExists) {
    Write-Host "⚠️  Remote 'origin' already exists. Updating...`n" -ForegroundColor Yellow
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}

Write-Host "✅ Remote repository added: $repoUrl`n" -ForegroundColor Green

# Step 7: Push to GitHub
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "This may ask for your GitHub credentials...`n" -ForegroundColor Cyan

try {
    git branch -M main
    git push -u origin main
    Write-Host "`n✅ Successfully pushed to GitHub!`n" -ForegroundColor Green
} catch {
    Write-Host "`n⚠️  If push failed, you may need to authenticate with GitHub." -ForegroundColor Yellow
    Write-Host "Try one of these options:" -ForegroundColor Cyan
    Write-Host "1. Use GitHub CLI: gh auth login" -ForegroundColor White
    Write-Host "2. Use Personal Access Token instead of password" -ForegroundColor White
    Write-Host "3. Use SSH URL instead of HTTPS`n" -ForegroundColor White
}

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Repository URL: $repoUrl" -ForegroundColor White
Write-Host "Commit Message: $commitMessage" -ForegroundColor White
Write-Host "`nYour repository should now be available at:" -ForegroundColor White
Write-Host $repoUrl.Replace(".git", "") -ForegroundColor Green
Write-Host "`n🎉 Done! Your dental clinic project is now on GitHub!`n" -ForegroundColor Green

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit your repository on GitHub" -ForegroundColor White
Write-Host "2. Add a license (Settings > Add License)" -ForegroundColor White
Write-Host "3. Add topics/tags for better discoverability" -ForegroundColor White
Write-Host "4. Update README with your GitHub username`n" -ForegroundColor White

pause
