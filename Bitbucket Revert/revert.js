/* revert.js
 * Revert bitbucket merge script generator. 
 * Used in chrome extension.
 * Version 1.1
 * 2017-07-13 18:25:19
 *
 * By Tomasz Foryś
 * License: MIT
 *   See https://github.com/infoShare/BitbucketRevert/blob/master/LICENSE.md
 */
var sha_length = 11;
var MERGED = "MERGED";
var TO = " to ";
var IN_COMMIT = "in commit";
var SLASH = "/";
var PROJECTS = "/projects/";
var REPOS = "/repos/";

var branch = "cd \"DIR\"\r\ngit fetch origin\r\ngit checkout -b REV_BRANCH origin/BRANCH_TO\r\ngit revert -m 1 COMMIT\r\ngit push origin REV_BRANCH";
var merge = "cd \"DIR\"\r\ngit fetch origin\r\ngit checkout BRANCH_TO\r\ngit revert -m 1 COMMIT\r\ngit push origin BRANCH_TO";
var json  = '{"""title""":"""STORY""","""description""":"""STORY""","""state""":"""OPEN""","""open""":true,"""closed""":false,"""fromRef""":{"""id""":"""refs/heads/REV_BRANCH""","""repository""":{"""slug""":"""SLG""","""name""":null,"""project""":{"""key""":"""PRJ"""}}},"""toRef""":{"""id""":"""refs/heads/BRANCH_TO""","""repository""":{"""slug""":"""SLG""","""name""":null,"""project""":{"""key""":"""PRJ"""}}},"""locked""":false,"""links""":{"""self""":[null]}}';
var curl = "\r\ncurl -H \"Content-Type: application/json\" -X POST -u USER:PASSWORD -d \""+json+"\" REPO/rest/api/1.0/projects/PRJ/repos/SLG/pull-requests";

var saveScript = function(config){
	chrome.storage.sync.get(["dir", "usr", "pwd", "action"],function(storage){
		if(!storage.dir){
			alert("Please verify and save plugin configuration");
			return;
		}
		var action = storage.action;
		var revert_branch = config.branch_from+"_rev";
		
		var script = "";
		if(action){
			switch(action){
				case 1:{
					script = createPullRequest(config, revert_branch, storage);
					break;
				}
				case 2:{
					script = createCommitRequest(config, revert_branch, storage);
					break;
				}
			}
		}
		script+="\r\nset /p END=Hit ENTER to continue...";
		saveFile(script, config.branch_from);
	});
}

var createPullRequest = function(config, revert_branch, storage){
	var script = branch.replace(/DIR/g, storage.dir).replace(/REV_BRANCH/g, revert_branch)
						.replace(/COMMIT/g, config.sha).replace(/BRANCH_TO/g, config.branch_to);
	
	var story = "Revert " + config.branch_from + " from commit " + config.sha;
	script+=curl.replace(/STORY/g,story).replace(/REV_BRANCH/g,revert_branch)
		.replace(/USER/g, storage.usr).replace(/PASSWORD/g, storage.pwd).replace(/REPO/g, config.repository)
		.replace(/PRJ/g, config.project).replace(/SLG/g, config.repo)
		.replace(/BRANCH_TO/g, config.branch_to);
	return script;
}

var createCommitRequest = function(config, revert_branch, storage){
	return merge.replace(/DIR/g, storage.dir).replace(/REV_BRANCH/g, revert_branch).replace(/COMMIT/g, config.sha)
		.replace(/BRANCH_TO/g, config.branch_to);
}

var saveFile = function(content, branch){
	var blob = new Blob([content], {type: "application/bat;charset=utf-8"});
	saveAs(blob, "revert_"+branch+".bat");
}

chrome.browserAction.onClicked.addListener( 
	function(tab) {
		if(chrome.tabs==null){
			return;
		}
		chrome.tabs.executeScript( {code: "window.getSelection().toString();"}, function(selection) {
			if(selection == null || selection[0].indexOf(MERGED)==-1 || selection[0].indexOf(IN_COMMIT)==-1){
				alert("Please select merge line");
			}else{
				var selected = selection[0];
				
				var merge_start = selected.indexOf(MERGED);
				var branch_from_start = merge_start + MERGED.length + 1;
				var branch_from_end = selected.indexOf(" ", branch_from_start);
				var branch_from_name = selected.substring(branch_from_start, branch_from_end);
				
				var branch_to_start = selected.indexOf(TO);
				var branch_to_start = branch_to_start + TO.length;
				var branch_to_end = selected.indexOf(" ", branch_to_start);
				var branch_to_name = selected.substring(branch_to_start, branch_to_end);
				
				var in_commit_start = selected.indexOf(IN_COMMIT);
				var commit_start = in_commit_start + IN_COMMIT.length + 1;
				var commit_sha = selected.substring(commit_start, commit_start + sha_length);
				
				var url = tab.url;
				
				var repository_end = url.indexOf(SLASH, 10);
				var repository = url.substring(0, repository_end);
				
				var projects_start = url.indexOf(PROJECTS, repo_end);
				var project_start = projects_start + PROJECTS.length;
				var project_end = url.indexOf(SLASH, project_start);
				var project_name = url.substring(project_start, project_end);
				
				var repos_start = url.indexOf(REPOS, project_end);
				var repo_start = repos_start + REPOS.length;
				var repo_end = url.indexOf(SLASH, repo_start);
				var repo_name = url.substring(repo_start, repo_end);
				
				var config = {
					branch_from: branch_from_name,
					branch_to: branch_to_name,
					sha: commit_sha,
					repository: repository,
					project: project_name,
					repo: repo_name
				}
				
				saveScript(config);
			}
		});
	}
);

