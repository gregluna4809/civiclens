@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script for Windows.
@REM ----------------------------------------------------------------------------
@echo off
setlocal EnableDelayedExpansion

set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"
set "MAVEN_WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "MAVEN_WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

if not exist "%MAVEN_WRAPPER_JAR%" (
  for /f "tokens=1,* delims==" %%A in ('findstr /b "wrapperUrl=" "%MAVEN_WRAPPER_PROPERTIES%"') do set "WRAPPER_URL=%%B"
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '!WRAPPER_URL!' -OutFile '%MAVEN_WRAPPER_JAR%'"
  if errorlevel 1 exit /b 1
)

java -classpath "%MAVEN_WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
