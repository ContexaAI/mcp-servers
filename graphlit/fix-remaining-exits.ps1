# PowerShell script to fix remaining process.exit(1) calls in tools.ts

$filePath = "d:\Mybytecode\mcp-servers\graphlit\src\tools.ts"
$content = Get-Content $filePath -Raw

# Pattern 1: Multi-line console.error followed by process.exit(1)
$pattern1 = '(?s)console\.error\(\s*"([^"]*?)"\s*\);\s*process\.exit\(1\);'
$replacement1 = 'console.warn("$1 environment variable not set, skipping operation.");
          return {
            content: [{
              type: "text",
              text: "$1 environment variable not configured. Please set $1."
            }],
            isError: true
          };'

# Pattern 2: Simple process.exit(1) after console.error
$pattern2 = '(?s)console\.error\(\s*`([^`]*?)`\s*\);\s*process\.exit\(1\);'
$replacement2 = 'console.warn("$1 environment variable not set, skipping operation.");
          return {
            content: [{
              type: "text",
              text: "$1 environment variable not configured. Please set $1."
            }],
            isError: true
          };'

# Pattern 3: Simple single line process.exit(1)
$pattern3 = 'process\.exit\(1\);'
$replacement3 = 'return {
            content: [{
              type: "text",
              text: "Configuration error. Please check environment variables."
            }],
            isError: true
          };'

Write-Host "Applying regex patterns..."

# Apply patterns
$content = $content -replace $pattern1, $replacement1
$content = $content -replace $pattern2, $replacement2
$content = $content -replace $pattern3, $replacement3

# Write back to file
Set-Content -Path $filePath -Value $content

Write-Host "Fixed remaining process.exit calls in tools.ts"
