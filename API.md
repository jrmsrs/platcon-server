# Platcon
A description

## Version: 0.0.1

---
## Members
Rotas Membros

### /members

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Members retrieved successfully | [ [Member](#member) ] |

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| body | body |  | Yes | [CreateMemberDto](#creatememberdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Member created successfully | [Member](#member) |
| 400 | Bad request / invalid input |  |

### /members/{id}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | Member UUID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Member deleted successfully |
| 404 | Member not found |

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | Member UUID | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Member retrieved successfully | [Member](#member) |
| 404 | Member not found |  |

#### PATCH
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | Member UUID | Yes | string |
| body | body |  | Yes | [UpdateMemberDto](#updatememberdto) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Member updated successfully |
| 400 | Bad request / invalid input |
| 404 | Member not found |

---
## Users
Rotas Usuários

### /users

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Users retrieved successfully | [ [User](#user) ] |

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| body | body |  | Yes | [CreateUserDto](#createuserdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | User created successfully | [User](#user) |
| 400 | Bad request / invalid input |  |

### /users/{id}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | User UUID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | User deleted successfully |
| 404 | User not found |

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | User UUID | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | User retrieved successfully | [User](#user) |
| 404 | User not found |  |

#### PATCH
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | User UUID | Yes | string |
| body | body |  | Yes | [UpdateUserDto](#updateuserdto) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | User updated successfully |
| 400 | Bad request / invalid input |
| 404 | User not found |

---
### Models

#### CreateMemberDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string |  | No |
| description | string |  | Yes |
| stage_name | string |  | Yes |
| user_id | string |  | No |
| website | [ string ] |  | No |

#### CreateUserDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string |  | No |
| email | string |  | Yes |
| name | string |  | Yes |
| password | string |  | Yes |

#### Member

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string |  | Yes |
| description | string |  | Yes |
| id | string |  | Yes |
| stage_name | string |  | Yes |
| user_id | string |  | No |
| website | [ string ] |  | No |

#### UpdateMemberDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string |  | No |
| description | string |  | No |
| stage_name | string |  | No |
| user_id | string |  | No |
| website | [ string ] |  | No |

#### UpdateUserDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string |  | No |
| email | string |  | No |
| name | string |  | No |
| password | string |  | No |

#### User

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string |  | No |
| email | string |  | Yes |
| id | string |  | Yes |
| name | string |  | Yes |
| password | string |  | No |
| role | string |  | Yes |
