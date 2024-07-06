# Platcon
Plataforma de Conteúdos (Platcon) é um agregador de

## Version: 0.0.1

---
## Channels
Rotas Canais

### /channels

#### GET
##### Summary

Listar Canais

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Canais listados com sucesso | [ [Channel](#channel) ] |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### POST
##### Summary

Cadastrar Canal

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| body | body | Dados do Canal | Yes | [CreateChannelDto](#createchanneldto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Canal cadastrado com sucesso | [ChannelId](#channelid) |
| 400 | Requisição / input inválido | [ErrorMessage](#errormessage) |
| 409 | Canal já existe | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

### /channels/{id}

#### DELETE
##### Summary

Excluir Canal por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Canal | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Canal excluído com sucesso | [SuccessMessage](#successmessage) |
| 404 | Canal não encontrado | [ErrorMessage](#errormessage) |
| 409 | Canal possui dependências | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### GET
##### Summary

Buscar Canal por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Canal | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Canal encontrado com sucesso | [Channel](#channel) |
| 404 | Canal não encontrado | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### PATCH
##### Summary

Atualizar Canal por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Canal | Yes | string |
| body | body | Dados do Canal para atualizar | Yes | [UpdateChannelDto](#updatechanneldto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Canal atualizado com sucesso | [SuccessMessage](#successmessage) |
| 400 | Requisição / input inválido | [ErrorMessage](#errormessage) |
| 404 | Canal não encontrado | [ErrorMessage](#errormessage) |
| 409 | Canal já existe | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

---
## default

### /contents

#### GET
##### Summary

Listar Conteúdos

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Conteúdos listados com sucesso | [ [Content](#content) ] |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### POST
##### Summary

Cadastrar Conteúdo

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| body | body | Dados do Conteúdo | Yes | [CreateContentDto](#createcontentdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Conteúdo cadastrado com sucesso | [ContentId](#contentid) |
| 400 | Bad request / input inválido | [ErrorMessage](#errormessage) |
| 409 | Conteúdo já existe | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

### /contents/{id}

#### DELETE
##### Summary

Excluir Conteúdo por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Conteúdo | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Conteúdo excluído com sucesso | [SuccessMessage](#successmessage) |
| 404 | Conteúdo não encontrado | [ErrorMessage](#errormessage) |
| 409 | Conteúdo possui dependências | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### GET
##### Summary

Buscar Conteúdo por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Conteúdo | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Conteúdo encontrado com sucesso | [Content](#content) |
| 404 | Conteúdo não encontrado | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### PATCH
##### Summary

Atualizar Conteúdo por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Conteúdo | Yes | string |
| body | body | Dados do Conteúdo para atualizar | Yes | [UpdateContentDto](#updatecontentdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Conteúdo atualizado com sucesso | [SuccessMessage](#successmessage) |
| 400 | Bad request / input inválido | [ErrorMessage](#errormessage) |
| 404 | Conteúdo não encontrado | [ErrorMessage](#errormessage) |
| 409 | Conteúdo já existe | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

---
## Members
Rotas Membros

### /members

#### GET
##### Summary

Listar Membros

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Membros listados com sucesso | [ [Member](#member) ] |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### POST
##### Summary

Cadastrar Membro

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| body | body | Dados do Membro | Yes | [CreateMemberDto](#creatememberdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Membro cadastrado com sucesso | [MemberId](#memberid) |
| 400 | Bad request / input inválido | [ErrorMessage](#errormessage) |
| 409 | Membro já existe | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

### /members/{id}

#### DELETE
##### Summary

Excluir Membro por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Membro | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Membro excluído com sucesso | [SuccessMessage](#successmessage) |
| 404 | Membro não encontrado | [ErrorMessage](#errormessage) |
| 409 | Membro possui dependências | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### GET
##### Summary

Buscar Membro por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Membro | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Membro encontrado com sucesso | [Member](#member) |
| 404 | Membro não encontrado | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### PATCH
##### Summary

Atualizar Membro por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Membro | Yes | string |
| body | body | Dados do Membro para atualizar | Yes | [UpdateMemberDto](#updatememberdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Membro atualizado com sucesso | [SuccessMessage](#successmessage) |
| 400 | Bad request / input inválido | [ErrorMessage](#errormessage) |
| 404 | Membro não encontrado | [ErrorMessage](#errormessage) |
| 409 | Membro já existe | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

---
## Users
Rotas Usuários

### /users

#### GET
##### Summary

Listar Usuários

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Usuários listados com sucesso | [ [User](#user) ] |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### POST
##### Summary

Cadastrar Usuário

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| body | body | Dados do Usuário | Yes | [CreateUserDto](#createuserdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Usuário cadastrado com sucesso | [UserId](#userid) |
| 400 | Bad request / input inválido | [ErrorMessage](#errormessage) |
| 409 | Usuário já existe | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

### /users/{id}

#### DELETE
##### Summary

Excluir Usuário por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Usuário | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Usuário excluído com sucesso | [SuccessMessage](#successmessage) |
| 404 | Usuário não encontrado | [ErrorMessage](#errormessage) |
| 409 | Usuário possui dependências | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### GET
##### Summary

Buscar Usuário por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Usuário | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Usuário encontrado com sucesso | [User](#user) |
| 404 | Usuário não encontrado | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

#### PATCH
##### Summary

Atualizar Usuário por ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | UUID do Usuário | Yes | string |
| body | body | Dados do Usuário para atualizar | Yes | [UpdateUserDto](#updateuserdto) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Usuário atualizado com sucesso | [SuccessMessage](#successmessage) |
| 400 | Bad request / input inválido | [ErrorMessage](#errormessage) |
| 404 | Usuário não encontrado | [ErrorMessage](#errormessage) |
| 409 | Usuário já existe | [ErrorMessage](#errormessage) |
| 500 | Erro inesperado | [ErrorMessage](#errormessage) |

---
### Models

#### Channel

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| tags | [ string ] | Channel tags | Yes |
| contents | [ [Content](#content) ] | Content channel | Yes |
| cover_uri | string | Channel cover (Google Docs) URI | Yes |
| description | string | Channel description | Yes |
| id | string | Channel UUID | Yes |
| logo_uri | string | Channel logo (Google Docs) URI | Yes |
| members | [ string ] | Channel members | No |
| name | string | Channel name | Yes |

#### ChannelId

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | UUID do Canal | Yes |

#### Content

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| body | [Channel](#channel) | Content body | Yes |
| channel | [Channel](#channel) | Content channel | Yes |
| description | string | Content description | Yes |
| id | string | Content UUID | Yes |
| thumb_uri | string | Content thumb (Google Docs) URI | Yes |
| title | string | Content title | Yes |

#### ContentId

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | UUID do Conteúdo | Yes |

#### CreateChannelDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| tags | [ string ] | Tags do Canal | Yes |
| cover_uri | string | URI (Google Docs) da capa do Canal | No |
| description | string | Descrição do Canal | Yes |
| logo_uri | string | URI (Google Docs) da logo do Canal | No |
| members | [ string ] | Membros do Canal | No |
| name | string | Nome do Canal | Yes |

#### CreateContentBodyDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type | string | Tipo do Corpo | Yes |
| value | string | Conteúdo do Corpo | Yes |

#### CreateContentDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| body | [ [CreateContentBodyDto](#createcontentbodydto) ] | Corpo do Conteúdo | Yes |
| channel_id | string | ID do Canal associado | No |
| description | string | Descrição do Conteúdo | Yes |
| thumb_uri | string | URI (Google Docs) da thumb do Conteúdo | No |
| title | string | Título do Conteúdo | Yes |

#### CreateMemberDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | URI (Google Docs) do avatar do Membro | No |
| description | string | Descrição do Membro | Yes |
| stage_name | string | Nome artístico do Membro | Yes |
| user_id | string | ID do Usuário associado | No |
| website | [ string ] | Redes sociais do Membro | No |

#### CreateUserDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | URI (Google Docs) do avatar doUsuário | No |
| email | string | E-mail do Usuário | Yes |
| name | string | Nome do Usuário | Yes |
| password | string | Senha do Usuário | Yes |

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
| user | [User](#user) | Member user | No |
| website | [ string ] | Member website URLs | No |

#### MemberId

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | UUID do Membro | Yes |

#### SuccessMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string | Success message | Yes |

#### UpdateChannelDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| tags | [ string ] | Tags do Canal | No |
| cover_uri | string | URI (Google Docs) da capa do Canal | No |
| description | string | Descrição do Canal | No |
| logo_uri | string | URI (Google Docs) da logo do Canal | No |
| members | [ string ] | Membros do Canal | No |
| name | string | Nome do Canal | No |

#### UpdateContentDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| body | [ [CreateContentBodyDto](#createcontentbodydto) ] | Corpo do Conteúdo | No |
| channel_id | string | ID do Canal associado | No |
| description | string | Descrição do Conteúdo | No |
| thumb_uri | string | URI (Google Docs) da thumb do Conteúdo | No |
| title | string | Título do Conteúdo | No |

#### UpdateMemberDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | URI (Google Docs) do avatar do Membro | No |
| description | string | Descrição do Membro | No |
| stage_name | string | Nome artístico do Membro | No |
| user_id | string | ID do Usuário associado | No |
| website | [ string ] | Redes sociais do Membro | No |

#### UpdateUserDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | URI (Google Docs) do avatar doUsuário | No |
| email | string | E-mail do Usuário | No |
| name | string | Nome do Usuário | No |
| password | string | Senha do Usuário | No |

#### User

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| avatar_uri | string | User avatar (Google Docs) URI | No |
| email | string | User email | Yes |
| id | string | User UUID | Yes |
| name | string | User name | Yes |
| password | string | User hashed password | No |
| role | string | User role<br>*Enum:* `"producer"`, `"user"` | Yes |

#### UserId

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | UUID do Usuário | Yes |
