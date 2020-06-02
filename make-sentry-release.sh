#!/bin/bash

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

# Author: William Desportes <williamdes@wdes.fr>

ENV_NAME="$1"

set -e

if [ -z $ENV_NAME ]; then
    echo "please enter an env name as a first param (production/staging)"
    exit 1
fi

if ! [ -x "$(type -p sentry-cli)" ]; then
    echo 'Warning: sentry-cli is not installed.' >&2
    echo 'Warning: Installing sentry-cli...' >&2
    curl -sL https://sentry.io/get-cli/ | bash
fi

CLI="sentry-cli"
SENTRY_ORG="wdes"
SENTRY_PROJECT="wdes-stats"
SENTRY_GIT_REPO="wdes/wdes-stats"

if ! [ -x "$(type -p sentry-cli)" ]; then
    CLI="/usr/local/bin/sentry-cli"
fi

if [ -z $SENTRY_TOKEN ]; then
    echo "SENTRY_TOKEN in ENV is missing" >&2
    exit 1
fi

if [ ! -f .env.version ]; then
    echo ".env.version file is missing" >&2
    exit 1
fi

echo "Reading .env.version"
export $(cat .env.version)

echo "Start sentry-cli"

$CLI --auth-token $SENTRY_TOKEN releases --org $SENTRY_ORG new -p $SENTRY_PROJECT $VERSION_CODE
$CLI --auth-token $SENTRY_TOKEN releases --org $SENTRY_ORG set-commits $VERSION_CODE --commit "$SENTRY_GIT_REPO@$LAST_RELEASE..$VERSION_NAME"
$CLI --auth-token $SENTRY_TOKEN releases --org $SENTRY_ORG finalize $VERSION_CODE
$CLI --auth-token $SENTRY_TOKEN releases --org $SENTRY_ORG deploys $VERSION_CODE new --env $ENV_NAME --name $VERSION_NAME
$CLI --auth-token $SENTRY_TOKEN releases --org $SENTRY_ORG files $VERSION_CODE upload .env.version
$CLI --auth-token $SENTRY_TOKEN releases --org $SENTRY_ORG files $VERSION_CODE upload yarn.lock

echo "Done !"
