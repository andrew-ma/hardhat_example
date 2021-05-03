#!/bin/bash

hh flatten "$@" 2>/dev/null > output

# remove all SPDX comments
sed -i 's/[/][/] SPDX-License-Identifier:.*//' output

# add SPDX comment to first line
sed -i '1 i\// SPDX-License-Identifier: UNLICENSED' output

cat output

# replace now with block.timestamp
# sed -i 's/now/block.timestamp/g' output