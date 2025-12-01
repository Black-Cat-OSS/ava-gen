# Changelog

## [Unreleased]

### ✨ Added

#### ui

- **ui:** Integrated Preview
  ([0059abe](https://github.com/Black-Cat-OSS/ava-gen/commit/0059abef095c0f527c153562bec16dcc5ea1772d))
- **ui:** Added AvatarPreview component
  ([b573d5a](https://github.com/Black-Cat-OSS/ava-gen/commit/b573d5a65ff1bb4db08d448c4b56824d4735207d))
- **ui:** Updated title ColorPallete is bold
  ([f626c48](https://github.com/Black-Cat-OSS/ava-gen/commit/f626c486a91c1a179d3b37b7fede323404e25c08))
- **ui:** Added adaptive to AnglePresets
  ([f9df2d1](https://github.com/Black-Cat-OSS/ava-gen/commit/f9df2d1003da80a62fd9cfce790c7b1428363a5d))
- **ui:** Replaced InputField to Textarea
  ([287c71b](https://github.com/Black-Cat-OSS/ava-gen/commit/287c71bb27d2b6aff22220020a80d3f8231efb48))
- **ui:** Added Textarea component
  ([3e88f01](https://github.com/Black-Cat-OSS/ava-gen/commit/3e88f01d23ee1a3994af5719b664cda64db2ec23))
- **ui:** Integrated SeedPhrase component
  ([6431936](https://github.com/Black-Cat-OSS/ava-gen/commit/64319366c8548f909d2f8503b8432cfce4d552fb))
- **ui:** Added display result of generation
  ([f9981a0](https://github.com/Black-Cat-OSS/ava-gen/commit/f9981a0c9e7bbb8690996bd2ce77aa365b421525))

#### ci

- **ci:** Updated Dockerfile and compose
  ([dbb3aa2](https://github.com/Black-Cat-OSS/ava-gen/commit/dbb3aa2179ea8ee64d09c9dedc8e9e7ff5728dfa))

#### i18n

- **i18n:** Added locales for emoji-generator form
  ([7cdf2ca](https://github.com/Black-Cat-OSS/ava-gen/commit/7cdf2ca14033b8042b07bc186cff48bcf835c8fc))
- **i18n:** Updated locales for SeedPhrase
  ([9d18547](https://github.com/Black-Cat-OSS/ava-gen/commit/9d18547c14e94bb239e5045d5cbf0d7f7c7cf2d5))

#### others

- Added prallel generation (Closes #75)
  ([124020e](https://github.com/Black-Cat-OSS/ava-gen/commit/124020eef8f2fbf2d101af84579443a15fe054f5))
- Integrated grafana + prometheus (Closes #85)
  ([f86b9d5](https://github.com/Black-Cat-OSS/ava-gen/commit/f86b9d5e4e65ea29ca1d3feeb8a932cea8f4c920))

#### docs, api

- **docs, api:** Added Swagger generation and route docs (Closes #81)
  ([c79620d](https://github.com/Black-Cat-OSS/ava-gen/commit/c79620d5f198b395e0be4e71d87723b06d759119))

### 🐛 Fixed

#### api

- **api:** Fixed swagger json docs
  ([7d872da](https://github.com/Black-Cat-OSS/ava-gen/commit/7d872dab6145268ddb3f19f203e6d69577bb95f8))
- **api:** Changed length 32 -> 255 in schema
  ([a512c63](https://github.com/Black-Cat-OSS/ava-gen/commit/a512c639b527f9b7c29728038f25b261f80ad53d))
- **api:** Fixed seed phrase generation (Closes #78)
  ([0af23f6](https://github.com/Black-Cat-OSS/ava-gen/commit/0af23f6459e5d06201e035feea8d244cf9283f04))

#### ui

- **ui:** Re-render home page
  ([0777992](https://github.com/Black-Cat-OSS/ava-gen/commit/077799223797d0bfbd07e14cb3ecab56fdb8337e))

#### test

- **test:** Changed length 32 -> 255
  ([e685c41](https://github.com/Black-Cat-OSS/ava-gen/commit/e685c4156e8780187956a3bbd8a55bd5caec534d))

#### ci

- **ci:** Update Dockerfile and source files
  ([d72e5de](https://github.com/Black-Cat-OSS/ava-gen/commit/d72e5dec44af4268d0e7a97567333b1ffac86331))

#### features

- **features:** Restored emoji generator (Closes #80)
  ([e9c7aa9](https://github.com/Black-Cat-OSS/ava-gen/commit/e9c7aa923c10eb4fd45651f9305f4ea6e503b696))

#### others

- Changelog generation script
  ([6655c89](https://github.com/Black-Cat-OSS/ava-gen/commit/6655c897b21580e688f3ab4abdefadfbd36e153b))
- CORS middleware in application
  ([4365fe8](https://github.com/Black-Cat-OSS/ava-gen/commit/4365fe86d949d608d4465f7ffda82d9ab056e3d0))
- Remove emoji from initialization log message
  ([fcbb1fa](https://github.com/Black-Cat-OSS/ava-gen/commit/fcbb1fa084d8cd316d01026eea39d397412d6c67))

### ♻️ Changed

#### api

- **api:** Removed profiles (Closes #82)
  ([bee5c28](https://github.com/Black-Cat-OSS/ava-gen/commit/bee5c2851209adc626f17a304bb16321301ba680))
- **api:** Moved swagger docs generator to module
  ([74e8c34](https://github.com/Black-Cat-OSS/ava-gen/commit/74e8c3471ac1c2ba1b5198db03772654cdaeb666))
- **api:** Updated api paths on frontend
  ([1792762](https://github.com/Black-Cat-OSS/ava-gen/commit/1792762dfba1c36d4debd1bd9d42c9512c3b1f30))
- **api:** Added versioning api
  ([471ae8b](https://github.com/Black-Cat-OSS/ava-gen/commit/471ae8b8910a9183cd9187439b26426b3648c2bc))

#### ui

- **ui:** Removed unused imports
  ([a19a2e4](https://github.com/Black-Cat-OSS/ava-gen/commit/a19a2e495907fa072c58d139af8ba3640997ac6e))
- **ui:** Replaced buttons to Tab component
  ([7b2c131](https://github.com/Black-Cat-OSS/ava-gen/commit/7b2c1310f908b16d914bc5e25bf6eca217c7ecf7))
- **ui:** Removed useless blocks
  ([0476ff6](https://github.com/Black-Cat-OSS/ava-gen/commit/0476ff69d9f168020cca076bb75cc972b6effd9f))
- **ui:** Changed length seed phrase to 255 chars
  ([48c6dbd](https://github.com/Black-Cat-OSS/ava-gen/commit/48c6dbd66fdfd12f2c67408bd56d41688e61fab2))
- **ui:** Moved use-seed-generator to features/seed-phrase
  ([39ef855](https://github.com/Black-Cat-OSS/ava-gen/commit/39ef855c56b976a2923215853e0b1f08e0e347db))
- **ui:** Replaced useSeedGenerator fetch to react-query
  ([7d3770f](https://github.com/Black-Cat-OSS/ava-gen/commit/7d3770fff336d135063765fb679d52ba8cecce6b))
- **ui:** Updated display copy link feature
  ([ae684b0](https://github.com/Black-Cat-OSS/ava-gen/commit/ae684b0c2940504b3f021a01fab399c16f7b637f))

#### types

- **types:** Deleted spaces and no more...
  ([86f87c5](https://github.com/Black-Cat-OSS/ava-gen/commit/86f87c521adc7103757296dd3ab6c308b9941251))

#### utils

- **utils:** Moderned hook useGenerateAvatar
  ([d3a6c60](https://github.com/Black-Cat-OSS/ava-gen/commit/d3a6c603f8e4958b02642e502175471aa347de5a))

### ⚠️ Deprecated

#### ui

- **ui:** Component BackgroundTypeSelector
  ([b744de2](https://github.com/Black-Cat-OSS/ava-gen/commit/b744de2e13bd9de4d08005c377b6da56fb0b06ba))
- **ui:** Component EmojiSizeSelector
  ([eb957b2](https://github.com/Black-Cat-OSS/ava-gen/commit/eb957b2f727af0085898ac9be04957afaa903ca0))

### 🔧 Chore

#### api

- **api:** Added static directory to Dockerfile
  ([9203ce3](https://github.com/Black-Cat-OSS/ava-gen/commit/9203ce356977edd7918a5aea19db688c4a13702d))

#### others

- Separate infrastructure and monitoring
  ([fde7bfa](https://github.com/Black-Cat-OSS/ava-gen/commit/fde7bfae66b42fd300476de6da43b897238aaaab))
- Update launch configuration for debugging
  ([6bc22ea](https://github.com/Black-Cat-OSS/ava-gen/commit/6bc22ea95f8d2c12ba41c7ee623956f7bd4c26a9))
- Update .gitignore to include reports directory
  ([4d1dac5](https://github.com/Black-Cat-OSS/ava-gen/commit/4d1dac5b16ff93132e595e47ebc57aa5a4291d26))
- Added deprecated type commit
  ([6044e94](https://github.com/Black-Cat-OSS/ava-gen/commit/6044e9412d2d013f71216723a71f90fccfe9bed8))
- Release version 0.0.10
  ([0c88077](https://github.com/Black-Cat-OSS/ava-gen/commit/0c88077151437bfe1bdfbbdc02f8b9b8cef62afb))

## [0.0.10] - 2025-11-04

### ✨ Added

#### ui

- **ui:** Added Separator component
  ([a2d7fe8](https://github.com/Black-Cat-OSS/ava-gen/commit/a2d7fe83652d2ea8344c974d66e9b179953db194))
- **ui:** Added useAvatarsSuspense
  ([4be46de](https://github.com/Black-Cat-OSS/ava-gen/commit/4be46de73388aa2f9c7874e41f6dea260b9e8206))
- **ui:** Added Card component
  ([b08b118](https://github.com/Black-Cat-OSS/ava-gen/commit/b08b118916abd1b5afb3b772cff7310355876d84))
- **ui:** Added Tabs component
  ([b50d3fb](https://github.com/Black-Cat-OSS/ava-gen/commit/b50d3fb5c586d6a07209bd0769445a202554c440))
- **ui:** Add theming to switch component
  ([f587c87](https://github.com/Black-Cat-OSS/ava-gen/commit/f587c87c0fece3e07a30f56e86c55432181a8437))
- **ui:** Add switch component
  ([dbc3556](https://github.com/Black-Cat-OSS/ava-gen/commit/dbc3556bf87f2da2049a161a7ea07b7a9fca99d5))

#### i18n

- **i18n:** Added translates to color-preview feature
  ([0d0bae3](https://github.com/Black-Cat-OSS/ava-gen/commit/0d0bae3e4dc39638db4d7985e93c5a27be9cf392))

#### others

- Added use-generator.ts
  ([7894c65](https://github.com/Black-Cat-OSS/ava-gen/commit/7894c65a0e2fb9fe077f10efe9f6810c2afb158b))
- Added i18n plugin autogenerator (Closes #77)
  ([0df9cfe](https://github.com/Black-Cat-OSS/ava-gen/commit/0df9cfe1445044b5cb3bfd60d258610afe237203))
- Modify theme for vscode/cursor
  ([3e7a483](https://github.com/Black-Cat-OSS/ava-gen/commit/3e7a4831a68e54232ef90b60fc3a6239f3fe93a9))
- Add endpoint to get avatar by ID
  ([996d060](https://github.com/Black-Cat-OSS/ava-gen/commit/996d060ef30a9803fa50aa65c5635b6c8df9f4de))
- Add emoji avatar preview and generation state
  ([a16010f](https://github.com/Black-Cat-OSS/ava-gen/commit/a16010f880201ee4bcdb13f2cfee22251db34904))
- Add emoji module and avatar integration
  ([a3aa5de](https://github.com/Black-Cat-OSS/ava-gen/commit/a3aa5defff07c61fd7eeb1b82b1a262a4942e693))
- Use callout for emoji service health check
  ([727e74c](https://github.com/Black-Cat-OSS/ava-gen/commit/727e74c154e9997d212772f72f94c08bf33421e1))
- Implement avatar link copy feature (Closes #70)
  ([31d9cac](https://github.com/Black-Cat-OSS/ava-gen/commit/31d9cacdd973d811b5a670c820d378f8460a34c9))
- Add avatar preview showcase feature (Closes #67)
  ([c7ee0bd](https://github.com/Black-Cat-OSS/ava-gen/commit/c7ee0bd76f7e2be6e91d89a93dcafb646fc7b791))

### 🐛 Fixed

#### ui

- **ui:** Fixed switcher on avatar-generator page
  ([b4f0f2d](https://github.com/Black-Cat-OSS/ava-gen/commit/b4f0f2d180e04d1312defd73f1ced8d67306bc5f))
- **ui:** Fix imports
  ([53d3798](https://github.com/Black-Cat-OSS/ava-gen/commit/53d379843d5cbfb4ff50b56096fc69ce85958856))

#### others

- Fix namespace in preview showcase
  ([56f20d5](https://github.com/Black-Cat-OSS/ava-gen/commit/56f20d50944f9317ed8271d206fba1b0ad7b90b9))
- Restore working avatar viewer
  ([8736245](https://github.com/Black-Cat-OSS/ava-gen/commit/87362450a5f17027f0040ca1e214bc7292081172))
- Use avatar list with proper limit
  ([193f6fb](https://github.com/Black-Cat-OSS/ava-gen/commit/193f6fbdc16af3a3be91d331f9019c559ea6e6c4))
- Restore metadata endpoint support
  ([5455fcb](https://github.com/Black-Cat-OSS/ava-gen/commit/5455fcb21c65d574b697d034306f77226f157db5))
- Increase avatar list limit in viewer
  ([82d8693](https://github.com/Black-Cat-OSS/ava-gen/commit/82d8693abc923270bbcde723809a6a636a7b72fe))
- Improve emoji validation and code point handling
  ([1eaef30](https://github.com/Black-Cat-OSS/ava-gen/commit/1eaef306683aff99df11e585d570e1a8c086b124))
- Fix color palletes (Closes #71)
  ([b02d691](https://github.com/Black-Cat-OSS/ava-gen/commit/b02d6910f2a88bb4eb580d7e3c7f30a0f5f6a47b))

### ♻️ Changed

#### ui

- **ui:** Decomposite avatar-form creation
  ([bdf33df](https://github.com/Black-Cat-OSS/ava-gen/commit/bdf33df4c17f3283d0667fd5d9653042646ef073))

#### others

- Renamed BaseGenerateParams to IColorScheme
  ([cdd6c15](https://github.com/Black-Cat-OSS/ava-gen/commit/cdd6c15d5d462311c90a1a515a50b7db6cbcead0))
- Removed use-generate-avatar.ts
  ([83f96ea](https://github.com/Black-Cat-OSS/ava-gen/commit/83f96eabdfae7b76bbf910a1c18d5891120620f0))
- Reuse existing GET /api/:id endpoint
  ([dd9e587](https://github.com/Black-Cat-OSS/ava-gen/commit/dd9e5879dead1499c6263780e0ad3e13375f595e))
- Remove live preview from emoji form
  ([e32b79a](https://github.com/Black-Cat-OSS/ava-gen/commit/e32b79ae5d9fa5af47b8b07d22037f5d12256223))

### ⏪ Reverted

#### others

- Remove metadata endpoint changes
  ([f6c045b](https://github.com/Black-Cat-OSS/ava-gen/commit/f6c045b7ed52ca4e7875d944472b966287839714))

## [0.0.9] - 2025-10-24

### ✨ Added

#### api

- **api:** Add Nginx proxy caching for avatars
  ([473b57f](https://github.com/Black-Cat-OSS/ava-gen/commit/473b57fa9850382746c6d08e4eee6f87c3adc285))
- **api:** Add HTTP caching headers to AvatarController
  ([6db4b38](https://github.com/Black-Cat-OSS/ava-gen/commit/6db4b385d973649a6dcc49533afd9f2cd89e76d6))
- **api:** Integrate cache module with conditional init
  ([86295c6](https://github.com/Black-Cat-OSS/ava-gen/commit/86295c6c72aa1ce282ce321f37b7db2b5ff63b0d))
- **api:** Implement Memcached driver
  ([54dfc5f](https://github.com/Black-Cat-OSS/ava-gen/commit/54dfc5ff8382f14f6d81b8748b9d78ec9e65d707))
- **api:** Implement Redis driver with reconnection logic
  ([3236588](https://github.com/Black-Cat-OSS/ava-gen/commit/323658806fd50d9a6b4cd79a7bac1bb44f803707))
- **api:** Add cache module infrastructure and interfaces
  ([58eadce](https://github.com/Black-Cat-OSS/ava-gen/commit/58eadce9590c85b9c10d25e1927844b425e65a17))

#### ui

- **ui:** Updated subtitle on HomePage
  ([8ca89d7](https://github.com/Black-Cat-OSS/ava-gen/commit/8ca89d7c4145b23505ea02fa9f99b2b90f1e62fa))
- **ui:** Add overlapping circular avatars to homepage cover
  ([d922852](https://github.com/Black-Cat-OSS/ava-gen/commit/d922852c7710495e124fa05a680966f7569a18fb))

#### config

- **config:** Add cache configuration examples
  ([9b88224](https://github.com/Black-Cat-OSS/ava-gen/commit/9b882244f8eba6276f552e4cfa20f749fbe53dc5))

#### others

- Improve logging configuration
  ([8689fd9](https://github.com/Black-Cat-OSS/ava-gen/commit/8689fd9abcbd2494471db84372ac39fbd90a5f0e))
- Added bakery module
  ([d94bd93](https://github.com/Black-Cat-OSS/ava-gen/commit/d94bd93b6614fc33fa1d8197fdd32593ed0e7c43))

### 🐛 Fixed

#### api

- **api:** Use correct property name in StorageService cache
  ([f64a403](https://github.com/Black-Cat-OSS/ava-gen/commit/f64a40390ce92912d615b710d12a9a1306d3b9a5))

#### ui

- **ui:** Fixed theming for preloader
  ([c01da21](https://github.com/Black-Cat-OSS/ava-gen/commit/c01da2119ef2a98da785b39deafeb80408b2e121))
- **ui:** Fixed refresh button (Closes #65)
  ([50885ac](https://github.com/Black-Cat-OSS/ava-gen/commit/50885ac81e1237262f20946cb7d19884ff24f6e6))

#### chore

- **chore:** Changed repo URL in package.json (closes #1)
  ([a462f5a](https://github.com/Black-Cat-OSS/ava-gen/commit/a462f5af129e20cddc76f9a31eb7681773f2a41d))

#### others

- Resolve image loading issue
  ([7994f36](https://github.com/Black-Cat-OSS/ava-gen/commit/7994f361e6ad1988e02e11e9515d56d93fd5ab17))

### 📝 Documentation

#### api

- **api:** Add comprehensive cache module documentation
  ([793b626](https://github.com/Black-Cat-OSS/ava-gen/commit/793b62686ce1c074e8d4f2ec58384f305e8689a6))

### 🧪 Testing

#### api

- **api:** Add comprehensive unit and integration tests
  ([3893f6d](https://github.com/Black-Cat-OSS/ava-gen/commit/3893f6db6dae97c88ff30e44205a95b346824bfa))

### 🔧 Chore

#### others

- Release version 0.0.9
  ([072f0f5](https://github.com/Black-Cat-OSS/ava-gen/commit/072f0f53fdf4fb6ad7e4a63afd1dfbeba22719f9))
- Release version 0.0.9
  ([9e110b9](https://github.com/Black-Cat-OSS/ava-gen/commit/9e110b9976a54677ef9729d7d6a57868e7d3bbb9))

## [0.0.8] - 2025-10-20

### ✨ Added

#### others

- Added gradient generation
  ([4b69330](https://github.com/Black-Cat-OSS/ava-gen/commit/4b69330e1d4b3389611ecb1d58b5512db60c42d9))
- Apply changes from feature branch manually
  ([4603af8](https://github.com/Black-Cat-OSS/ava-gen/commit/4603af8768e11536b06f9ca40774a0c8bc00dfe6))
- Refactor color-palette feature structure
  ([c46811e](https://github.com/Black-Cat-OSS/ava-gen/commit/c46811e1b5ac05b758ceeb9b22d18f736f79d19b))

### 🐛 Fixed

#### others

- Update footer to show current year automatically
  ([dbb3a42](https://github.com/Black-Cat-OSS/ava-gen/commit/dbb3a42448877b771f07a4ef32f24a9b786d5e72))
- Restore gradient generator implementation
  ([fd6d7c3](https://github.com/Black-Cat-OSS/ava-gen/commit/fd6d7c3cff17b1d686102cc14c52fd276f18145c))
- Resolve encoding issues and TypeScript errors
  ([8610419](https://github.com/Black-Cat-OSS/ava-gen/commit/86104197fe2db8ac6421e48fc6bc4d763d513981))
- Fix negative filter bug (issue #60)
  ([6e861e8](https://github.com/Black-Cat-OSS/ava-gen/commit/6e861e87946a05a395715b9847e015bd030e1c5e))

### 🔧 Chore

#### others

- Release version 0.0.7
  ([85acd70](https://github.com/Black-Cat-OSS/ava-gen/commit/85acd7028cccdad15194a0dd02f5bdb617e53aa5))

## [0.0.7] - 2025-10-16

### ✨ Added

#### others

- Added automatic changelog generation
  ([7a6e45a](https://github.com/Black-Cat-OSS/ava-gen/commit/7a6e45a3e8414d3b158ea96ccc66e96392c6f420))
- Added third test file for unreleased changelog
  ([3f35f81](https://github.com/Black-Cat-OSS/ava-gen/commit/3f35f81972f079f63541fff63dcb4b1fdf784fe0))

### 🐛 Fixed

#### config

- **config:** Added scripts scope
  ([b5d9bd3](https://github.com/Black-Cat-OSS/ava-gen/commit/b5d9bd3d97957dc4330b5e662efe0d4ed425a84c))

#### ci

- **ci:** Fixed warning deprecation message
  ([4b48fa0](https://github.com/Black-Cat-OSS/ava-gen/commit/4b48fa0d27174acc2abab9e70da646c2be661134))

### ♻️ Changed

#### scripts

- **scripts:** Deleted unused scripts
  ([2879843](https://github.com/Black-Cat-OSS/ava-gen/commit/2879843142e6dc06f2f0d13da6d8cf39425b7a32))

#### others

- Deleted tests files for test changelog generator
  ([b6178ea](https://github.com/Black-Cat-OSS/ava-gen/commit/b6178eabd739903bc49d7c7099e445de844a05af))

### 📝 Documentation

#### others

- Updated docs
  ([0314518](https://github.com/Black-Cat-OSS/ava-gen/commit/0314518703054a97cab3e26c72a7ac3890c1e204))
- Updated project documentation
  ([77aa9f8](https://github.com/Black-Cat-OSS/ava-gen/commit/77aa9f85f72fc6f6f9629b185ad27c1dcada9ef4))

### 🔧 Chore

#### config

- **config:** Added reports directory to gitignore for Cursor AI
  ([e8668e3](https://github.com/Black-Cat-OSS/ava-gen/commit/e8668e39ac848fd551a55ad227f8ff1828dc8002))

## [0.0.4] - 2025-10-16

### ✨ Added

#### others

- Added second test file for changelog
  ([2427c0b](https://github.com/Black-Cat-OSS/ava-gen/commit/2427c0b24bf146e8980faaf1849a59a9eb5181e4))
- Added test file for changelog generation
  ([d6a89f5](https://github.com/Black-Cat-OSS/ava-gen/commit/d6a89f5e9b15338fb8aa1bddb5396f17d77f154b))
- Added cors integration in app
  ([275f8c8](https://github.com/Black-Cat-OSS/ava-gen/commit/275f8c8f8f2050f1017eb8dc5ea4bad0759a3576))
- Added new cors configurations
  ([8cf751b](https://github.com/Black-Cat-OSS/ava-gen/commit/8cf751b142c66658fc2a15394913e204566982d1))
- Added cors middleware
  ([d6f1e12](https://github.com/Black-Cat-OSS/ava-gen/commit/d6f1e1255ddc497f2268eb68b64c365b412d1434))

### 🐛 Fixed

#### ui

- **ui:** Fix generator selection and seed label
  ([35f8ab2](https://github.com/Black-Cat-OSS/ava-gen/commit/35f8ab29233dd0b90fb5a9e184ffdd3f1790b42d))

#### db

- **db:** Fix generatorType field addition to avatars table
  ([8c70537](https://github.com/Black-Cat-OSS/ava-gen/commit/8c7053797e8b17fb6ccb34c26ce19f4fd216687e))

#### others

- Fixed build backend app
  ([c51cf63](https://github.com/Black-Cat-OSS/ava-gen/commit/c51cf63cd3a099bcda5919454228b40e34d85507))
- Build-in files
  ([f40ca42](https://github.com/Black-Cat-OSS/ava-gen/commit/f40ca42457d64433cb56af7d090e1f5007700c8a))
- Deleted vitest files in src directory
  ([0694782](https://github.com/Black-Cat-OSS/ava-gen/commit/069478213ad9c1326c6571bcee81bf56157bd5b1))
- Sync color schemes and field names
  ([95946b3](https://github.com/Black-Cat-OSS/ava-gen/commit/95946b32b1083960835ea17f7a2f8a8ff04e1b5a))

### 📝 Documentation

#### changelog

- **changelog:** Update CHANGELOG.md
  ([6c9cef2](https://github.com/Black-Cat-OSS/ava-gen/commit/6c9cef2b2e05e36a080dd5aaf67c2b31c229571f))

### 🏗️ Build

#### others

- Disable tsbuildinfo file generation
  ([768c88b](https://github.com/Black-Cat-OSS/ava-gen/commit/768c88b4b6a1538acc4d5416706bca3d09c9aa5d))

### 🔧 Chore

#### others

- Added new profile only-cloud
  ([4bb577a](https://github.com/Black-Cat-OSS/ava-gen/commit/4bb577ae998c24e17ce5f7089b3d1a059a67e1cd))

## [0.0.3] - 2025-10-14

### ✨ Added

#### ci

- **ci:** Optimize deploy pipeline
  ([e2082b5](https://github.com/Black-Cat-OSS/ava-gen/commit/e2082b5946ae1a85cff5c0d83af6bc79ac89ab82))

#### others

- Remove settings and docker-composes
  ([c42e1e8](https://github.com/Black-Cat-OSS/ava-gen/commit/c42e1e8b90e573e8ba681e56b567a0af196602e9))
- Remove all workflows, but they always come back
  ([90696eb](https://github.com/Black-Cat-OSS/ava-gen/commit/90696eb332f4b225a1758a77420886b9359bef0f))
- Added YAML config unit tests
  ([1ba4f4d](https://github.com/Black-Cat-OSS/ava-gen/commit/1ba4f4d2a879bc78bb78e2a0da76c72dbf96459a))
- Added Dockerfiles to ignore
  ([93c8da2](https://github.com/Black-Cat-OSS/ava-gen/commit/93c8da2c3034bac05cbc22aaafa4a90448ed93dc))
- Added dev docker-compose for local dev
  ([5d30276](https://github.com/Black-Cat-OSS/ava-gen/commit/5d30276f9ad95bedf794b94fd51077245f487b68))
- Chenged error message to Callout component
  ([6b5cfeb](https://github.com/Black-Cat-OSS/ava-gen/commit/6b5cfeb6b24dbb08180c9e9538a5a03041eb5469))
- Complete TypeORM migration and testing system implementation
  ([3c7c56a](https://github.com/Black-Cat-OSS/ava-gen/commit/3c7c56ac8e90b6b1327ae0113c81d43796e5b0a8))
- Migrate from Prisma to TypeORM
  ([d3dfda9](https://github.com/Black-Cat-OSS/ava-gen/commit/d3dfda9b144731739641c892a4cf5aeddaf48546))
- Add postgresql_params.url support
  ([da28ddc](https://github.com/Black-Cat-OSS/ava-gen/commit/da28ddcc8a8b75ce0b7011e9491c1e90a300357f))
- Configure pino-roll for file logging with rotation
  ([70ed29d](https://github.com/Black-Cat-OSS/ava-gen/commit/70ed29dad3df9a1cd91e693f5260cb5106c442bb))
- Implement GitFlow CI/CD with S3 secrets support
  ([4505554](https://github.com/Black-Cat-OSS/ava-gen/commit/4505554ce5092b10d541bea4aa7d023c352ce6fd))
- Add S3 storage support (closes #6)
  ([a94b8b0](https://github.com/Black-Cat-OSS/ava-gen/commit/a94b8b08627d9ff809d1c7fd1a1368d99607a690))

### 🐛 Fixed

#### config

- **config:** Add PostgreSQL support with NODE_ENV
  ([7c57dc5](https://github.com/Black-Cat-OSS/ava-gen/commit/7c57dc5250d188fa331f5c06b531c8ac58e48088))

#### ci

- **ci:** Fix config generation in deploy script
  ([d3a67d4](https://github.com/Black-Cat-OSS/ava-gen/commit/d3a67d4854e4fc24ae6bbd45902c9878485dcefd))
- **ci:** Create config files before compose
  ([849795e](https://github.com/Black-Cat-OSS/ava-gen/commit/849795eb918ea9071d7fe1d034c1d17baa8f1bf5))
- **ci:** Resolve supertest import and types issues
  ([017125f](https://github.com/Black-Cat-OSS/ava-gen/commit/017125f3ca450336df1659ebb10447a4ee0923ae))
- **ci:** Resolve supertest import and types issues
  ([6fb4938](https://github.com/Black-Cat-OSS/ava-gen/commit/6fb493861aa722f29e58484283b7067c91dfa6ba))

#### others

- Restore original Dockerfile
  ([7e04306](https://github.com/Black-Cat-OSS/ava-gen/commit/7e043067ef4708bf0e848f059bf329b43ffa8e2b))
- Added integration config to tsconfig
  ([624ee80](https://github.com/Black-Cat-OSS/ava-gen/commit/624ee80adcae1353b6b7d51afe6d9baf0f17d540))
- Add type cast for TypeORM config
  ([9795821](https://github.com/Black-Cat-OSS/ava-gen/commit/979582157553b699e91a23aaf60d192f842aaec1))
- Update Jest CLI options to testPathPatterns
  ([078967b](https://github.com/Black-Cat-OSS/ava-gen/commit/078967bb7b4ef1700ce97e8f17f83d8cbb8865e8))
- Resolve linter and lockfile issues
  ([6503f96](https://github.com/Black-Cat-OSS/ava-gen/commit/6503f9604b388248ba3c73b39a3529933eefa184))
- Fixed start.sh to work with prisma-runner.js
  ([4a9115e](https://github.com/Black-Cat-OSS/ava-gen/commit/4a9115ecdb5d2674cf49dc9016918d526fccd89b))
- PostgreSQL DATABASE_URL issue
  ([1519c2a](https://github.com/Black-Cat-OSS/ava-gen/commit/1519c2a3e5443a8434d9d77c64dac18a670a3ab9))
- Create log directories in deploy script
  ([baf9089](https://github.com/Black-Cat-OSS/ava-gen/commit/baf90896426819febc4602af20a422057703cf2b))
- Pass secrets to SSH session correctly
  ([7aee0f6](https://github.com/Black-Cat-OSS/ava-gen/commit/7aee0f6fbdea79dfe1aa1fff05923ffee82a5dc6))
- Configure production deployment
  ([cd9130b](https://github.com/Black-Cat-OSS/ava-gen/commit/cd9130b3f9652dc19bd1b102c5b79ab43f056a32))
- Added supertest dependency
  ([dc6a527](https://github.com/Black-Cat-OSS/ava-gen/commit/dc6a52760aefb79c5c2728ce0532cf82ae3ce44b))
- Update pnpm version to v10 in GitHub Actions
  ([dda81cf](https://github.com/Black-Cat-OSS/ava-gen/commit/dda81cf064186a3cc79432c6853778d264ec8451))
- Resolve pnpm lockfile issues in GitHub Actions
  ([89c891c](https://github.com/Black-Cat-OSS/ava-gen/commit/89c891ce7192ffb51515a34e579b972ea0bde3fb))
- Support 16x16 avatar size
  ([e495c9f](https://github.com/Black-Cat-OSS/ava-gen/commit/e495c9fe2d9b08427a5ac1a35c718697a4cc30c8))

### ♻️ Changed

#### others

- Changed configuration implementation
  ([8f968af](https://github.com/Black-Cat-OSS/ava-gen/commit/8f968af1470581ac0143efde9c8630c33b619614))
- Added netwok schema and separate it
  ([61c9995](https://github.com/Black-Cat-OSS/ava-gen/commit/61c9995942427e4f397cecc72d6d86647af837ea))
- Make shortly Dockerfile for backend
  ([fb573ac](https://github.com/Black-Cat-OSS/ava-gen/commit/fb573ac43c606a3e6228865a441ebff8fb16c3c4))
- Move Input component to InputField
  ([2df1661](https://github.com/Black-Cat-OSS/ava-gen/commit/2df1661cea24ee958ab1ebb9e9d1653d04e069cc))
- Deleted unused docker configs
  ([f916f41](https://github.com/Black-Cat-OSS/ava-gen/commit/f916f418ef249a30075d8eec5e4451c3efc23f1f))

### 📝 Documentation

#### changelog

- **changelog:** Updated CHANGELOG.md
  ([4aa8489](https://github.com/Black-Cat-OSS/ava-gen/commit/4aa8489092b40b636fedc69dc4da82decba183b3))
- **changelog:** Update CHANGELOG.md
  ([b196ad9](https://github.com/Black-Cat-OSS/ava-gen/commit/b196ad994892162396fb99a9db424845429bc1c4))
- **changelog:** Updated CHANGELOG.md
  ([22f567a](https://github.com/Black-Cat-OSS/ava-gen/commit/22f567a583013f4ba603d71d96648a0616963453))

#### others

- Updated changelog for v.0.0.3
  ([771372b](https://github.com/Black-Cat-OSS/ava-gen/commit/771372befaf2f8b5d92f3b8d58bfdfd6ad2714f9))
- Add E2E test profiles and update report
  ([7112665](https://github.com/Black-Cat-OSS/ava-gen/commit/711266531cd04de094ffdf4cadc6c97f60a6ddc0))
- Update production deployment documentation
  ([401831a](https://github.com/Black-Cat-OSS/ava-gen/commit/401831ab2aec649e528f2598c4ef6181c1181824))
- Add screenshots section to README
  ([25a27da](https://github.com/Black-Cat-OSS/ava-gen/commit/25a27dae9d0e0068053b95a87ac15dab6c061f8d))

### 🔧 Chore

#### others

- Disabled all workfolws
  ([3cb1bdb](https://github.com/Black-Cat-OSS/ava-gen/commit/3cb1bdb097cfe6d9bc7ceaeb36ad9087698e1832))
- Actual docker files
  ([9628d7f](https://github.com/Black-Cat-OSS/ava-gen/commit/9628d7fc9a572836ee782448cb47ea8e1d44ebd5))

## [0.0.2] - 2025-10-03

### ✨ Added

#### db

- **db:** Add PostgreSQL support with connection retry
  ([4abd882](https://github.com/Black-Cat-OSS/ava-gen/commit/4abd8820e96ba2d880ffde1ed816b650e23899ea))

#### others

- Add nginx gateway and configure API integration
  ([61599ae](https://github.com/Black-Cat-OSS/ava-gen/commit/61599ae2f14144193e7bd3ab8ed2d5725a08d50a))
- Добавил логику с базами данных
  ([229179e](https://github.com/Black-Cat-OSS/ava-gen/commit/229179eec85b2f42ac78dac4ba72ba04e31903df))
- Удалил ненужные параметры для swagger
  ([ff420c1](https://github.com/Black-Cat-OSS/ava-gen/commit/ff420c1b766029510e3c9f584bf0a575d71540d4))
- Доработал frontend
  ([1284374](https://github.com/Black-Cat-OSS/ava-gen/commit/128437466c64d3a032acfd5d39841d47127b205a))
- Обновил главную
  ([7a4fd68](https://github.com/Black-Cat-OSS/ava-gen/commit/7a4fd682d5a18f2d30e12e9b482ebed7194e7598))
- Обновлён компонент HeaderDefault
  ([b7213d3](https://github.com/Black-Cat-OSS/ava-gen/commit/b7213d300a9d20ecd843a6346a1ccb5211e3981e))

### 🐛 Fixed

#### others

- Поддержка sqlite в проекте
  ([d19f2b0](https://github.com/Black-Cat-OSS/ava-gen/commit/d19f2b08d3f30107a507f60a6cecd1f232304fec))
- Not working SQLite on backend side
  ([658b43f](https://github.com/Black-Cat-OSS/ava-gen/commit/658b43fc82fe08a94f737311b316b25b004fe1bb))

### ♻️ Changed

#### db

- **db:** Remove DB switching scripts, use YAML config only
  ([528e932](https://github.com/Black-Cat-OSS/ava-gen/commit/528e9320e125b0f5b3eacf477e28efddc65ddc47))

#### others

- Вынес и отделил смысловые модули
  ([10faf09](https://github.com/Black-Cat-OSS/ava-gen/commit/10faf09bdce8442836cab4b9e20ffb4c2913cc13))

### 🔧 Chore

#### others

- Добавлен frontend - Добавлены настройки commitlint - Добавлены настройки
  prettier - Добавлен CONTRIBUTING.md - Обновлён LICENSE - Доработана структура
  проекта - Обновлён пакет eslint для backend - Доработаны конфиги
  ([fd36885](https://github.com/Black-Cat-OSS/ava-gen/commit/fd36885d7af7c25864a9faec1838ec0fbc5add8a))

## [0.0.1] - 2025-09-26

### 📌 See Also

- init
  ([a779a44](https://github.com/Black-Cat-OSS/ava-gen/commit/a779a4456a8835018ab8dc1b7e02c6bbff35bfbe))
