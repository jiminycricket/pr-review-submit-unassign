module.exports = robot => {
  robot.on('pull_request_review.submitted', async context => {
    const repoOwner = context.payload.pull_request.user.login;
    const reviwer = context.payload.review.user.login;
    const commentMsg = `unassign @${reviwer}, assign @${repoOwner}`;
    if (repoOwner === reviwer) {
      return;
    }
    const commentParams = context.issue({ body: commentMsg })
    const addAssigneesParams = context.issue({ assignees: [repoOwner] })
    const removeAssigneesParams = context.issue({ body: {
      assignees: [reviwer] }
    })

    context.github.issues.addAssigneesToIssue(addAssigneesParams);
    context.github.issues.removeAssigneesFromIssue(removeAssigneesParams);
    return context.github.issues.createComment(commentParams);
  });
}