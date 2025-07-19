@echo off
echo Starting compilation...
cd /d "d:\Mybytecode\mcp-servers\shopify"
rmdir /s /q dist 2>nul
echo Cleaned dist directory
npx tsc --build --force
echo Compilation complete.
dir dist
echo Build script finished.
