import { HttpStatus } from '@nestjs/common'

export const testController = (
  serviceFn: (...args: any) => any,
  apiRes: { status: jest.Mock<any, any, any>; send: jest.Mock<any, any, any> },
  expectedStatus: HttpStatus,
  expectedRes: object,
  fnArgs?: (object | string)[]
) => {
  if (fnArgs?.length > 0) {
    expect(serviceFn).toHaveBeenCalledWith(...fnArgs)
  } else {
    expect(serviceFn).toHaveBeenCalled()
  }
  expect(apiRes.status).toHaveBeenCalledWith(expectedStatus)
  expect(apiRes.send).toHaveBeenCalledWith(expectedRes)
}
