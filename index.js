const defaultConfig = require('./lib/defaultConfig');

module.exports = robot => {
  robot.on('pull_request_review.submitted', async context => {

    const repoOwner = context.payload.pull_request.user.login;
    const reviwer = context.payload.review.user.login;

    let commentMsg = ``;

    if (repoOwner === reviwer) {
      return;
    }

    const userConfig = await context.config('pr_review_submit_unassign.yml');
    const config = Object.assign({}, defaultConfig, userConfig);

    if (config.unAssignReviwer) {
      const removeAssigneesParams = context.issue({
        body: {
          assignees: [reviwer]
        }
      });
      context.github.issues.removeAssigneesFromIssue(removeAssigneesParams);
      commentMsg += config.commentUnassign.replace('{reviwer}', reviwer);
    }
    
    if (config.assignPrOwner) {
      const addAssigneesParams = context.issue({ assignees: [repoOwner] });
      context.github.issues.addAssigneesToIssue(addAssigneesParams);
      commentMsg += (config.unAssignReviwer ? ', \n' : '') + config.commentAssign.replace('{repoOwner}', repoOwner)
    }

    if (commentMsg) {
      const commentParams = context.issue({ body: commentMsg });
      context.github.issues.createComment(commentParams);
    }

    return;
  });
}