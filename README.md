# pr-review-submit-unassign

[![GitHub release](https://img.shields.io/github/release/jiminycricket/pr-review-submit-unassign.svg)](https://github.com/jiminycricket/pr-review-submit-unassign/releases) [![GitHub license](https://img.shields.io/github/license/jiminycricket/pr-review-submit-unassign.svg)](https://github.com/jiminycricket/pr-review-submit-unassign/blob/master/LICENSE)

> a GitHub App built with [probot](https://github.com/probot/probot) that 
> can unasign reviewer and asign pull request owner when pull request review submited.

## Setup

```bash
# Install dependencies
npm install

# Run the bot
npm start
```

See [docs/deploy.md](docs/deploy.md) if you would like to run your own instance of this app.

## Config

Set up `.github/pr_review_submit_unassign.yml`

### Default

```yaml
---
assignPullRequestOwner: true,
assignTemplate: 'assign @{pullRequestOwner}',
leaveComment: false,
unassignReviewer: true,
unassignTemplate: 'unassign @{reviwer}'
``` 
