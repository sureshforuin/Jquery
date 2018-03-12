"use strict";

const fs = require('fs');
const path = require('path');
const child_process = require("child_process");

/*
 * The initial focus for Artifactory NPM has been on providing support for pulling in third party
 * modules. The capability to publish modules to Artifactory will be added in due course, however
 * this script has been created as a stop gap to address this. It allows modules available from
 * AFS to be copied into node_modules/@morgan-stanley/{name} such that they can be treated as if
 * they were actually installed.
 * 
 * If the module that is copied contains a package.json in the root folder that is copied then
 * transitive dependencies will be installed. Alternatively a specific package.json override can be
 * provided.
 * 
 * Please see http://wiki.ms.com/NodeJS/Artifactory/NpmPublish#copy-afs-dependencies for more
 * details on how to use this script including whether it is still even needed.
 */

const nodeModulesDirectory = path.join(__dirname, "node_modules");
const scopedNodeModulesDirectory = path.join(nodeModulesDirectory, "@morgan-stanley");
const packageJson = "package.json";
const executableFolderName = ".bin";

/*
 * Deletes the current contents of the node_modules/@morgan-stanley folder, reads in the
 * afsDependencies declaration from package.json, iterates through them and copies each to
 * node_modules/@morgan-stanley/{name}.
 */
function copyAfsDependenciesToNodeModules() {
    const afsDependencies = getAllAfsDependenciesFromPackageJson();
    try {
        cleanUpPreviousMorganStanleyDependencies();
        Object.keys(afsDependencies).forEach(name => copyAfsDependencyToNodeModules(name, afsDependencies[name]));
    } catch(e) {
        log("ERROR - " + e.message);
        throw new Error("copy-afs-dependencies failed due to: " + e.message);
    }
}

/*
 * Reads in the contents of the project's package.json and returns the combined contents of
 * afsDependencies and afsDevDependencies. If afsDependencies and afsDevDependencies both declare
 * a dependency with the same name then afsDevDependencies takes precedence.
 */
function getAllAfsDependenciesFromPackageJson() {
    const projectPackageJsonPath = path.join(__dirname, "package.json");
    const packageJsonContent = require(projectPackageJsonPath);
    return Object.assign(packageJsonContent.afsDependencies || {}, packageJsonContent.afsDevDependencies || {});
}

/*
 * Loops through the current dependencies under node_modules/@morgan-stanley and removes any
 * executables that were set up for them within node_modules/.bin, then deletes
 * node_modules/@morgan-stanley and everything in it. 
 */
function cleanUpPreviousMorganStanleyDependencies() {
    deleteMorganStanleyExecutables();
    deleteMorganStanleyScopedDirectoryIfItExists();
}

/*
 * Loops through any dependencies under the node_modules/@morgan-stanley folder and removes any
 * executables that were set up for them.
 */
function deleteMorganStanleyExecutables() {
    if (fs.existsSync(scopedNodeModulesDirectory) && fs.lstatSync(scopedNodeModulesDirectory).isDirectory()) {
        const contents = fs.readdirSync(scopedNodeModulesDirectory);
        contents.forEach(dependencyName => {
            const dependencyPath = path.join(scopedNodeModulesDirectory, dependencyName);
            if (fs.lstatSync(dependencyPath).isDirectory()) {
                deleteMorganStanleyExecutablesForDependency(dependencyName);
            }
        });
    }
}

/*
 * Reads in the package.json for the specified dependency then loops through each of the
 * executables defined in it and removes them.
 */
function deleteMorganStanleyExecutablesForDependency(dependencyName) {
    const packageJsonPath = path.join(scopedNodeModulesDirectory, dependencyName, packageJson);
    const executables = require(packageJsonPath).bin || {};
    Object.keys(executables).forEach(name => {
        log("Removing old executable \"" + name + "\" declared by @morgan-stanley/" + dependencyName);
        if (isWindows()) {
            deleteWindowsExecutableForDependency(name);
        } else {
            deleteLinuxExecutableForDependency(name);
        }
    });
}

/*
 * Checks whether the specified executable exists under node_modules/.bin and removes it.
 */
function deleteWindowsExecutableForDependency(executableName) {
    const cmdPath = path.join(nodeModulesDirectory, executableFolderName, executableName + ".cmd");
    const shellScriptPath = path.join(nodeModulesDirectory, executableFolderName, executableName);
    deleteFileIfItExists(cmdPath);
    deleteFileIfItExists(shellScriptPath);
}

/*
 * Deletes the specified file if it exists.
 */
function deleteFileIfItExists(fullPath) {
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

/*
 * Checks whether the specified executable exists under node_modules/.bin and removes it.
 */
function deleteLinuxExecutableForDependency(executableName) {
    const symlinkPath = path.join(nodeModulesDirectory, executableFolderName, executableName);
    deleteFileIfItExists(symlinkPath);
}

/*
 * Removes any files within the current ./node_modules/@morgan-stanley directory to prevent
 * potential issues with out of date files hanging around.
 */
function deleteMorganStanleyScopedDirectoryIfItExists() {
    recursivelyDeleteFolderAndContents(scopedNodeModulesDirectory);
}

/*
 * Verifies that a valid dependency has been provided and copies it into the node_modules folder.
 */
function copyAfsDependencyToNodeModules(fullName, dependencyInfo) {
    verifyDependencyInfoIsAValidObject(fullName, dependencyInfo);
    verifyDependencyNameIsValid(fullName);
    verifyDependencyInfoPropertyIsDeclared(fullName, dependencyInfo, "meta");
    verifyDependencyInfoPropertyIsDeclared(fullName, dependencyInfo, "project");
    verifyDependencyInfoPropertyIsDeclared(fullName, dependencyInfo, "release");

    const directoryToCopy = path.join(path.sep + path.sep + "ms", "dist", dependencyInfo.meta, "PROJ", dependencyInfo.project, dependencyInfo.release, (dependencyInfo.folder?dependencyInfo.folder:""));
    const dependencyName = fullName.replace(/^@morgan-stanley\//, "");

    copyDependenciesToNodeModules(directoryToCopy, dependencyName, dependencyInfo.release, dependencyInfo.packageJsonOverride);
}

/*
 * Throws if the specified dependencyInfo is not an object, is null or is an Array.
 */
function verifyDependencyInfoIsAValidObject(fullName, dependencyInfo) {
    if (dependencyInfo === null || typeof dependencyInfo !== "object" || dependencyInfo instanceof Array) {
        throw new Error("Invalid afsDependencies entry for \"" + fullName + "\": value must be an object");
    }
}

/*
 * Throws if the name is not of the form @morgan-stanley/{name}.
 */
function verifyDependencyNameIsValid(fullName) {
    if (!/^@morgan-stanley\/[^\/]+$/.test(fullName)) {
        throw new Error("Invalid afsDependencies entry: dependency name \"" + fullName + "\" must be of the form \"@morgan-stanley/{name}\"");
    }
}

/*
 * Throws if the specified property name is not a string or is an empty string.
 */
function verifyDependencyInfoPropertyIsDeclared(fullName, dependencyInfo, propertyName) {
    if (typeof dependencyInfo[propertyName] !== "string" || dependencyInfo[propertyName].length === 0) {
        throw new Error("Invalid afsDependencies entry for \"" + fullName + "\": " + propertyName + " value must be a non-zero length string");
    }
}

/*
 * Recursively copies the files in the specified directory into:
 * ./node_modules/@morgan-stanley/{dependency-name}
 */
function copyDependenciesToNodeModules(directoryToCopy, dependencyName, version, packageJsonOverride) {
    verifyArgumentsAreValid(directoryToCopy, dependencyName);
    initializeScopedNodeModulesDirectory();
    copyFilesToNodeModulesDirectory(path.resolve(directoryToCopy), dependencyName);
    overridePackageJsonIfProvided(dependencyName, packageJsonOverride);
    createDefaultPackageJsonIfRequired(dependencyName, version);
    createExecutablesForModule(dependencyName);
    installDependenciesForModule(dependencyName);
}

/*
 * Checks whether all the arguments that are needed have been defined and have valid values. If not
 * then it throws an exception.
 */
function verifyArgumentsAreValid(directoryToCopy, dependencyName) {
    verifyArgumentIsDefined(directoryToCopy);
    verifyArgumentIsDefined(dependencyName);
    doesDirectoryToCopyExist(directoryToCopy);
}

/*
 * Throws an exception if the specified value is not a string or is an empty string.
 */
function verifyArgumentIsDefined(value) {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error("Invalid usage: node " + path.basename(__filename) + " {directory-to-copy} {dependency-name}");
    }
}

/*
 * Throws an exception if the specified directory does not exist or is not a directory.
 */
function doesDirectoryToCopyExist(fullPath) {
    if (!fs.existsSync(fullPath)) {
        throw new Error("Directory to copy does not exist: " + fullPath);
    }
    if (!fs.lstatSync(fullPath).isDirectory()) {
        throw new Error("Target to copy is not a directory: " + fullPath);
    }
}

/*
 * Delete the specified directory and all of its contents.
 */
function recursivelyDeleteFolderAndContents(fullPath, depth) {
    depth = depth || 0;

    if (depth === 0) {
        log("Deleting " + fullPath);
    }

    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
        const contents = fs.readdirSync(fullPath);
        contents.forEach(content => {
            const contentPath = path.join(fullPath, content);
            if (fs.lstatSync(contentPath).isDirectory()) {
                recursivelyDeleteFolderAndContents(contentPath, depth + 1);
            } else {
                fs.unlinkSync(contentPath);
            }
        });

        fs.rmdirSync(fullPath);
    }
}

/*
 * Creates the ./node_modules, ./node_modules/@morgan-stanley and ./node_modules/.bin directories
 * if necessary.
 */
function initializeScopedNodeModulesDirectory() {
    makeDirectoryIfDoesNotExist(nodeModulesDirectory);
    makeDirectoryIfDoesNotExist(scopedNodeModulesDirectory);
    makeDirectoryIfDoesNotExist(path.join(nodeModulesDirectory, executableFolderName));
}

/*
 * Create the directory if it doesn't already exist.
 */
function makeDirectoryIfDoesNotExist(fullPath) {
    if (!fs.existsSync(fullPath)) {
        log("Creating: " + fullPath);
        fs.mkdirSync(fullPath);
    }
}

/*
 * Copies the contents of the specified directory into:
 * ./node_modules/@morgan-stanley/{dependecy-name}
 */
function copyFilesToNodeModulesDirectory(directoryToCopy, dependencyName) {
    const targetDirectory = path.join(scopedNodeModulesDirectory, dependencyName);
    log("Copying " + directoryToCopy + " to " + targetDirectory);

    recursivelyCopyDirectory(directoryToCopy, targetDirectory);
}

/*
 * Recursively copies the contents of the specified source directory into the target directory.
 */
function recursivelyCopyDirectory(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    if (fs.lstatSync(source).isDirectory()) {
        const contents = fs.readdirSync(source);
        contents.forEach(content => {
            const sourcePath = path.join(source, content);
            const targetPath = path.join(target, content);
            if (fs.lstatSync(sourcePath).isDirectory()) {
                recursivelyCopyDirectory(sourcePath, targetPath);
            } else {
                copyFileSync(sourcePath, targetPath);
            }
        });
    }
}

/*
 * Copies the contents of the source file to a file of the same name within the target directory.
 */
function copyFileSync(source, target) {
    fs.writeFileSync(target, fs.readFileSync(source));
}

/*
 * Checks whether the a package.json override has been specified and if so copies it over into the
 * .node_modules/@morgan-stanley/{dependency-name} folder. If the package.json override doesn't
 * exist or is a folder rather than a file then this method will throw an exception.
 */
function overridePackageJsonIfProvided(dependencyName, packageJsonOverride) {
    if (packageJsonOverride !== undefined) {
        const sourceFilePath = path.join(__dirname, packageJsonOverride);
        if (!fs.existsSync(sourceFilePath)) {
            throw new Error("Invalid afsDependencies entry for \"@morgan-stanley/" + dependencyName + "\": specified packageJsonOverride file \"" + packageJsonOverride + "\" does not exist");
        }
        if (fs.lstatSync(sourceFilePath).isDirectory()) {
            throw new Error("Invalid afsDependencies entry for \"@morgan-stanley/" + dependencyName + "\": specified packageJsonOverride file \"" + packageJsonOverride + "\" is a directory");
        }
        const targetFilePath = path.join(scopedNodeModulesDirectory, dependencyName, "package.json");
        copyFileSync(sourceFilePath, targetFilePath)
    }
}

/*
 * Checks whether a package.json file exists at the root level of the copied dependency. If not it
 * generated a default package.json to ensure that `npm install` doesn't cause any issues.
 */
function createDefaultPackageJsonIfRequired(dependencyName, version) {
    const packageJsonPath = path.join(scopedNodeModulesDirectory, dependencyName, packageJson);
    if (!fs.existsSync(packageJsonPath)) {
        const packageJsonContents = {
            name: "@morgan-stanley/" + dependencyName,
            version: version,
            description: "Generated automatically by " + path.basename(__filename)
        };
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContents, null, 2));
    }
}

/*
 * Reads in the package.json for the dependency and sets up operating system specific executable
 * links as per the `bin` configuration option.
 */
function createExecutablesForModule(dependencyName) {
    const packageJsonPath = path.join(scopedNodeModulesDirectory, dependencyName, packageJson);
    const executables = require(packageJsonPath).bin || {};
    Object.keys(executables).forEach(name => {
        log("Adding executable \"" + name + "\" declared by @morgan-stanley/" + dependencyName);
        if (isWindows()) {
            createWindowsExecutableForDependency(dependencyName, name, executables[name]);
        } else {
            createLinuxExecutableForDependency(dependencyName, name, executables[name]);
        }
    });
}

/*
 * Creates a cmd file and a shell script within the node_modules/.bin directory which invokes the
 * specified executable.
 */
function createWindowsExecutableForDependency(dependencyName, executableName, executablePath) {
    createWindowsCmdExecutableForDependency(dependencyName, executableName, executablePath);
    createShellScriptExecutableForDependency(dependencyName, executableName, executablePath);
}

/*
 * Creates a cmd file within the node_modules/.bin directory which invokes the specified
 * executable.
 */
function createWindowsCmdExecutableForDependency(dependencyName, executableName, executablePath) {
    const windowsExecutablePath = executablePath.replace(/^\.\//, "").replace(/\//, "\\");
    const cmdFilePath = path.join(nodeModulesDirectory, executableFolderName, executableName + ".cmd");
    fs.writeFileSync(cmdFilePath, `@IF EXIST "%~dp0\\node.exe" (
  "%~dp0\node.exe"  "%~dp0\\..\\@morgan-stanley\\${dependencyName}\\${windowsExecutablePath}" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\\..\\@morgan-stanley\\${dependencyName}\\${windowsExecutablePath}" %*
)`);
}

/*
 * Creates a shell script within the node_modules/.bin directory which invokes the specified
 * executable.
 */
function createShellScriptExecutableForDependency(dependencyName, executableName, executablePath) {
    const cleanExecutablePath = executablePath.replace(/^\.\//, "");
    const shellScriptFilePath = path.join(nodeModulesDirectory, executableFolderName, executableName);
    fs.writeFileSync(shellScriptFilePath, `#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../@morgan-stanley/${dependencyName}/${cleanExecutablePath}" "$@"
  ret=$?
else 
  node  "$basedir/../@morgan-stanley/${dependencyName}/${cleanExecutablePath}" "$@"
  ret=$?
fi
exit $ret`);
}

/*
 * Creates a symlink within the node_modules/.bin directory to the specified executable.
 */
function createLinuxExecutableForDependency(dependencyName, executableName, executablePath) {
    const sharedExecutablePath = path.join("@morgan-stanley", dependencyName, executablePath.replace(/^\.\//, ""));
    const relativeExectuablePath = path.join(nodeModulesDirectory, sharedExecutablePath);
    const symlinkTarget = path.join("..", sharedExecutablePath);
    const symlinkPath = path.join(nodeModulesDirectory, executableFolderName, executableName);

    fs.symlinkSync(symlinkTarget, symlinkPath);
    fs.chmodSync(relativeExectuablePath, 493); // file permissions: rwxr-xr-x
}

/*
 * Invokes `npm install` within the node_modules/@morgan-stanley/{name} folder, passing in the
 * environment variables that this script is executing with.
 */
function installDependenciesForModule(dependencyName) {
    log("Installing dependencies for @morgan-stanley/" + dependencyName);
    const dependencyPath = path.join(scopedNodeModulesDirectory, dependencyName);
    child_process.execSync("npm install", { cwd: dependencyPath, stdio: "inherit", env: process.env });
}

/*
 * Returns true if running on Windows, otherwise false.
 */
function isWindows() {
    return process.platform.startsWith("win");
}

/*
 * Log the specified message with the script name as a prefix to assist with debugging build logs.
 */
function log(message) {
    console.log(path.basename(__filename) + ": " + message);
}



copyAfsDependenciesToNodeModules();