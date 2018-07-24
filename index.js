const defaultConfig = require('./lib/defaultConfig')

module.exports = robot => {
  robot.log('pr-review-submit-unassign is on!')
  robot.on('pull_request_review.submitted', assignAfterReviewSubmitted)
}

async function assignAfterReviewSubmitted (context) {
  const { github } = context
  const userConfig = await context.config('pr_review_submit_unassign.yml')
  const config = Object.assign({}, defaultConfig, userConfig)

  const { pull_request, review } = context.payload
  const pullRequestOwner = pull_request.user.login
  const reviewer = review.user.login

  // NOTE not assign pull request owner if review is submitted by owner
  if (pullRequestOwner === reviewer) {
    return
  }

  let comment = ''

  if (config.unassignReviewer) {
    const params = context.issue({ assignees: [reviewer] })
    await github.issues.removeAssigneesFromIssue(params)
    comment += config.unassignTemplate.replace('{reviewer}', reviewer)
  }

  if (config.assignPullRequestOwner) {
    const params = context.issue({ assignees: [pullRequestOwner] })
    await github.issues.addAssigneesToIssue(params)

    if (config.unassignReviewer) {
      comment += ', '
    }

    comment += config.assignTemplate.replace(
      '{pullRequestOwner}',
      pullRequestOwner
    )
  }

  if (config.leaveComment) {
    const commentParams = context.issue({ body: comment })
    await github.issues.createComment(commentParams)
  }
}

module.exports.assignAfterReviewSubmitted = assignAfterReviewSubmitted
