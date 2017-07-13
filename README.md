## Bitbucket Revert

Bitbucket Revert is a chrome extension for bitbucket pull request merge revert script generation.

### Features!

  - Create new branch with reverted changes
  - Automatically creates pull request for newly created revert branch
  - Flexible configuration
  - Simple usage

### Requirements
 - **Git** and **curl** on PATH Environment Variable 
  
### How it works

1) Install chrome extension - [Download]

2) Select options on plugin icon context menu

[![N|Solid](https://github.com/infoShare/BitbucketRevert/blob/master/Screens/options.png)](https://github.com/infoShare/BitbucketRevert)

3) Configure plugin and save changes

[![N|Solid](https://github.com/infoShare/BitbucketRevert/blob/master/Screens/config.png)](https://github.com/infoShare/BitbucketRevert)

4) Select text on merge commit

[![N|Solid](https://github.com/infoShare/BitbucketRevert/blob/master/Screens/merge.jpg)](https://github.com/infoShare/BitbucketRevert)

5) Click plugin icon

[![N|Solid](https://github.com/infoShare/BitbucketRevert/blob/master/Screens/icon.png)](https://github.com/infoShare/BitbucketRevert)

6) Download and execute bat file - revert_[BRANCH].bat

```sh
cd "[DIR]"
git fetch origin
git checkout -b [REV_BRANCH] origin/master
git revert -m 1 [SHA]
git push origin [REV_BRANCH]
echo {"title":"Revert [BRANCH]","description":"Revert [BRANCH]","state":"OPEN","open":true,"closed":false,"fromRef":{"id":"refs/heads/[REV_BRANCH]","repository":{"slug":"[SLUG]","name":null,"project":{"key":"[PROJECT]"}}},"toRef":{"id":"refs/heads/master","repository":{"slug":"[SLUG]","name":null,"project":{"key":"[PROJECT]"}}},"locked":false,"links":{"self":[null]}} > req.json
curl -H "Content-Type: application/json" -X POST -u [USER]:[PASS] -d "@req.json" [REPO]/rest/api/1.0/projects/[PROJECT]/repos/[SLUG]/pull-requests
set /p END=Hit ENTER to continue...
```

7) Enjoy your newly created pull request for reverted merge!

 [Download]: <https://github.com/infoShare/BitbucketRevert/raw/master/Bitbucket%20Revert.crx>