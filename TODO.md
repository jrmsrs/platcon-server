# todo

## cruds

- [x] implement Users module
  - [x] unit tests
  - [x] e2e tests
- [x] implement Members module
  - [x] unit tests
  - [x] e2e tests
  - [x] Member User OtO relation
- [x] implement Channels module
  - [x] unit tests
  - [x] e2e tests
- [x] implement Contents module\*
  - [x] unit tests
  - [ ] e2e tests\*
  - [x] Content Channel MtO relation
  - [x] Content Body entity
  - [x] Content Body OtM relation

## features

- [ ] implement auth
- [ ] implement data pagination
- [ ] implement roles and permissions
- [ ] refactor cruds

## dev

- [x] decouple error handling from typeorm at the service layer

## infra

- [x] implement swagger autogenerate markdown utility for api docs
  - [x] migrate to v2
  - [x] generate swagger yaml output
  - [x] create script and add to husky
- [x] implement module alias path generator
