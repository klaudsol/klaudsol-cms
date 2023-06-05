#!/bin/bash

yarn install
yarn run db structure
yarn run db seed
yarn run db seed-demo
yarn run db migrate