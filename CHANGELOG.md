## [0.0.9](https://github.com/Black-Cat-OSS/ava-gen/compare/v0.0.8...v0.0.9) (2025-10-23)

### Features

- Added bakery module
  ([d94bd93](https://github.com/Black-Cat-OSS/ava-gen/commit/d94bd93b6614fc33fa1d8197fdd32593ed0e7c43))
- **api:** Add cache module infrastructure and interfaces
  ([58eadce](https://github.com/Black-Cat-OSS/ava-gen/commit/58eadce9590c85b9c10d25e1927844b425e65a17))
- **api:** Add HTTP caching headers to AvatarController
  ([6db4b38](https://github.com/Black-Cat-OSS/ava-gen/commit/6db4b385d973649a6dcc49533afd9f2cd89e76d6))
- **api:** Add Nginx proxy caching for avatars
  ([473b57f](https://github.com/Black-Cat-OSS/ava-gen/commit/473b57fa9850382746c6d08e4eee6f87c3adc285))
- **api:** Implement Memcached driver
  ([54dfc5f](https://github.com/Black-Cat-OSS/ava-gen/commit/54dfc5ff8382f14f6d81b8748b9d78ec9e65d707))
- **api:** Implement Redis driver with reconnection logic
  ([3236588](https://github.com/Black-Cat-OSS/ava-gen/commit/323658806fd50d9a6b4cd79a7bac1bb44f803707))
- **api:** Integrate cache module with conditional init
  ([86295c6](https://github.com/Black-Cat-OSS/ava-gen/commit/86295c6c72aa1ce282ce321f37b7db2b5ff63b0d))
- **config:** Add cache configuration examples
  ([9b88224](https://github.com/Black-Cat-OSS/ava-gen/commit/9b882244f8eba6276f552e4cfa20f749fbe53dc5))
- Improve logging configuration
  ([8689fd9](https://github.com/Black-Cat-OSS/ava-gen/commit/8689fd9abcbd2494471db84372ac39fbd90a5f0e))
- **ui:** Add overlapping circular avatars to homepage cover
  ([d922852](https://github.com/Black-Cat-OSS/ava-gen/commit/d922852c7710495e124fa05a680966f7569a18fb)),
  closes [#66](https://github.com/Black-Cat-OSS/ava-gen/issues/66)
- **ui:** Updated subtitle on HomePage
  ([8ca89d7](https://github.com/Black-Cat-OSS/ava-gen/commit/8ca89d7c4145b23505ea02fa9f99b2b90f1e62fa))

### Bug Fixes

- **api:** Use correct property name in StorageService cache
  ([f64a403](https://github.com/Black-Cat-OSS/ava-gen/commit/f64a40390ce92912d615b710d12a9a1306d3b9a5))
- **chore:** Changed repo URL in package.json (closes
  [#1](https://github.com/Black-Cat-OSS/ava-gen/issues/1))
  ([a462f5a](https://github.com/Black-Cat-OSS/ava-gen/commit/a462f5af129e20cddc76f9a31eb7681773f2a41d))
- Resolve image loading issue
  ([7994f36](https://github.com/Black-Cat-OSS/ava-gen/commit/7994f361e6ad1988e02e11e9515d56d93fd5ab17))
- **ui:** Fixed refresh button (Closes
  [#65](https://github.com/Black-Cat-OSS/ava-gen/issues/65))
  ([50885ac](https://github.com/Black-Cat-OSS/ava-gen/commit/50885ac81e1237262f20946cb7d19884ff24f6e6))
- **ui:** Fixed theming for preloader
  ([c01da21](https://github.com/Black-Cat-OSS/ava-gen/commit/c01da2119ef2a98da785b39deafeb80408b2e121))

## [0.0.8](https://github.com/Black-Cat-OSS/ava-gen/compare/v0.0.7...v0.0.8) (2025-10-19)

### Features

- Added gradient generation
  ([4b69330](https://github.com/Black-Cat-OSS/ava-gen/commit/4b69330e1d4b3389611ecb1d58b5512db60c42d9)),
  closes [#62](https://github.com/Black-Cat-OSS/ava-gen/issues/62)
- Apply changes from feature branch manually
  ([4603af8](https://github.com/Black-Cat-OSS/ava-gen/commit/4603af8768e11536b06f9ca40774a0c8bc00dfe6))
- Refactor color-palette feature structure
  ([c46811e](https://github.com/Black-Cat-OSS/ava-gen/commit/c46811e1b5ac05b758ceeb9b22d18f736f79d19b))

### Bug Fixes

- Fix negative filter bug (issue
  [#60](https://github.com/Black-Cat-OSS/ava-gen/issues/60))
  ([6e861e8](https://github.com/Black-Cat-OSS/ava-gen/commit/6e861e87946a05a395715b9847e015bd030e1c5e))
- Resolve encoding issues and TypeScript errors
  ([8610419](https://github.com/Black-Cat-OSS/ava-gen/commit/86104197fe2db8ac6421e48fc6bc4d763d513981))
- Restore gradient generator implementation
  ([fd6d7c3](https://github.com/Black-Cat-OSS/ava-gen/commit/fd6d7c3cff17b1d686102cc14c52fd276f18145c))
- Update footer to show current year automatically
  ([dbb3a42](https://github.com/Black-Cat-OSS/ava-gen/commit/dbb3a42448877b771f07a4ef32f24a9b786d5e72))

## [0.0.7](https://github.com/Black-Cat-OSS/ava-gen/compare/v0.0.4...v0.0.7) (2025-10-16)

### Features

- Added automatic changelog generation
  ([7a6e45a](https://github.com/Black-Cat-OSS/ava-gen/commit/7a6e45a3e8414d3b158ea96ccc66e96392c6f420))
- Added third test file for unreleased changelog
  ([3f35f81](https://github.com/Black-Cat-OSS/ava-gen/commit/3f35f81972f079f63541fff63dcb4b1fdf784fe0))

### Bug Fixes

- **ci:** Fixed warning deprecation message
  ([4b48fa0](https://github.com/Black-Cat-OSS/ava-gen/commit/4b48fa0d27174acc2abab9e70da646c2be661134))
- **config:** Added scripts scope
  ([b5d9bd3](https://github.com/Black-Cat-OSS/ava-gen/commit/b5d9bd3d97957dc4330b5e662efe0d4ed425a84c))

## [0.0.4](https://github.com/Black-Cat-OSS/ava-gen/compare/v0.0.3...v0.0.4) (2025-10-15)

### Features

- Added cors integration in app
  ([275f8c8](https://github.com/Black-Cat-OSS/ava-gen/commit/275f8c8f8f2050f1017eb8dc5ea4bad0759a3576))
- Added cors middleware
  ([d6f1e12](https://github.com/Black-Cat-OSS/ava-gen/commit/d6f1e1255ddc497f2268eb68b64c365b412d1434))
- Added new cors configurations
  ([8cf751b](https://github.com/Black-Cat-OSS/ava-gen/commit/8cf751b142c66658fc2a15394913e204566982d1))
- Added second test file for changelog
  ([2427c0b](https://github.com/Black-Cat-OSS/ava-gen/commit/2427c0b24bf146e8980faaf1849a59a9eb5181e4))
- Added test file for changelog generation
  ([d6a89f5](https://github.com/Black-Cat-OSS/ava-gen/commit/d6a89f5e9b15338fb8aa1bddb5396f17d77f154b))

### Bug Fixes

- Build-in files
  ([f40ca42](https://github.com/Black-Cat-OSS/ava-gen/commit/f40ca42457d64433cb56af7d090e1f5007700c8a))
- **db:** Fix generatorType field addition to avatars table
  ([8c70537](https://github.com/Black-Cat-OSS/ava-gen/commit/8c7053797e8b17fb6ccb34c26ce19f4fd216687e))
- Deleted vitest files in src directory
  ([0694782](https://github.com/Black-Cat-OSS/ava-gen/commit/069478213ad9c1326c6571bcee81bf56157bd5b1))
- Fixed build backend app
  ([c51cf63](https://github.com/Black-Cat-OSS/ava-gen/commit/c51cf63cd3a099bcda5919454228b40e34d85507))
- Sync color schemes and field names
  ([95946b3](https://github.com/Black-Cat-OSS/ava-gen/commit/95946b32b1083960835ea17f7a2f8a8ff04e1b5a))
- **ui:** Fix generator selection and seed label
  ([35f8ab2](https://github.com/Black-Cat-OSS/ava-gen/commit/35f8ab29233dd0b90fb5a9e184ffdd3f1790b42d))

## [0.0.3](https://github.com/Black-Cat-OSS/ava-gen/compare/v0.0.2...v0.0.3) (2025-10-15)

### Features

- Add postgresql_params.url support
  ([da28ddc](https://github.com/Black-Cat-OSS/ava-gen/commit/da28ddcc8a8b75ce0b7011e9491c1e90a300357f))
- Add S3 storage support (closes
  [#6](https://github.com/Black-Cat-OSS/ava-gen/issues/6))
  ([a94b8b0](https://github.com/Black-Cat-OSS/ava-gen/commit/a94b8b08627d9ff809d1c7fd1a1368d99607a690))
- Added dev docker-compose for local dev
  ([5d30276](https://github.com/Black-Cat-OSS/ava-gen/commit/5d30276f9ad95bedf794b94fd51077245f487b68))
- Added Dockerfiles to ignore
  ([93c8da2](https://github.com/Black-Cat-OSS/ava-gen/commit/93c8da2c3034bac05cbc22aaafa4a90448ed93dc))
- Added YAML config unit tests
  ([1ba4f4d](https://github.com/Black-Cat-OSS/ava-gen/commit/1ba4f4d2a879bc78bb78e2a0da76c72dbf96459a))
- Chenged error message to Callout component
  ([6b5cfeb](https://github.com/Black-Cat-OSS/ava-gen/commit/6b5cfeb6b24dbb08180c9e9538a5a03041eb5469))
- **ci:** Optimize deploy pipeline
  ([e2082b5](https://github.com/Black-Cat-OSS/ava-gen/commit/e2082b5946ae1a85cff5c0d83af6bc79ac89ab82))
- Complete TypeORM migration and testing system implementation
  ([3c7c56a](https://github.com/Black-Cat-OSS/ava-gen/commit/3c7c56ac8e90b6b1327ae0113c81d43796e5b0a8))
- Configure pino-roll for file logging with rotation
  ([70ed29d](https://github.com/Black-Cat-OSS/ava-gen/commit/70ed29dad3df9a1cd91e693f5260cb5106c442bb))
- Implement GitFlow CI/CD with S3 secrets support
  ([4505554](https://github.com/Black-Cat-OSS/ava-gen/commit/4505554ce5092b10d541bea4aa7d023c352ce6fd)),
  closes [#9](https://github.com/Black-Cat-OSS/ava-gen/issues/9)
- Migrate from Prisma to TypeORM
  ([d3dfda9](https://github.com/Black-Cat-OSS/ava-gen/commit/d3dfda9b144731739641c892a4cf5aeddaf48546)),
  closes [#53](https://github.com/Black-Cat-OSS/ava-gen/issues/53)
- Remove all workflows, but they always come back
  ([90696eb](https://github.com/Black-Cat-OSS/ava-gen/commit/90696eb332f4b225a1758a77420886b9359bef0f))
- Remove settings and docker-composes
  ([c42e1e8](https://github.com/Black-Cat-OSS/ava-gen/commit/c42e1e8b90e573e8ba681e56b567a0af196602e9))

### Bug Fixes

- Add type cast for TypeORM config
  ([9795821](https://github.com/Black-Cat-OSS/ava-gen/commit/979582157553b699e91a23aaf60d192f842aaec1))
- Added integration config to tsconfig
  ([624ee80](https://github.com/Black-Cat-OSS/ava-gen/commit/624ee80adcae1353b6b7d51afe6d9baf0f17d540))
- Added supertest dependency
  ([dc6a527](https://github.com/Black-Cat-OSS/ava-gen/commit/dc6a52760aefb79c5c2728ce0532cf82ae3ce44b))
- **ci:** Create config files before compose
  ([849795e](https://github.com/Black-Cat-OSS/ava-gen/commit/849795eb918ea9071d7fe1d034c1d17baa8f1bf5))
- **ci:** Fix config generation in deploy script
  ([d3a67d4](https://github.com/Black-Cat-OSS/ava-gen/commit/d3a67d4854e4fc24ae6bbd45902c9878485dcefd))
- **ci:** Resolve supertest import and types issues
  ([017125f](https://github.com/Black-Cat-OSS/ava-gen/commit/017125f3ca450336df1659ebb10447a4ee0923ae)),
  closes [#9](https://github.com/Black-Cat-OSS/ava-gen/issues/9)
- **ci:** Resolve supertest import and types issues
  ([6fb4938](https://github.com/Black-Cat-OSS/ava-gen/commit/6fb493861aa722f29e58484283b7067c91dfa6ba)),
  closes [#9](https://github.com/Black-Cat-OSS/ava-gen/issues/9)
- **config:** Add PostgreSQL support with NODE_ENV
  ([7c57dc5](https://github.com/Black-Cat-OSS/ava-gen/commit/7c57dc5250d188fa331f5c06b531c8ac58e48088)),
  closes [#2](https://github.com/Black-Cat-OSS/ava-gen/issues/2)
- Configure production deployment
  ([cd9130b](https://github.com/Black-Cat-OSS/ava-gen/commit/cd9130b3f9652dc19bd1b102c5b79ab43f056a32))
- Create log directories in deploy script
  ([baf9089](https://github.com/Black-Cat-OSS/ava-gen/commit/baf90896426819febc4602af20a422057703cf2b))
- Fixed start.sh to work with prisma-runner.js
  ([4a9115e](https://github.com/Black-Cat-OSS/ava-gen/commit/4a9115ecdb5d2674cf49dc9016918d526fccd89b))
- Pass secrets to SSH session correctly
  ([7aee0f6](https://github.com/Black-Cat-OSS/ava-gen/commit/7aee0f6fbdea79dfe1aa1fff05923ffee82a5dc6))
- PostgreSQL DATABASE_URL issue
  ([1519c2a](https://github.com/Black-Cat-OSS/ava-gen/commit/1519c2a3e5443a8434d9d77c64dac18a670a3ab9))
- Resolve linter and lockfile issues
  ([6503f96](https://github.com/Black-Cat-OSS/ava-gen/commit/6503f9604b388248ba3c73b39a3529933eefa184))
- Resolve pnpm lockfile issues in GitHub Actions
  ([89c891c](https://github.com/Black-Cat-OSS/ava-gen/commit/89c891ce7192ffb51515a34e579b972ea0bde3fb)),
  closes [#9](https://github.com/Black-Cat-OSS/ava-gen/issues/9)
- Restore original Dockerfile
  ([7e04306](https://github.com/Black-Cat-OSS/ava-gen/commit/7e043067ef4708bf0e848f059bf329b43ffa8e2b))
- Support 16x16 avatar size
  ([e495c9f](https://github.com/Black-Cat-OSS/ava-gen/commit/e495c9fe2d9b08427a5ac1a35c718697a4cc30c8)),
  closes [#3](https://github.com/Black-Cat-OSS/ava-gen/issues/3)
- Update Jest CLI options to testPathPatterns
  ([078967b](https://github.com/Black-Cat-OSS/ava-gen/commit/078967bb7b4ef1700ce97e8f17f83d8cbb8865e8))
- Update pnpm version to v10 in GitHub Actions
  ([dda81cf](https://github.com/Black-Cat-OSS/ava-gen/commit/dda81cf064186a3cc79432c6853778d264ec8451)),
  closes [#9](https://github.com/Black-Cat-OSS/ava-gen/issues/9)

## [0.0.2](https://github.com/Black-Cat-OSS/ava-gen/compare/v0.0.1...v0.0.2) (2025-10-15)

### Features

- Add nginx gateway and configure API integration
  ([61599ae](https://github.com/Black-Cat-OSS/ava-gen/commit/61599ae2f14144193e7bd3ab8ed2d5725a08d50a))
- **db:** Add PostgreSQL support with connection retry
  ([4abd882](https://github.com/Black-Cat-OSS/ava-gen/commit/4abd8820e96ba2d880ffde1ed816b650e23899ea))
- Добавил логику с базами данных
  ([229179e](https://github.com/Black-Cat-OSS/ava-gen/commit/229179eec85b2f42ac78dac4ba72ba04e31903df))
- Доработал frontend
  ([1284374](https://github.com/Black-Cat-OSS/ava-gen/commit/128437466c64d3a032acfd5d39841d47127b205a))
- Обновил главную
  ([7a4fd68](https://github.com/Black-Cat-OSS/ava-gen/commit/7a4fd682d5a18f2d30e12e9b482ebed7194e7598))
- Обновлён компонент HeaderDefault
  ([b7213d3](https://github.com/Black-Cat-OSS/ava-gen/commit/b7213d300a9d20ecd843a6346a1ccb5211e3981e))
- Удалил ненужные параметры для swagger
  ([ff420c1](https://github.com/Black-Cat-OSS/ava-gen/commit/ff420c1b766029510e3c9f584bf0a575d71540d4))

### Bug Fixes

- Not working SQLite on backend side
  ([658b43f](https://github.com/Black-Cat-OSS/ava-gen/commit/658b43fc82fe08a94f737311b316b25b004fe1bb))
- Поддержка sqlite в проекте
  ([d19f2b0](https://github.com/Black-Cat-OSS/ava-gen/commit/d19f2b08d3f30107a507f60a6cecd1f232304fec))

## 0.0.1 (2025-09-26)
