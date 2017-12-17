const defaultConfig = require('./lib/defaultConfig')

module.exports = robot => {
  robot.on('pull_request_review.submitted', assignAfterReviewSubmitted)
}

async function assignAfterReviewSubmitted (context) {
  const { github } = context
  const userConfig = await context.config('pr_review_submit_unassign.yml')
  const config = Object.assign({}, defaultConfig, userConfig)

  const { pull_request, review } = context.payload
  const pullRequestOwner = pull_request.user.login
  const reviwer = review.user.login

  // NOTE not assign pull request owner if review is submitted by owner
  if (pullRequestOwner === reviwer) {
    return
  }

  let comment = ''

  if (config.unassignReviewer) {
    const params = context.issue({ body: { assignees: [reviwer] } })
    await github.issues.removeAssigneesFromIssue(params)
    comment += config.unassignTemplate.replace('{reviwer}', reviwer)
  }

  if (config.assignPullRequestOwner) {
    const params = context.issue({ body: { assignees: [pullRequestOwner] } })
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
