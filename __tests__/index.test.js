/* eslint-env jest */

const { merge } = require('lodash')

const defaultConfig = require('../lib/defaultConfig')
const { assignAfterReviewSubmitted } = require('../index')

function mockContext (userConfig = {}) {
  return {
    config: async () => merge({}, defaultConfig, userConfig),
    payload: {
      pull_request: { user: { login: 'foo' } },
      review: { user: { login: 'bar' } }
    },
    github: {
      issues: {
        addAssigneesToIssue: jest.fn(),
        createComment: jest.fn(),
        removeAssigneesFromIssue: jest.fn()
      }
    },
    issue: body => body
  }
}

describe('assignAfterReviewSubmitted', () => {
  test('assign and unassign but not leave comment', async () => {
    const context = mockContext()
    await assignAfterReviewSubmitted(context)

    const {
      addAssigneesToIssue,
      createComment,
      removeAssigneesFromIssue
    } = context.github.issues

    expect(removeAssigneesFromIssue).toHaveBeenCalled()
    expect(removeAssigneesFromIssue).toHaveBeenCalledWith({
      body: { assignees: ['bar'] }
    })

    expect(addAssigneesToIssue).toHaveBeenCalled()
    expect(addAssigneesToIssue).toHaveBeenCalledWith({
      body: { assignees: ['foo'] }
    })

    expect(createComment).not.toHaveBeenCalled()
  })

  test('leaves comment if leaveComment is true', async () => {
    const context = mockContext({ leaveComment: true })
    await assignAfterReviewSubmitted(context)

    const { createComment } = context.github.issues

    expect(createComment).toHaveBeenCalled()
    expect(createComment).toHaveBeenCalledWith({
      body: 'unassign @bar, assign @foo'
    })
  })

  test('not unassign reviewer if unassignReviewer is false', async () => {
    const context = mockContext({ unassignReviewer: false })
    await assignAfterReviewSubmitted(context)
    const { removeAssigneesFromIssue } = context.github.issues
    expect(removeAssigneesFromIssue).not.toHaveBeenCalled()
  })

  test('not assign pull request owner if assignPullRequestOwner is false', async () => {
    const context = mockContext({ assignPullRequestOwner: false })
    await assignAfterReviewSubmitted(context)
    const { addAssigneesToIssue } = context.github.issues
    expect(addAssigneesToIssue).not.toHaveBeenCalled()
  })

  test('leaves comment with assign template if assignTemplate is assigned', async () => {
    const context = mockContext({
      leaveComment: true,
      assignTemplate: '@{pullRequestOwner} assigned'
    })
    await assignAfterReviewSubmitted(context)

    const { createComment } = context.github.issues

    expect(createComment).toHaveBeenCalled()
    expect(createComment).toHaveBeenCalledWith({
      body: 'unassign @bar, @foo assigned'
    })
  })

  test('leaves comment with unassign template if unassignTemplate is assigned', async () => {
    const context = mockContext({
      leaveComment: true,
      unassignTemplate: '@{reviewer} unassigned'
    })
    await assignAfterReviewSubmitted(context)

    const { createComment } = context.github.issues

    expect(createComment).toHaveBeenCalled()
    expect(createComment).toHaveBeenCalledWith({
      body: '@{reviewer} unassigned, assign @foo'
    })
  })
})
