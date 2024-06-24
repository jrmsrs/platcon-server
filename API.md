# Platcon
A description

## Version: 0.0.1

---
## Members
Rotas Membros

### /members

#### GET
##### Summary

Retrieve all members

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Members retrieved successfully | [ [Member](#member) ] |

#### POST
##### Summary

Create member

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| body | body | Member data | Yes | [CreateMemberDto](#creatememberdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Member created successfully | [Member](#member) |
| 400 | Bad request / invalid input | [ErrorMessage](#errormessage) |

### /members/{id}

#### DELETE
##### Summary

Delete member by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | Member UUID | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Member deleted successfully | [SuccessMessage](#successmessage) |
| 404 | Member not found | [ErrorMessage](#errormessage) |

#### GET
##### Summary

Retrieve member by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | Member UUID | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Member retrieved successfully | [Member](#member) |
| 404 | Member not found | [ErrorMessage](#errormessage) |

#### PATCH
##### Summary

Update member by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | Member UUID | Yes | string |
| body | body | Member data to update | Yes | [UpdateMemberDto](#updatememberdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Member updated successfully | [SuccessMessage](#successmessage) |
| 400 | Bad request / invalid input | [ErrorMessage](#errormessage) |
| 404 | Member not found | [ErrorMessage](#errormessage) |

---
## Users
Rotas Usuários

### /users

#### GET
##### Summary

Retrieve all users

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Users retrieved successfully | [ [User](#user) ] |

#### POST
##### Summary

Create user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| body | body | User data | Yes | [CreateUserDto](#createuserdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | User created successfully | [User](#user) |
| 400 | Bad request / invalid input | [ErrorMessage](#errormessage) |

### /users/{id}

#### DELETE
##### Summary

Delete user by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | User UUID | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | User deleted successfully | [SuccessMessage](#successmessage) |
| 404 | User not found | [ErrorMessage](#errormessage) |

#### GET
##### Summary

Retrieve user by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | User UUID | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | User retrieved successfully | [User](#user) |
| 404 | User not found | [ErrorMessage](#errormessage) |

#### PATCH
##### Summary

Update user by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | User UUID | Yes | string |
| body | body | User data to update | Yes | [UpdateUserDto](#updateuserdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | User updated successfully | [SuccessMessage](#successmessage) |
| 400 | Bad request / invalid input | [ErrorMessage](#errormessage) |
| 404 | User not found | [ErrorMessage](#errormessage) |

---
### Models

#### CreateMemberDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | Member avatar (Google Docs) URI | No |
| description | string | Member description | Yes |
| stage_name | string | Member stage name | Yes |
| user_id | string | Member user UUID | No |
| website | [ string ] | Member website URLs | No |

#### CreateUserDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | User avatar (Google Docs) URI | No |
| email | string | User email | Yes |
| name | string | User name | Yes |
| password | string | User password | Yes |

#### ErrorMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| error | string | Error type | Yes |
| message | string | Error message | Yes |
| statusCode | number | HTTP status code | Yes |

#### Member

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | Member avatar (Google Docs) URI | Yes |
| description | string | Member description | Yes |
| id | string | Member UUID | Yes |
| stage_name | string | Member stage name | Yes |
| user_id | string | Member user UUID | No |
| website | [ string ] | Member website URLs | No |

#### SuccessMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string | Success message | Yes |

#### UpdateMemberDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | Member avatar (Google Docs) URI | No |
| description | string | Member description | No |
| stage_name | string | Member stage name | No |
| user_id | string | Member user UUID | No |
| website | [ string ] | Member website URLs | No |

#### UpdateUserDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | User avatar (Google Docs) URI | No |
| email | string | User email | No |
| name | string | User name | No |
| password | string | User password | No |

#### User

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | User avatar (Google Docs) URI | No |
| email | string | User email | Yes |
| id | string | User UUID | Yes |
| name | string | User name | Yes |
| password | string | User hashed password | No |
| role | string | User role<br>*Enum:* `"producer"`, `"user"` | Yes |
