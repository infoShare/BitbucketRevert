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
var IN_COMMIT = "in commit";

var scr = "cd \"DIR\"\r\ngit fetch origin\r\ngit checkout -b REV_BRANCH origin/master\r\ngit revert -m 1 COMMIT\r\ngit push origin REV_BRANCH";
var json  = '{"""title""":"""STORY""","""description""":"""STORY""","""state""":"""OPEN""","""open""":true,"""closed""":false,"""fromRef""":{"""id""":"""refs/heads/REV_BRANCH""","""repository""":{"""slug""":"""SLG""","""name""":null,"""project""":{"""key""":"""PRJ"""}}},"""toRef""":{"""id""":"""refs/heads/master""","""repository""":{"""slug""":"""SLG""","""name""":null,"""project""":{"""key""":"""PRJ"""}}},"""locked""":false,"""links""":{"""self""":[null]}}';
var curl = "curl -H \"Content-Type: application/json\" -X POST -u USER:PASSWORD -d \""+json+"\" REPO/rest/api/1.0/projects/PRJ/repos/SLG/pull-requests";

var saveScript = function(branch, commit){
	chrome.storage.sync.get(["dir", "usr", "pr", "pwd", "repo", "prj", "slg"],function(storage){
		var directory = storage.dir;
		var pr = storage.pr;
		var usr = storage.usr;
		var pwd = storage.pwd;
		
		var revert_branch = branch+"_rev";
		
		var script = scr.replace(/DIR/g,directory).replace(/REV_BRANCH/g, revert_branch).replace(/COMMIT/g, commit);
		if(pr){
			if(usr && usr.length>0 && pwd && pwd.length>0){
				script = addPullRequest(script, branch, revert_branch, storage);
			}else{
				alert("Bitbucket username or password is missing, pull request will not be created");
			}
		}
		script+="\r\nset /p END=Hit ENTER to continue...";
		saveFile(script, branch);
	});
}

var addPullRequest = function(script, branch, revert_branch, storage){
	script+="\r\n"+curl.replace(/STORY/g,"Revert "+branch).replace(/REV_BRANCH/g,revert_branch)
		.replace(/USER/g, storage.usr).replace(/PASSWORD/g, storage.pwd).replace(/REPO/g, storage.repo)
		.replace(/PRJ/g, storage.prj).replace(/SLG/g, storage.slg);
	return script;
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
				var branch_start = merge_start + MERGED.length + 1;
				var branch_end = selected.indexOf(" ", branch_start);
				var branch_name = selected.substring(branch_start, branch_end);
				
				var in_commit_start = selected.indexOf(IN_COMMIT);
				var commit_start = in_commit_start + IN_COMMIT.length + 1;
				var commit_sha = selected.substring(commit_start, commit_start + sha_length);
				
				saveScript(branch_name, commit_sha);
			}
		});
	}
);

