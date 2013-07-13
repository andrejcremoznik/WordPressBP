#!/bin/bash

if [ $# -ne 2 ]; then
	echo -e "Usage:\n $0 <namespace> <project/path>\n"
	echo " <namespace>:    Alphanumeric name for your project. Used for namespacing functions, textdomains etc."
	echo " <project_path>: Path to where the plugins and themes directories will be set up."
	exit
fi

namespace="$1"
project_path="$2"

if [ ! -d $project_path ]; then
	echo "The directory $project_path does not exist. Exiting..."
	exit
fi

echo "Creating a working copy of WordPressBP in $project_path"

git archive --format=tar master | tar -x -C $project_path

echo "Done."

echo "TODO: namespacing"
