# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- [a88034c](https://github.com/wdes/stats/commit/a88034cb00a788955148e051980ea0144ff12eb3) fix: step description and pathToRegexp
- [a1898cd](https://github.com/wdes/stats/commit/a1898cdc38bafc7a15d868cfe5bdfe894da9748a) fix: Database migration
- [928d36c](https://github.com/wdes/stats/commit/928d36c03c9991f10d95f6de3906dc3b203c1b2e) fix: Heroku, install dev-dependencies

### Features

- [c75d83c](https://github.com/wdes/stats/commit/c75d83c4710d5d9bc6078c26c519270ba6d07019) feat: implement DB_*_PORT

### Documentation

- [46b8a22](https://github.com/wdes/stats/commit/46b8a22774c73dac591e505e4204775ca8e0d4a3) docs: Add CHANGELOG.md file

### Others

- [bc76305](https://github.com/wdes/stats/commit/bc76305efd0ab372acd178b1f6ee8f1211e20a43) chore: update dependencies and package-lock.json
- [15a4057](https://github.com/wdes/stats/commit/15a4057bbaf34f63c8a2f33fb64c3164c4bc85ae) chore: update dependencies and package-lock.json
- [8cba1e4](https://github.com/wdes/stats/commit/8cba1e4891672f0d14fbbab1df6a85b0048dbc00) ci: add lock and merge workflows
- [713e36b](https://github.com/wdes/stats/commit/713e36bc5f61bc409bed1ff2fb0cb9a441054bda) ci: Install dev modules after npm ci for Heroku
- [b27869e](https://github.com/wdes/stats/commit/b27869e00e530c1b2d3bfa4e5945c77c0d9f44f4) ci: use npm ci for Heroku build
- [03f4dab](https://github.com/wdes/stats/commit/03f4dab2270b935a3178c7ab17ab2b8605adfcd2) ci: Add node version for cache
- [1848e05](https://github.com/wdes/stats/commit/1848e05ff56384b951948ed43113a9e1e6a6c0a5) chore: upgrade dependencies
- [ea86295](https://github.com/wdes/stats/commit/ea86295698f147677ddd4c5b6135452793123a87) chore: Use new badges
- [bdb061f](https://github.com/wdes/stats/commit/bdb061ff391beade77610797e8842e06169488ab) ci: Move to GitHub actions

## [v2.0.2]

### Added

- [17e4a66](https://github.com/wdes/stats/commit/17e4a66eb25b219867b252cd03e329ceb0f3daad) added: tslint and fixed jshint config and update email port example

### Changed

- [69bb1e6](https://github.com/wdes/stats/commit/69bb1e6fd5925435536ee5ddbcaedcbcd7fbf528) updated: dependencies
- [2464db3](https://github.com/wdes/stats/commit/2464db37efc66c125b86b5bcf502dd12d75cd5f4) updated: dependencies
- [5c75eef](https://github.com/wdes/stats/commit/5c75eef684fcd0d1b5b89641eb1e9fc17be5821f) update: [security] bump lodash from 4.17.11 to 4.17.14
- [f0fec1e](https://github.com/wdes/stats/commit/f0fec1e5e88e9d53760d13d54da6acd34fb729c1) update: dependencies and package-lock.json
- [f8b51af](https://github.com/wdes/stats/commit/f8b51af1692771bc24e9aedcd62803f5f34a8626) updated: tslint config related files

### Fixed

- [3f32878](https://github.com/wdes/stats/commit/3f328789bcfe5b6336d93c723c1402d7b43e8f9b) fix: TS build
- [fa010ae](https://github.com/wdes/stats/commit/fa010aedd049f142f65aba2312ce7edee5bc4b12) fix: bug in new server SMS
- [bd84543](https://github.com/wdes/stats/commit/bd845437dabab873fa9f4c44e740f39ea147616d) fixed: Added back for-of rule

### Improvements

- [132fb6f](https://github.com/wdes/stats/commit/132fb6f8d737caea0c03bebb9cbdb614946ee2bd) style: prettier
- [c1515b3](https://github.com/wdes/stats/commit/c1515b3ac7e805b39e8330ffb876f8e7b4536de7) style: tslint

## [v2.0.1]

### Fixed

- [193c46a](https://github.com/wdes/stats/commit/193c46a6c60c10e4a08ad63821d471107728e09c) fix: migration system
- [5e997a0](https://github.com/wdes/stats/commit/5e997a027ab5bae678a29036d96cb6782d1d7082) fix: Use npm install instead of npm ci
- [b692f61](https://github.com/wdes/stats/commit/b692f618b8e3611b9cd809f323749d6870ebd037) fix: package.json postinstall script
- [7128022](https://github.com/wdes/stats/commit/71280222f1b877f1712cb048670fed8e5e78cfc7) fix: package.json scripts

## [v2.0.0]

### Added

- [f904fb8](https://github.com/wdes/stats/commit/f904fb8def512637917bc83a089297893fbec607) added: Backup data by email
- [5f59cfc](https://github.com/wdes/stats/commit/5f59cfc0cc6cb4e85848858c334328e6f7ff4382) added: Send emails
- [564628e](https://github.com/wdes/stats/commit/564628eb7efb107b70be832ac4992cde1fdb16d0) added: test for logger module
- [0d3f837](https://github.com/wdes/stats/commit/0d3f837956e1d2e99d2bcae637a2c5e842c09af5) added: show tasks state
- [7366c99](https://github.com/wdes/stats/commit/7366c9985e9f433676af57eec8cdfc71d3d370a0) added: links to tasks and return back links
- [b86dbad](https://github.com/wdes/stats/commit/b86dbad692361a338b3800d74e6665037132e031) added: tasks list
- [72ab299](https://github.com/wdes/stats/commit/72ab299c3fc9b89e252e1b3bfc2915721663fce0) added: Unschedule and schedule tasks
- [14b608b](https://github.com/wdes/stats/commit/14b608bfd6310dceb358874a65abd9df8358e782) added: types for tests and fixed main and nyc config in package.json
- [79876aa](https://github.com/wdes/stats/commit/79876aaf778087712b8a23388a0bb5483ea74297) added: types dependencies and some config
- [064aef5](https://github.com/wdes/stats/commit/064aef5b3aa69b6ccc4986197c6b2acf359876d6) added: tsconfig
- [c811c94](https://github.com/wdes/stats/commit/c811c94ea900ae85aeb5a70b4ed3e3e3c48549b7) added: typescript
- [d5c5057](https://github.com/wdes/stats/commit/d5c50579d6a8d0cc525b527f9a1081b142d7c834) added: ts-node
- [e5fce0e](https://github.com/wdes/stats/commit/e5fce0ec0182a68567fbc0954237838688518b43) added: disable/enable a server
- [7b19c36](https://github.com/wdes/stats/commit/7b19c36047b692f10d7eb8294bd9f3c956c5aed5) added: Link to homepage
- [e428e78](https://github.com/wdes/stats/commit/e428e78cce8105f488bedcf9ef5a5ef31ff1503b) added: GitHub auth for admin pages
- [7626f89](https://github.com/wdes/stats/commit/7626f89e92ccf0e342322c471153ee5682911b75) added: ENV variables
- [0d1a595](https://github.com/wdes/stats/commit/0d1a5954793708dd802a512e4f7752971621d70a) add: passport-http dependency
- [0ebf128](https://github.com/wdes/stats/commit/0ebf1280c0e97f59524d8fcc40d6aa43c30dcfd2) added: Add server page
- [00cccf1](https://github.com/wdes/stats/commit/00cccf1985f3701cc2206c65e432ca74a12830bd) added: Administration pages
- [4086ef9](https://github.com/wdes/stats/commit/4086ef91d4e8df6e7a16e930880ba2ebc3b1ecb4) added: emailQueue to .jshintrc and updated index.html
- [80caf26](https://github.com/wdes/stats/commit/80caf26a11d642c422575ff8a7a47037ce6e2bb8) added: .twig to editorconfig
- [9adb198](https://github.com/wdes/stats/commit/9adb1980fa34bcf5392c2994be576dae3449efd8) added: synk and depandabot and changelog-generator-twig
- [a8999ca](https://github.com/wdes/stats/commit/a8999cae3ccbb93e7cf8c2ab1038f5969fa46d44) added: Travis CI & codecov & codacy & some badges
- [4bea5fa](https://github.com/wdes/stats/commit/4bea5fa062efb2aecba750ee7a3b4f1d89ef83f2) added: azure base files
- [fa27e2c](https://github.com/wdes/stats/commit/fa27e2ccf9bcd09e86bf3097a4903b2c4d559280) added: Sentry cli

### Changed

- [d26deae](https://github.com/wdes/stats/commit/d26deae2f25742f4e6f90411105dd951341ace55) updated: sequelize from 5.9.0 to 5.9.2
- [dc7c54d](https://github.com/wdes/stats/commit/dc7c54d1c22db7e0e939e5198cc30512f10febac) updated: Update package and ts config file
- [6821d59](https://github.com/wdes/stats/commit/6821d59b7056d341b6a5ed510d56d580fc985d23) update: dependencies and package-lock.json
- [6271c4e](https://github.com/wdes/stats/commit/6271c4e932ae1eef47574af0eb7a64af509e8452) update: Use passport-github instead of passport-http
- [5cf9ca2](https://github.com/wdes/stats/commit/5cf9ca2b06f651fec83f2180ecd366f279e5c4bc) update: dependencies and package-lock.json
- [5f743b5](https://github.com/wdes/stats/commit/5f743b519b4a6d6eff1f2ab88bb35d9c05093229) update: dependencies and package-lock.json
- [deb06cb](https://github.com/wdes/stats/commit/deb06cba712ee532c3c2096a963c9bbc687c2c27) update: npm dependencies

### Removed

- [303c57b](https://github.com/wdes/stats/commit/303c57b4d4922837bea76216ff52322a82fb04d9) removed: relations between models
- [5f772e4](https://github.com/wdes/stats/commit/5f772e47371144783e95b0651214bb9bc67225a0) removed: Useless alias @templates
- [b9cdc2c](https://github.com/wdes/stats/commit/b9cdc2ca21b79375887e59974079666bf14a99ef) removed: Security middleware on protected pages

### Fixed

- [3c3b77c](https://github.com/wdes/stats/commit/3c3b77c0c3900d0bc45e998f3aa645646b067486) fix: queues and stack
- [70b7b4f](https://github.com/wdes/stats/commit/70b7b4f12e2632afc60d436bd39ec910196c3729) fixed: Task scheduling due to raw=true
- [91e617e](https://github.com/wdes/stats/commit/91e617ea89891cc21467ef2970d5f72f66714648) fixed: style issues and task scheduling for disabled servers
- [4142e2c](https://github.com/wdes/stats/commit/4142e2cafe5cfb53058b482cb21fa137572ae0a7) fix: Security issue on /admin/ route
- [963daab](https://github.com/wdes/stats/commit/963daab46f823709aa9761619a8d26962a779e8e) fix: Routes loading and twig templates
- [fdcb41a](https://github.com/wdes/stats/commit/fdcb41a1d3ddfce1dee4155ff688a5df093d82a4) fix: Show back the server port at boot time
- [05ab15f](https://github.com/wdes/stats/commit/05ab15fcdba366efe16893c7be1dcb54d570e983) fix: loading api endpoints and pages before module resolution
- [16afeec](https://github.com/wdes/stats/commit/16afeec5c9ba9d0a7f1b91d8cc7c3c9f913cce99) fix: revert use dist folder in production mode
- [07410b9](https://github.com/wdes/stats/commit/07410b9b6a67b3d7e733c9d451d236622d298db8) fix: ENV loading issue
- [1e72c07](https://github.com/wdes/stats/commit/1e72c07476d556ddeccf0c27f468c2b62e1305df) fix: tests, move typescript
- [6aadca4](https://github.com/wdes/stats/commit/6aadca4ec1b608df665d547045b739b7f2e08b37) fix: prettier command
- [353cf5c](https://github.com/wdes/stats/commit/353cf5ca2d7280a85fae877d9556d2c42deb556e) fix: migration system
- [3a357dd](https://github.com/wdes/stats/commit/3a357dd6eda05f05e8b19706f5b4e0bd696f5afa) fix: typo
- [b0b4543](https://github.com/wdes/stats/commit/b0b45435e76527365699835b60b39cb493640227) fix: tests and implementations of stack
- [06d1aa4](https://github.com/wdes/stats/commit/06d1aa417482ae175e07a15ce3ea95324468cd2c) fix: titles in html pages
- [ec81f1e](https://github.com/wdes/stats/commit/ec81f1ead89f1bc3c829d15b9da2f67bdcd43ef6) fix: sequelize config
- [6265b6f](https://github.com/wdes/stats/commit/6265b6f7f2e14023f51c86ed521ef5404e878c9a) fix: remove unused code
- [4778550](https://github.com/wdes/stats/commit/4778550a79f7a4c3d0b4123331492e554d85a0b1) fix: tests
- [ad5704a](https://github.com/wdes/stats/commit/ad5704ad4cfa859587d12977fcf8dadea979b03c) fix: node version

### Improvements

- [4d066c6](https://github.com/wdes/stats/commit/4d066c621033dcfcdc12163a61d2ed19600c4f50) improved: rename models and use new TS format
- [410c039](https://github.com/wdes/stats/commit/410c0395d3c1a07aaa0d9fd622f6951741a8fa1e) style: prettier
- [b605a6a](https://github.com/wdes/stats/commit/b605a6a5a33acb7d7e586d902db7ab444acd1822) improved: use arrow functions in some places and add some types
- [f77925b](https://github.com/wdes/stats/commit/f77925b02110fd663d421fb93de366514ed75d6a) improved: worker is disconnected from IPC
- [b795338](https://github.com/wdes/stats/commit/b7953385f9e6ee1bd3edc4bae3ee7b7954a5fe65) improved: Use NextFunction instead of Function
- [3766e50](https://github.com/wdes/stats/commit/3766e50671c000d61e848db9c266cb5f3a9a58ef) improved: enable strict mode on dist files
- [96dbe43](https://github.com/wdes/stats/commit/96dbe434e98226d9b0c2ef5ca00487865e68d6ca) improved: Use dist folder in production mode
- [a8b325e](https://github.com/wdes/stats/commit/a8b325e2dbec09a1fee09a97c6d7e8046675de6d) improved: Travis CI config
- [ba15472](https://github.com/wdes/stats/commit/ba154726c7fc7bf9d1fd6d49cb00079b18960a14) improved: Migrate to typescript
- [07193d6](https://github.com/wdes/stats/commit/07193d632a69fffac7769d7bc6ac4acbc91f2247) improved: rename all .js files to .ts
- [02c79dc](https://github.com/wdes/stats/commit/02c79dc73f53c8e4cfa9c82941169e56bf91ef6f) improved: Only use cloudflare CDN and add materialdesignicons
- [05aa515](https://github.com/wdes/stats/commit/05aa515c748316d05f5ac2c1d09bf8388cd49228) improved: Improved index page and added links
- [e20b17e](https://github.com/wdes/stats/commit/e20b17e70b607f1e4dc61a99dc512ff969170cf0) improved: Add logout route to admin index
- [db94d79](https://github.com/wdes/stats/commit/db94d79541dc02267c752425a73d258416ba3cbf) improved: Moved auth routes to a file and added login page
- [77a4d9a](https://github.com/wdes/stats/commit/77a4d9a50a74f7b8c63daba8c7de0bed359d08d3) improved: Cut into functions the schedule part
- [bb306d8](https://github.com/wdes/stats/commit/bb306d8508b921786f4f19680920a00025d18ea9) improved: moved some code around to enable multiple instances of stack

## [v1.0.0]

### Added

- [18ea9e4](https://github.com/wdes/stats/commit/18ea9e418c2f417b1eb4a0c4f9aed2d52acfdf4b) added: project files


[Unreleased]: https://github.com/wdes/stats/compare/v2.0.2...HEAD
[v2.0.2]: https://github.com/wdes/stats/compare/v2.0.1...v2.0.2
[v2.0.1]: https://github.com/wdes/stats/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/wdes/stats/compare/v1.0.0...v2.0.0
[v1.0.0]: https://github.com/wdes/stats/compare/16179d5a534b34f29915590c8e75579b547ebb4a...v1.0.0

