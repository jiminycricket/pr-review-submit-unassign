const lodash = require('lodash')
const defaultConfig = require('./lib/defaultConfig')

module.exports = robot => {
  robot.log('pr-review-submit-unassign is on!')

  robot.on('pull_request_review.submitted', async context => {
    const repoOwner = lodash.get(context.payload, 'pull_request.user.login')
    const reviewer = lodash.get(context.payload, 'review.user.login')
    if (repoOwner === reviewer) {
      return
    }

    let commentMessage = ''

    const userConfig = await context.config('pr_review_submit_unassign.yml')
    const config = { ...defaultConfig, ...userConfig }

    if (config.unAssignReviewer) {
      const params = context.issue({ assignees: [reviewer] })
      await context.github.issues.removeAssigneesFromIssue(params)
      commentMessage += config.commentUnassign.replace('{reviwer}', reviewer)
    }

    if (config.assignPrOwner) {
      const params = context.issue({ assignees: [repoOwner] })
      await context.github.issues.addAssigneesToIssue(params)
      commentMessage += config.unAssignReviewer ? ', \n' : ''
      commentMessage += config.commentAssign.replace('{repoOwner}', repoOwner)
    }

    if (commentMessage) {
      const commentParams = context.issue({ body: commentMessage })
      context.github.issues.createComment(commentParams)
    }
  })
}
