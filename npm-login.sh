#!/usr/bin/env bash
aws codeartifact login --tool npm \
--repository npm-store \
--domain indykaraoke-plug \
--domain-owner 546515125053 \
--region us-east-2