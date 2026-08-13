#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_dir"

for schema in schemas/*.json; do
    jq -e . "$schema" >/dev/null
done
for example in examples/*.json; do
    jq -e . "$example" >/dev/null
done

if [ ! -d node_modules/ajv ]; then
    echo "Install pinned validator dependencies first: npm install"
    exit 2
fi

npm run validate
