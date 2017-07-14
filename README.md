## Bitbucket Revert

Bitbucket Revert is a chrome extension for Bitbucket pull request merge revert script generation.

### Features:
  - Implemented 2 options:
	+ Commit reverted changes
	+ Create branch for reverted changes and bitbucket pull request
  - Flexible configuration
  - Simple usage

### Requirements:
 - **Windows** - using batch script to execute actions
 - **Git** and **curl (for pull request option)** on PATH Environment Variable 
  
### How it works

#### 1) Install chrome extension - [Download]

#### 2) Select options on plugin icon context menu

[![N|Solid](https://github.com/infoShare/BitbucketRevert/blob/master/Screens/options.png)](https://github.com/infoShare/BitbucketRevert)

#### 3) Configure plugin and save changes

[![N|Solid](https://github.com/infoShare/BitbucketRevert/blob/master/Screens/config.png)](https://github.com/infoShare/BitbucketRevert)

#### 4) Select text on merge commit

[![N|Solid](https://github.com/infoShare/BitbucketRevert/blob/master/Screens/merge.jpg)](https://github.com/infoShare/BitbucketRevert)

#### 5) Click plugin icon

[![N|Solid](https://github.com/infoShare/BitbucketRevert/blob/master/Screens/icon.png)](https://github.com/infoShare/BitbucketRevert)

#### 6) Download and execute bat file - revert_[BRANCH].bat

###### Pull request option example:

```sh
cd "C:\cms"
git fetch origin
git checkout -b feature/US1234_rev origin/master
git revert -m 1 01234567890
git push origin feature/US1234_rev
curl -H "Content-Type: application/json" -X POST -u admin:password -d "{"""title""":"""Revert feature/US1234""","""description""":"""Revert feature/US1234""","""state""":"""OPEN""","""open""":true,"""closed""":false,"""fromRef""":{"""id""":"""refs/heads/feature/US1234_rev""","""repository""":{"""slug""":"""cms""","""name""":null,"""project""":{"""key""":"""CMS"""}}},"""toRef""":{"""id""":"""refs/heads/master""","""repository""":{"""slug""":"""cms""","""name""":null,"""project""":{"""key""":"""CMS"""}}},"""locked""":false,"""links""":{"""self""":[null]}}" https://git.sbr.com/rest/api/1.0/projects/CMS/repos/cms/pull-requests
set /p END=Hit ENTER to continue...
```

###### Commit revert option example:

```sh
cd "C:\cms"
git checkout master
git revert -m 1 01234567890
git push origin master
set /p END=Hit ENTER to continue...
```

#### 7) Enjoy your newly created pull request for reverted merge!

 [Download]: <https://github.com/infoShare/BitbucketRevert/raw/master/Bitbucket%20Revert.crx>