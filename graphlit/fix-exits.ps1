$content = Get-Content 'src\tools.ts' -Raw

# Replace all remaining process.exit patterns with a more general approach
$content = $content -replace 'console\.error\("Please set ([A-Z_]+) environment variable\."\);\s*process\.exit\(1\);', 'console.warn("$1 environment variable not set, skipping operation."); return { content: [{ type: "text", text: "$1 not configured. Please set $1 environment variable." }], isError: true };'

# Handle more specific cases for email patterns
$content = $content -replace 'console\.error\("Please set GOOGLE_EMAIL_CLIENT_ID environment variable\."\);\s*process\.exit\(1\);', 'console.warn("GOOGLE_EMAIL_CLIENT_ID environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Google Email client ID not configured. Please set GOOGLE_EMAIL_CLIENT_ID environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set GOOGLE_EMAIL_CLIENT_SECRET environment variable\."\);\s*process\.exit\(1\);', 'console.warn("GOOGLE_EMAIL_CLIENT_SECRET environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Google Email client secret not configured. Please set GOOGLE_EMAIL_CLIENT_SECRET environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set GOOGLE_EMAIL_REFRESH_TOKEN environment variable\."\);\s*process\.exit\(1\);', 'console.warn("GOOGLE_EMAIL_REFRESH_TOKEN environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Google Email refresh token not configured. Please set GOOGLE_EMAIL_REFRESH_TOKEN environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set MICROSOFT_EMAIL_CLIENT_ID environment variable\."\);\s*process\.exit\(1\);', 'console.warn("MICROSOFT_EMAIL_CLIENT_ID environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Microsoft Email client ID not configured. Please set MICROSOFT_EMAIL_CLIENT_ID environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set MICROSOFT_EMAIL_CLIENT_SECRET environment variable\."\);\s*process\.exit\(1\);', 'console.warn("MICROSOFT_EMAIL_CLIENT_SECRET environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Microsoft Email client secret not configured. Please set MICROSOFT_EMAIL_CLIENT_SECRET environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set MICROSOFT_EMAIL_REFRESH_TOKEN environment variable\."\);\s*process\.exit\(1\);', 'console.warn("MICROSOFT_EMAIL_REFRESH_TOKEN environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Microsoft Email refresh token not configured. Please set MICROSOFT_EMAIL_REFRESH_TOKEN environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set JIRA_EMAIL environment variable\."\);\s*process\.exit\(1\);', 'console.warn("JIRA_EMAIL environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Jira email not configured. Please set JIRA_EMAIL environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set JIRA_TOKEN environment variable\."\);\s*process\.exit\(1\);', 'console.warn("JIRA_TOKEN environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Jira token not configured. Please set JIRA_TOKEN environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set TWITTER_CONSUMER_API_KEY environment variable\."\);\s*process\.exit\(1\);', 'console.warn("TWITTER_CONSUMER_API_KEY environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Twitter consumer API key not configured. Please set TWITTER_CONSUMER_API_KEY environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set TWITTER_CONSUMER_API_SECRET environment variable\."\);\s*process\.exit\(1\);', 'console.warn("TWITTER_CONSUMER_API_SECRET environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Twitter consumer API secret not configured. Please set TWITTER_CONSUMER_API_SECRET environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set TWITTER_ACCESS_TOKEN_KEY environment variable\."\);\s*process\.exit\(1\);', 'console.warn("TWITTER_ACCESS_TOKEN_KEY environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Twitter access token key not configured. Please set TWITTER_ACCESS_TOKEN_KEY environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set TWITTER_ACCESS_TOKEN_SECRET environment variable\."\);\s*process\.exit\(1\);', 'console.warn("TWITTER_ACCESS_TOKEN_SECRET environment variable not set, skipping operation."); return { content: [{ type: "text", text: "Twitter access token secret not configured. Please set TWITTER_ACCESS_TOKEN_SECRET environment variable." }], isError: true };'

$content = $content -replace 'console\.error\("Please set FROM_EMAIL_ADDRESS environment variable\."\);\s*process\.exit\(1\);', 'console.warn("FROM_EMAIL_ADDRESS environment variable not set, skipping operation."); return { content: [{ type: "text", text: "From email address not configured. Please set FROM_EMAIL_ADDRESS environment variable." }], isError: true };'

Set-Content 'src\tools.ts' -Value $content -NoNewline
Write-Host "Completed all process.exit replacements"
