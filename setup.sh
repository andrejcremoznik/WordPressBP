#!/usr/bin/env bash

if [ $# -ne 2 ]; then
	echo -e "Usage:\n $0 <namespace> <project_path>\n"
	echo " <namespace>:    Alphanumeric name for your project. Used for namespacing functions, textdomains etc."
	echo " <project_path>: Path to where the plugins and themes directories will be set up."
	exit
fi

namespace="$1"
project_path=${2%/}

if [ ! -d $project_path ]; then
	echo "The directory $project_path does not exist. Exiting..."
	exit
fi

echo "Creating a working copy of WordPressBP in $project_path"

git archive --format=tar master | tar -xf -C $project_path

echo "Renaming folders and files..."

for f in `find $project_path -depth -name '*WordPressBP*'`; do
	# path before directory/file name
	tmp_path=${f%/*}
	# directory/file name
	tmp_file=$(basename $f)
	# renamed directory/file
	tmp_file_new=${tmp_file/WordPressBP/$namespace}
	# do the move
	mv ${tmp_path}/${tmp_file} ${tmp_path}/${tmp_file_new}
done

rm ${project_path}/readme.md

echo "Namespacing file contents..."

find ${project_path}/* -type f -print0 | xargs -0 sed -i "s/WordPressBP/${namespace}/g"

echo "All done. Happy hacking!"
