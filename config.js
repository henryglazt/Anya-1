{
  "name": "NuruAruvi",
  "version": "29.12.19",
  "description": "A very complete Discord bot (more than 70 commands) that uses the Discordjs API!",
  "main": "nuruaruvi.js",
  "scripts": {
    "start": "node .",
    "lint": "eslint . --ext .js",
    "testcfg": "node scripts/verify-config.js"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "author": "DooM™",
  "license": "ISC",
  "bugs": {
    "url": ""
  },
  "homepage": "",
  "dependencies": {
    "@k3rn31p4nic/google-translate-api": "github:k3rn31p4nic/google-translate-api",
    "amethyste-api": "github:Androz2091/amethyste-api",
    "ascii-table": "0.0.9",
    "btoa": "^1.2.1",
    "canvas": "^2.6.1",
    "chalk": "^4.1.0",
    "colors-generator": "^0.3.4",
    "cron": "^1.8.2",
    "dblapi.js": "^2.4.1",
    "discord-canvas": "^1.3.2",
    "discord-giveaways": "^4.3.0",
    "discord.js": "^12.5.0",
    "discord.js-collector": "^1.8.2",
    "ejs": "^3.1.5",
    "erela.js": "^2.3.1",
    "erela.js-spotify": "^1.2.0",
    "express": "^4.17.1",
    "express-session": "^1.17.1",
    "figlet": "^1.5.0",
    "i18next": "^19.8.3",
    "i18next-node-fs-backend": "^2.1.3",
    "jsdom": "^16.4.0",
    "lyrics-finder": "^21.4.0",
    "markdown-table": "^2.0.0",
    "md5": "^2.3.0",
    "moment": "^2.29.1",
    "moment-duration-format": "^2.3.2",
    "mongoose": "^5.11.8",
    "ms": "^2.1.3",
    "os": "^0.1.1",
    "reaction-role": "^2.1.6"
  },
  "engines": {
    "node": "^12.x"
  },
  "devDependencies": {
    "eslint": "^7.5.0"
  },
  "eslintConfig": {
    "env": {
      "commonjs": true,
      "es6": true,
      "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
      "ecmaVersion": 2020
    },
    "rules": {
      "prefer-const": [
        "error"
      ],
      "indent": [
        "error",
        "tab"
      ],
      "quotes": [
        "error",
        "double"
      ],
      "semi": [
        "error",
        "always"
      ],
      "linebreak-style": 0,
      "require-atomic-updates": 0
    }
  },
  "eslintIgnore": [
    "dashboard/public"
  ]
}
