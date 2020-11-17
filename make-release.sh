#!/bin/bash

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

# Author: William Desportes <williamdes@wdes.fr>

ENV=""
TAG_NAME=""
PUSH_TAG=0
SHOW_HELP=0
OFFLINE=0
VERSION_SEPARATOR='-'

# Source: https://stackoverflow.com/a/46793269/5155484 and https://stackoverflow.com/a/28466267/5155484
optspec="hpo-:e:n:"
while getopts "$optspec" OPTCHAR; do

    if [ "$OPTCHAR" = "-" ]; then   # long option: reformulate OPT and OPTARG
        OPTCHAR="${OPTARG%%=*}"       # extract long option name
        OPTARG="${OPTARG#$OPT}"   # extract long option argument (may be empty)
        OPTARG="${OPTARG#=}"      # if long option argument, remove assigning `=`
    fi
    OPTARG=${OPTARG#*=}

    # echo "OPTARG:  ${OPTARG[*]}"
    # echo "OPTIND:  ${OPTIND[*]}"
    # echo "OPTCHAR:  ${OPTCHAR}"
    case "${OPTCHAR}" in
        h|help)
            SHOW_HELP=1
            ;;
        o|offline)
            OFFLINE=1
            ;;
        p|push-tag)
            PUSH_TAG=1
            ;;
        n|tag-name)
            TAG_NAME="${OPTARG}"
            ;;
        e|env)
            ENV="${OPTARG}"
            ;;
        *)
            if [ "$OPTERR" != 1 ] || [ "${optspec:0:1}" = ":" ]; then
                echo "Non-option argument: '-${OPTARG}'" >&2
            fi
            ;;
    esac
done

shift $((OPTIND-1)) # remove parsed options and args from $@ list

if [ ${SHOW_HELP} -gt 0 ]; then
    echo 'Usage:'
    echo 'make-release.sh --env=production -p'
    echo 'make-release.sh --env=staging    -p'
    echo 'POSIX options:		long options:'
    echo '  -h                      --help          To have some help'
    echo '  -e                      --env=          To specify the env (staging/production)'
    echo '  -n                      --tag-name=     To specify the tag name'
    echo '  -p                      --push-tag      To push the tag'
    echo '  -o                      --offline       Do not fetch tags'
    exit 0;
fi

if [ -z $ENV ]; then
    echo "please enter a --env"
    exit 1
fi

if [ ${OFFLINE} -eq 0 ]; then
    echo "Fetching latest tags..."
    git fetch --prune origin "+refs/tags/*:refs/tags/*"
fi

echo "Get last release"
ENV_TAGS=$(git tag -l HEAD "$ENV/*" --sort='-*taggerdate')
DAY_TAGS=$(echo -e "${ENV_TAGS}" | grep -F "$(date +'%Y-%m-%d')")

# No tag name defined so use the latest tag
if [ -z "${TAG_NAME}" ]; then
    LAST_RELEASE=$(echo -e "${DAY_TAGS}" | head -n1)
else
    # Tag name defined so use the last tag before last one (offset 1)
    LAST_RELEASE=$(echo -e "${DAY_TAGS}" | sed -n 2p)
fi

if [ -z "$LAST_RELEASE" ]; then
    echo "None today, using first one"
    LAST_RELEASE=$(echo "$ENV/$(date +'%Y-%m-%d')${VERSION_SEPARATOR}0");# will be +1 below
    # Last found release for ENV
    # No tag name defined so use the latest tag
    if [ -z "${TAG_NAME}" ]; then
        PREVIOUS_RELEASE=$(echo -e "${ENV_TAGS}" | head -n1)
    else
        # Tag name defined so use the last tag before last one (offset 1)
        PREVIOUS_RELEASE=$(echo -e "${ENV_TAGS}" | sed -n 2p)
    fi
else
    PREVIOUS_RELEASE="$LAST_RELEASE"
    echo "Found: $LAST_RELEASE"
fi

echo "Version bump..."
if [ -z "${TAG_NAME}" ]; then
    # Cut on last - and bump last number
    VERSION_NAME=$(echo "${LAST_RELEASE}" | awk -F"${VERSION_SEPARATOR}" '{print substr($0, 0, length($0) - length($NF)) $NF + 1 }')
else
    VERSION_NAME="$TAG_NAME"
fi

# Make the version Sentry compatible
VERSION_CODE=$(echo "${VERSION_NAME}" | sed 's,/,_,g')

echo "New version: $VERSION_NAME"
if [ -z "${TAG_NAME}" ]; then
    git tag --message="release: $VERSION_NAME
user: $USER" $VERSION_NAME
    if [ ${PUSH_TAG} -eq 1 ]; then
        git push origin $VERSION_NAME
    fi
else
    echo "Using tag: ${TAG_NAME}"
fi

TAG_WORKS=$?

echo -e "VERSION_NAME=$VERSION_NAME\nVERSION_CODE=$VERSION_CODE\nLAST_RELEASE=$PREVIOUS_RELEASE" > .env.version
exit $TAG_WORKS
