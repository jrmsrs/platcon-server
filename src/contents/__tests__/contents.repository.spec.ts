import { Test, TestingModule } from '@nestjs/testing'

import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult, InsertResult } from 'typeorm'
import { faker } from '@faker-js/faker'
import { PostgresError as PgError } from 'pg-error-enum'

import { ContentsRepository } from '#contents/contents.repository'
import { Content } from '#contents/entities/content.entity'
import { CreateContentDto, UpdateContentDto } from '#contents/dto'
import {
  contentBodyMock,
  contentMock,
  createContentBodyMock,
  createContentMock,
} from '#contents/__mocks__'
import {
  NotFoundError,
  StateConflictError,
  UnaffectedError,
  UnexpectedError,
  UniqueViolationError,
  FKViolationError,
} from '#utils/errors'
import { channelMock } from '#app/channels/__mocks__'
import { ContentBody } from '../entities/content-body.entity'

describe('ContentsRepository', () => {
  let repository: ContentsRepository
  let contentRepository: Repository<Content>
  let bodyRepository: Repository<ContentBody>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentsRepository,
        {
          provide: getRepositoryToken(Content),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ContentBody),
          useClass: Repository,
        },
      ],
    }).compile()

    repository = module.get<ContentsRepository>(ContentsRepository)
    contentRepository = module.get<Repository<Content>>(
      getRepositoryToken(Content)
    )
    bodyRepository = module.get<Repository<ContentBody>>(
      getRepositoryToken(ContentBody)
    )
  })

  describe('insertContent', () => {
    it('should insert a new content', async () => {
      const createContentDto: CreateContentDto = {
        ...createContentMock,
        body: [createContentBodyMock],
      }
      const content: Content = {
        ...createContentMock,
        id: faker.string.uuid(),
        channel: channelMock,
        body: [contentBodyMock],
      }
      jest
        .spyOn(contentRepository, 'insert')
        .mockResolvedValue({ raw: [content] } as InsertResult)
      jest.spyOn(bodyRepository, 'insert').mockResolvedValue({} as InsertResult)

      const result = await repository.create(createContentDto)

      expect(result).toEqual(content)
    })

    it('should throw an error if referenced entity does not exist', async () => {
      const createContentDto: CreateContentDto = createContentMock
      jest
        .spyOn(contentRepository, 'insert')
        .mockRejectedValue({ code: PgError.FOREIGN_KEY_VIOLATION })

      try {
        await repository.create(createContentDto)
      } catch (error) {
        expect(error).toBeInstanceOf(FKViolationError)
      }
    })

    it('should throw an error if content already exists', async () => {
      const createContentDto: CreateContentDto = createContentMock
      jest
        .spyOn(contentRepository, 'insert')
        .mockRejectedValue({ code: PgError.UNIQUE_VIOLATION })

      try {
        await repository.create(createContentDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueViolationError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const createContentDto: CreateContentDto = createContentMock
      jest.spyOn(contentRepository, 'insert').mockRejectedValue(new Error())

      try {
        await repository.create(createContentDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('findAll', () => {
    it('should return an array of contents', async () => {
      const contents: Content[] = [contentMock]
      jest.spyOn(contentRepository, 'find').mockResolvedValue(contents)

      const result = await repository.findAll()

      expect(result).toEqual(contents)
    })

    it('should throw an error if an unexpected error occurs', async () => {
      jest.spyOn(contentRepository, 'find').mockRejectedValue(new Error())

      try {
        await repository.findAll()
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('findOne', () => {
    it('should return a content by id', async () => {
      const id = faker.string.uuid()
      const content: Content = contentMock
      jest.spyOn(contentRepository, 'findOne').mockResolvedValue(content)

      const result = await repository.findOne(id)

      expect(result).toEqual(content)
    })

    it('should throw an error if content is not found', async () => {
      const id = faker.string.uuid()
      jest.spyOn(contentRepository, 'findOne').mockResolvedValue(null)

      try {
        await repository.findOne(id)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      jest.spyOn(contentRepository, 'findOne').mockRejectedValue(new Error())

      try {
        await repository.findOne(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('updateContent', () => {
    it('should update a content by id', async () => {
      const id = faker.string.uuid()
      const updateContentDto: UpdateContentDto = {
        description: faker.lorem.sentence(),
        body: [createContentBodyMock],
      }
      const updateResult: UpdateResult = {
        raw: [],
        affected: 1,
      } as UpdateResult
      jest.spyOn(contentRepository, 'update').mockResolvedValue(updateResult)
      jest.spyOn(bodyRepository, 'delete').mockResolvedValue({} as DeleteResult)
      jest.spyOn(bodyRepository, 'insert').mockResolvedValue({} as InsertResult)

      const result = await repository.update(id, updateContentDto)

      expect(result).toEqual(updateResult)
    })

    it('should update a content by id with a channel id', async () => {
      const id = faker.string.uuid()
      const updateContentDto: UpdateContentDto = {
        channel_id: channelMock.id,
      }
      const updateResult: UpdateResult = {
        raw: [],
        affected: 1,
      } as UpdateResult
      jest.spyOn(contentRepository, 'update').mockResolvedValue(updateResult)

      const result = await repository.update(id, updateContentDto)

      expect(result).toEqual(updateResult)
    })

    it('should throw an error if content is not found', async () => {
      const id = faker.string.uuid()
      const updateContentDto: UpdateContentDto = {
        description: faker.lorem.sentence(),
      }
      jest
        .spyOn(contentRepository, 'update')
        .mockResolvedValue({ raw: [], affected: 0 } as UpdateResult)

      try {
        await repository.update(id, updateContentDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnaffectedError)
      }
    })

    it('should throw an error if referenced entity does not exist', async () => {
      const id = faker.string.uuid()
      const updateContentDto: UpdateContentDto = {
        description: faker.lorem.sentence(),
      }
      jest
        .spyOn(contentRepository, 'update')
        .mockRejectedValue({ code: PgError.FOREIGN_KEY_VIOLATION })

      try {
        await repository.update(id, updateContentDto)
      } catch (error) {
        expect(error).toBeInstanceOf(FKViolationError)
      }
    })

    it('should throw an error if content already exists', async () => {
      const id = faker.string.uuid()
      const updateContentDto: UpdateContentDto = {
        description: faker.lorem.sentence(),
      }
      jest
        .spyOn(contentRepository, 'update')
        .mockRejectedValue({ code: PgError.UNIQUE_VIOLATION })

      try {
        await repository.update(id, updateContentDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueViolationError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      const updateContentDto: UpdateContentDto = {
        description: faker.lorem.sentence(),
      }
      jest.spyOn(contentRepository, 'update').mockRejectedValue(new Error())

      try {
        await repository.update(id, updateContentDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('removeContent', () => {
    it('should delete a content by id', async () => {
      const id = faker.string.uuid()
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      } as DeleteResult
      jest.spyOn(contentRepository, 'delete').mockResolvedValue(deleteResult)

      const result = await repository.remove(id)

      expect(result).toEqual(deleteResult)
    })

    it('should throw an error if content is not found', async () => {
      const id = faker.string.uuid()
      jest
        .spyOn(contentRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 0 } as DeleteResult)

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnaffectedError)
      }
    })

    it('should throw an error if trying to delete a content with restrict constraint', async () => {
      const id = faker.string.uuid()
      jest
        .spyOn(contentRepository, 'delete')
        .mockRejectedValue({ code: PgError.FOREIGN_KEY_VIOLATION })

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(StateConflictError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      jest.spyOn(contentRepository, 'delete').mockRejectedValue(new Error())

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })
})
