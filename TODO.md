# todo

## cruds

- [x] implement Users module
  - [x] implement Users unit tests
  - [x] implement Users e2e tests
- [x] implement Members module
  - [x] implement Members unit tests
  - [x] implement Members e2e tests
  - [x] implement Member User OtO relation
- [x] implement Channels module
  - [x] implement Channels unit tests
  - [x] implement Channels e2e tests
- [x] implement Contents module\*
  - [x] implement Contents unit tests\*
  - [ ] implement Contents e2e tests
  - [x] implement Content Channel MtO relation\*
- [ ] implement ContentBody module
  - [ ] implement ContentBody unit tests
  - [ ] implement ContentBody e2e tests
  - [ ] implement ContentBody Content MtO relation

## features

- [ ] implement auth
  - [ ] unit tests
  - [ ] e2e tests
- [ ] implement roles and permissions
  - [ ] unit tests
  - [ ] e2e tests

## dev

- [x] decouple error handling from typeorm at the service layer

## infra

- [x] implement swagger autogenerate markdown utility for api docs
  - [x] migrate to v2
  - [x] generate swagger yaml output
  - [x] create script and add to husky
- [x] implement module alias path generator
